---
title: Solidity Library
description: Solidity library for confidential smart contracts
---

## Overview

The Nox Solidity Library (`TEEPrimitive`) provides a high-level interface for building confidential smart contracts. It abstracts the complexity of interacting with the TEE infrastructure, allowing developers to work with encrypted data types and perform confidential computations seamlessly.

## Key Features

- **Type-Safe Encrypted Types**: Support for encrypted integers (`euint8` through `euint256`)
- **Automatic Configuration**: Network-specific setup via `TEEChainConfig`
- **Simple API**: High-level functions that handle encryption, decryption, and computation
- **Event-Based**: Computations emit events for off-chain TEE processing
- **ERC-7201 Compatible**: Uses fixed storage slots for configuration

## Architecture

The library acts as an abstraction layer between your smart contract and the TEE infrastructure:

```
Application Contract
    │
    ├─► TEEPrimitive Library (high-level API)
    │       │
    │       ├─► TEEComputeManager (on-chain orchestration)
    │       └─► ACL Manager (permission management)
    │
    └─► TEEChainConfig (automatic network configuration)
```

## Core Concepts

### Encrypted Types

The library provides encrypted types for confidential computations:
- **Internal Types**: `euint8`, `euint16`, `euint32`, `euint64`, `euint128`, `euint256`
- **External Types**: `externalEuint8`, `externalEuint16`, etc. (for handles from outside the contract)

### Handles

Encrypted values are represented as handles (32-byte identifiers) that reference ciphertext stored off-chain. Handles are deterministic and can be verified on-chain.

### Configuration

The library uses ERC-7201 compatible fixed storage slots to store TEE service addresses, ensuring no storage collisions with your contract.

## Quick Start

```solidity
import {TEEPrimitive} from "@iexec/nox-solidity";
import {TEEChainConfig} from "@iexec/nox-solidity";

contract ConfidentialCounter is TEEChainConfig {
    euint256 public counter;

    function increment(externalEuint256 inputHandle, bytes memory inputProof) external {
        euint256 incrementHandle = TEEPrimitive.fromExternal(inputHandle, inputProof);
        counter = TEEPrimitive.add(counter, incrementHandle);
        acl.allowThis(euint256.unwrap(counter));
    }
}
```

## Documentation

- [Getting Started](/references/solidity-library/getting-started) - Installation and basic usage
- [Available Methods](/references/solidity-library/methods/available-methods) - Complete API reference
- [Advanced Configuration](/references/solidity-library/advanced-configuration) - Custom configuration options

## Related Documentation

- [Nox Smart Contracts](/protocol/nox-smart-contracts) - Core protocol contracts
- [TEEComputeManager](/protocol/nox-smart-contracts#teecomputemanager) - On-chain computation orchestration
- [ACL Manager](/protocol/nox-smart-contracts#acl-manager) - Access control management
