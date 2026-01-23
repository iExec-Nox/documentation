---
title: Getting Started
description: Getting started with Nox Solidity Library
---

## Installation

Install the Nox Solidity Library using npm:

```bash
npm install @iexec/nox-solidity
```

Or with yarn:

```bash
yarn add @iexec/nox-solidity
```

## Prerequisites

- Solidity ^0.8.0
- Hardhat, Foundry, or your preferred development framework
- Access to a supported network (Arbitrum Sepolia, Arbitrum One, or local Hardhat)

## Basic Setup

### 1. Import the Library

```solidity
import {TEEPrimitive} from "@iexec/nox-solidity";
import {TEEChainConfig} from "@iexec/nox-solidity";
```

### 2. Inherit from TEEChainConfig

The `TEEChainConfig` abstract contract automatically configures the library based on your network:

```solidity
contract MyContract is TEEChainConfig {
    // Your contract code
}
```

This automatically:
- Detects the network (`chainId`)
- Configures TEEComputeManager and ACL addresses
- Sets up the library storage

### 3. Use Encrypted Types

Declare state variables using encrypted types:

```solidity
contract ConfidentialCounter is TEEChainConfig {
    euint256 public balance;
    euint64 public count;
}
```

## Basic Operations

### Trivial Encryption

Create encrypted handles from plaintext values:

```solidity
function initialize() external {
    // Create an encrypted zero
    balance = TEEPrimitive.asEuint256(0);
    
    // Create an encrypted constant
    euint256 constant = TEEPrimitive.asEuint256(100);
}
```

### Input Verification

Verify and use external handles (from SDK or other contracts):

```solidity
function deposit(externalEuint256 amountHandle, bytes memory inputProof) external {
    // Verify the external handle
    euint256 amount = TEEPrimitive.fromExternal(amountHandle, inputProof);
    
    // Use in computation
    balance = TEEPrimitive.add(balance, amount);
    
    // Grant permissions
    acl.allowThis(euint256.unwrap(balance));
}
```

### Arithmetic Operations

Perform confidential computations:

```solidity
function transfer(euint256 amount) external {
    // Subtract from balance
    balance = TEEPrimitive.sub(balance, amount);
    
    // Add to recipient (simplified example)
    // recipientBalance = TEEPrimitive.add(recipientBalance, amount);
}
```

## Complete Example

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {TEEPrimitive} from "@iexec/nox-solidity";
import {TEEChainConfig} from "@iexec/nox-solidity";

contract ConfidentialCounter is TEEChainConfig {
    euint256 public counter;

    constructor() {
        // Initialize counter to zero
        counter = TEEPrimitive.asEuint256(0);
    }

    function increment(externalEuint256 incrementHandle, bytes memory inputProof) external {
        // Verify external handle
        euint256 increment = TEEPrimitive.fromExternal(incrementHandle, inputProof);
        
        // Perform addition
        counter = TEEPrimitive.add(counter, increment);
        
        // Grant permission to caller
        acl.allowThis(euint256.unwrap(counter));
    }

    function decrement(euint256 amount) external {
        // Check if counter is initialized
        require(TEEPrimitive.isInitialized(counter), "Counter not initialized");
        
        // Perform subtraction
        counter = TEEPrimitive.sub(counter, amount);
    }
}
```

## Supported Networks

The library automatically configures for these networks:

- **Hardhat Local** (chainId: 31337)
- **Arbitrum Sepolia** (chainId: 421614)
- **Arbitrum One** (chainId: 42161)

For other networks, see [Advanced Configuration](/references/solidity-library/advanced-configuration).

## Encrypted Types

The library supports encrypted integers of various sizes:

- `euint8`, `euint16`, `euint32`, `euint64`, `euint128`, `euint256`
- `externalEuint8`, `externalEuint16`, etc. (for external handles)

Choose the appropriate size based on your data range to optimize gas costs.

## Important Notes

### Event-Based Computation

Arithmetic operations emit events that trigger off-chain computation by the TEE network. The result handle is returned immediately, but the actual computation happens asynchronously.

### Permission Management

After creating or modifying encrypted values, use the ACL to grant permissions:

```solidity
// Grant permission to caller
acl.allowThis(euint256.unwrap(result));

// Or grant to specific address
acl.allow(euint256.unwrap(result), recipientAddress);
```

### Initialization Check

Always check if encrypted values are initialized before use:

```solidity
require(TEEPrimitive.isInitialized(value), "Value not initialized");
```

## Next Steps

- Explore [Available Methods](/references/solidity-library/methods/available-methods) for complete API reference
- Learn [Advanced Configuration](/references/solidity-library/advanced-configuration) for custom setups
- Check [Nox Smart Contracts](/protocol/nox-smart-contracts) for protocol details
