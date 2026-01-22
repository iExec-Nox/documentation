---
title: Nox Smart Contracts
description: Core smart contracts of Nox protocol
---

## Overview

The Nox protocol consists of several core smart contracts that orchestrate confidential computations, manage access control, and coordinate the off-chain TEE infrastructure. These contracts work together to provide a secure, decentralized platform for executing confidential smart contract operations.

## Core Contracts

The Nox protocol includes the following smart contracts:

- **Registry**: Component registration and attestation management
- **TEEComputeManager**: Central orchestration of confidential computations
- **ACL Manager**: Access control list for encrypted data handles
- **Fee Manager**: Fee collection and distribution
- **Governance Manager**: Protocol evolution and component revocation

## Registry

The Registry contract manages the registration and attestation of all TEE components in the network.

### Purpose

- Registers TEE components (Runners, KMS nodes, KMS Manager, Orchestrators, Handle Gateway, Ingestors)
- Stores public keys and attestations for component verification
- Manages component roles using OpenZeppelin's `AccessControl`
- Enables signature verification for inter-component communication

### Key Features

- **Role-Based Access**: Uses OpenZeppelin `AccessControl` to manage component identities
- **Remote Attestation**: Components must publish remote attestations proving they run in legitimate TEEs
- **Component Verification**: Other components can verify signatures using registered public keys
- **Revocation Support**: Compromised components can be revoked by governance

### Registration Process

1. Component generates a public/private key pair within its TEE
2. Component publishes its public key and remote attestation to the Registry
3. Protocol admin grants appropriate role (e.g., `GATEWAY_ROLE`) to the component
4. Component can now participate in the network and sign messages

## TEEComputeManager

The TEEComputeManager is the central contract that orchestrates confidential computations and verifies encrypted data handles.

### Core Functions

#### `verifyInput(bytes32 inputHandle, bytes memory inputProof)`

Verifies the authenticity of an external handle (encrypted data reference) created by the Gateway.

**Process:**
1. Parses the EIP-712 proof containing handle metadata and signature
2. Verifies the signature using the Gateway's public key from the Registry
3. Grants transient access permissions via ACL
4. Emits `HandleVerified` event

**Returns:** The verified handle

#### `trivialEncrypt(uint256 plaintext)`

Creates a handle for a public plaintext value (e.g., initializing counters, constants).

**Process:**
1. Generates deterministic handle: `keccak256("trivial", plaintext, acl, chainId)`
2. Grants transient access via ACL
3. Emits `TrivialEncrypt` event

**Use Cases:**
- Initializing counters to zero
- Encrypted constants
- Public values needed in confidential computations

#### Computation Primitives

The TEEComputeManager emits events for various computation primitives (add, sub, mul, etc.) that trigger off-chain execution by the TEE network. Each primitive emits a specific event with explicit operand ordering to ensure non-commutative operations are correctly interpreted.

### Event Emission

The contract emits events that are detected by the [Ingestor](/protocol/ingestor) service, which forwards computation requests to the off-chain TEE infrastructure. Events include:

- `ComputeRequested`: Triggers confidential computation execution
- `HandleVerified`: Confirms handle verification
- `TrivialEncrypt`: Records trivial encryption operations

## ACL Manager

The ACL (Access Control List) Manager contract controls access permissions for encrypted data handles.

### Permission Model

The ACL manages two orthogonal aspects:

1. **Roles**: Define authorized actions
   - **Admin**: Full control (compute, grant permissions, add viewers)
   - **Viewer**: Read-only access (decrypt only)

2. **Persistence**: Define permission lifetime
   - **Persistent**: Stored in EVM storage, survives transactions
   - **Transient**: Uses EIP-1153 transient storage, auto-revoked at transaction end

### Key Functions

- `allow(bytes32 handle, address account)`: Grants persistent admin permission
- `allowThis(bytes32 handle)`: Converts transient permission to persistent
- `addViewer(bytes32 handle, address viewer)`: Grants viewer permission
- `allowTransient(bytes32 handle, address account)`: Grants transient permission for current transaction
- `isAllowed(bytes32 handle, address account)`: Checks if account has permission

### Permission Verification

Before executing computations, the TEEComputeManager verifies permissions via the ACL contract. Transient permissions are automatically revoked after transaction completion, providing enhanced security for one-time operations.

## Fee Manager

The Fee Manager contract handles fee collection and distribution for protocol operations.

### Responsibilities

- **Fee Collection**: Collects transaction fees for computation requests
- **Fee Distribution**: Distributes fees to protocol participants (Runners, validators, etc.)
- **Sponsoring Mechanism**: Enables fee sponsoring where one party pays fees for another's operations

### Integration

The Fee Manager is called by the TEEComputeManager when computation requests are submitted, reserving fees before emitting computation events.

## Governance Manager

The Governance Manager contract manages protocol evolution and component lifecycle.

### Responsibilities

- **Protocol Upgrades**: Manages code evolution and protocol improvements
- **Component Revocation**: Revokes compromised or unauthorized components
- **Policy Management**: Updates protocol policies and parameters

### Security

Only authorized governance addresses can execute governance functions, ensuring controlled protocol evolution.

## TEEPrimitive Library

The TEEPrimitive library provides a high-level interface for developers to interact with confidential computations.

### Purpose

- Simplifies integration of confidential operations into smart contracts
- Abstracts low-level TEEComputeManager interactions
- Provides type-safe encrypted integer types (euint8, euint16, ..., euint256)

### Key Functions

#### Trivial Encryption

```solidity
function asEuint256(uint256 value) internal returns (euint256)
```

Creates an encrypted handle for a public plaintext value.

#### Input Verification

```solidity
function fromExternal(externalEuint256 inputHandle, bytes memory inputProof)
    internal returns (euint256)
```

Verifies an external handle with its proof and grants transient access.

#### Arithmetic Operations

```solidity
function add(euint256 a, euint256 b) internal returns (euint256)
function sub(euint256 a, euint256 b) internal returns (euint256)
```

Perform confidential arithmetic operations, emitting events for off-chain execution.

### Storage Configuration

The library uses ERC-7201 compatible fixed storage slots to store TEE service configuration (TEEComputeManager and ACL addresses).

## TEEChainConfig

The TEEChainConfig abstract contract automatically configures network-specific addresses for the TEE services.

### Purpose

- Automatically selects correct contract addresses based on `chainId`
- Simplifies multi-chain deployment
- Eliminates need for manual address configuration

### Supported Networks

- Hardhat Local Network (chainId: 31337)
- Arbitrum Sepolia (chainId: 421614)
- Arbitrum One (chainId: 42161)

### Usage

Smart contracts inherit from `TEEChainConfig` to automatically configure TEE services:

```solidity
contract ConfidentialCounter is TEEChainConfig {
    euint256 public counter;
    
    function increment(externalEuint256 inputHandle, bytes memory inputProof) external {
        euint256 incrementHandle = TEEPrimitive.fromExternal(inputHandle, inputProof);
        counter = TEEPrimitive.add(counter, incrementHandle);
    }
}
```

## Workflow Integration

The smart contracts integrate seamlessly with the off-chain TEE infrastructure:

1. **Application Contract** calls TEEPrimitive library functions
2. **TEEPrimitive** delegates to TEEComputeManager
3. **TEEComputeManager** verifies permissions via ACL and emits events
4. **Ingestor** detects events and forwards to message queue
5. **Orchestrator** processes requests and assigns to Runners
6. **Runners** execute computations and return results
7. **Gateway** stores encrypted results

## Security Considerations

- **Signature Verification**: All inter-component messages are signed and verified via Registry
- **Permission Checks**: ACL enforces access control before any computation
- **Transient Permissions**: Auto-revocation prevents permission leakage
- **Remote Attestation**: TEE components must prove legitimate execution environment
- **Governance Control**: Protocol upgrades and revocations require governance approval

## Related Documentation

- [Gateway](/protocol/gateway) - Handle Gateway that creates and manages encrypted data
- [Ingestor](/protocol/ingestor) - Blockchain event monitoring service
- [KMS](/protocol/kms) - Key Management Service for encryption operations
- [Global Architecture Overview](/protocol/global-architecture-overview) - Complete system architecture
