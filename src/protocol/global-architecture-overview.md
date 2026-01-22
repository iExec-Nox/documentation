---
title: Global Architecture Overview
description: High-level overview of Nox protocol architecture, components, and data flows
---

# Global Architecture Overview

Nox is a privacy layer for DeFi that enables confidential smart contract execution through Trusted Execution Environments (TEEs) and distributed key management.

## Core Principles

The protocol is built on three fundamental principles:

- **Handle-based Data Flow**: Encrypted data is referenced by handles (pointers) that are manipulated on-chain
- **Systematic Blockchain Monitoring**: Every transaction in every block is monitored to deterministically trigger confidential computations
- **On-chain Access Control**: Access Control Lists (ACL) are maintained on-chain, explicitly defining who can access which encrypted data

## Architecture Components

### On-Chain Components

**Smart Contracts** manage protocol state and permissions:

- **Compute Manager**: Receives computation requests, emits `ComputeRequested` events, registers handles
- **ACL Manager**: Verifies access permissions to encrypted data, manages transient permissions
- **Fee Manager**: Collects and distributes fees, handles transaction sponsoring
- **Governance Manager**: Manages protocol evolution, revokes compromised components
- **Registry**: Registers TEE components (Runners, KMS nodes, Orchestrators, Handle Gateway, Ingestors), stores public keys and attestations

### Off-Chain Components

**Runners** - Execute confidential computations in TEEs. They provide valid remote attestation and publish results directly on-chain. Data is re-encrypted specifically for the assigned Runner using their public key.

**Key Management Service (KMS)** - Distributed nodes that collectively hold the system's private key as secret shares. A quorum of t out of n nodes is required to re-encrypt data. No single node can decrypt alone.

**KMS Manager** - Centralized coordinator for the threshold protocol, running in a TEE. Single entry point to KMS nodes, simplifying connection management for Runners.

**Orchestrator** - Decentralized network of nodes that orchestrate computation requests, dequeue messages, assign computations to Runners, and supervise execution. Can reassign tasks on failure or timeout.

**Handle Gateway** - Single entry point to the Handle↔Cyphertext database. Manages encryption/decryption of user data and signs EIP-712 payloads. Uses RA-TLS for SDK connections. Provides REST interface for easy SDK integration.

**Ingestor** - Dedicated service (Rust+Alloy) for blockchain monitoring and `ComputeRequested` event detection. Blocks are processed optimistically. Detected requests are queued for Orchestrator processing. Multiple instances can coexist.

**Message Queue** - Buffer between Ingestors and Orchestrator. Decouples blockchain event detection from processing, absorbs load spikes, and ensures ordered request processing.

## Data Flow

### Encryption Flow

1. **SDK** establishes RA-TLS connection with Handle Gateway
2. **Handle Gateway** encrypts data under KMS threshold public key
3. **Handle Gateway** stores ciphertext in database and generates handle
4. **Handle Gateway** signs EIP-712 payload with handle and owner
5. **SDK** publishes signed payload on-chain via Compute Manager
6. **ACL Manager** records owner permissions for the handle

### Computation Flow

1. **Smart Contract** emits `ComputeRequested` event with input/output handles
2. **Ingestor** detects event and pushes to message queue
3. **Orchestrator** dequeues request and assigns to available Runner
4. **Runner** requests input handles from Handle Gateway
5. **Handle Gateway** coordinates with KMS for proxy re-encryption to Runner's key
6. **Runner** decrypts and executes computation in TEE
7. **Runner** encrypts results and submits to Handle Gateway
8. **Handle Gateway** stores results and updates database
9. **Orchestrator** purges queue and confirms completion

### Decryption Flow

1. **SDK** generates ephemeral keypair and signs EIP-712 payload
2. **Handle Gateway** verifies signature and checks ACL on-chain
3. **Handle Gateway** retrieves ciphertext from database
4. **KMS** performs proxy re-encryption to user's ephemeral public key
5. **Handle Gateway** returns re-encrypted ciphertext to SDK
6. **SDK** decrypts using ephemeral private key

## Security Model

### Trust Foundation

The protocol's trust model relies on:

- **TEEs (TDX)**: All sensitive operations execute in hardware-backed enclaves
- **Remote Attestation**: Cryptographic proof that code runs in authentic TEE
- **Threshold Cryptography**: Distributed key management eliminates single points of failure
- **On-chain Registry**: Component registration and attestation verification

### Access Control

- **ACL on-chain**: Explicit permissions stored on blockchain
- **Selective Disclosure**: Controlled data revelation for audits and compliance
- **Transient Permissions**: Time-limited access grants
- **Owner/Viewer/Admin Roles**: Granular permission model

## Communication Protocols

- **RA-TLS**: SDK ↔ Handle Gateway (authenticated, encrypted)
- **gRPC**: Inter-component communication (Orchestrator ↔ Runner, Runner ↔ KMS)
- **EIP-712**: Signed payloads for on-chain verification
- **Blockchain Events**: Smart contract events for computation triggers

## Key Features

- **Deterministic Execution**: Every block is monitored, every transaction can trigger computations
- **No Consensus Required**: Unlike market-based systems, focuses on reliable deterministic execution
- **Algorithm Evolution**: Encryption algorithms can evolve without breaking changes
- **Composability**: Native integration with existing DeFi protocols

## Learn More

- [KMS](/protocol/kms) - Distributed key management details
- [Runner](/protocol/runner) - Computation execution
- [Gateway](/protocol/gateway) - Handle encryption/decryption
- [Ingestor](/protocol/ingestor) - Blockchain monitoring
- [Nox Long-Term Vision](/protocol/nox-long-term-vision) - Strategic direction
