---
title: JS SDK
description: JavaScript SDK for Nox
---

## Overview

The Nox JavaScript SDK (`@iexec/handles`) provides a simple and secure interface for interacting with the Nox protocol from JavaScript/TypeScript applications. It enables developers to encrypt data, decrypt handles, and manage access control permissions without dealing with the underlying cryptographic complexity.

## Key Features

- **Easy Integration**: Works with both Ethers.js and Viem
- **Type-Safe**: Full TypeScript support with type inference
- **Secure**: Handles encryption, decryption, and signature management automatically
- **Gasless Decryption**: Uses EIP-712 signatures for authentication without requiring gas
- **Handle Management**: Create and manage encrypted data handles seamlessly

## Installation

Install the SDK using npm:

```bash
npm install @iexec/handles
```

## Quick Start

```typescript
import { createEthersHandleClient } from "@iexec/handles";
import { ethers } from "ethers";

// Initialize with your signer
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const handlesClient = createEthersHandleClient(signer);

// Encrypt data
const { handle, inputProof } = await handlesClient.encryptInput(
  100_000_000n,
  "uint256"
);

// Decrypt handle
const { value } = await handlesClient.decrypt(handle);
```

## Core Concepts

### Handles

A handle is a 32-byte identifier that references encrypted data stored off-chain. Handles are deterministic and can be verified on-chain through cryptographic proofs.

### Input Proofs

When encrypting data, the Gateway returns an `inputProof` - a signed EIP-712 payload that proves the handle was created by a legitimate Gateway. This proof is used when verifying handles in smart contracts.

### Access Control

Handles are protected by Access Control Lists (ACLs) managed on-chain. Only authorized addresses (owners or viewers) can decrypt handles.

## Architecture

The SDK is designed as an independent package that's agnostic to specific smart contract implementations:

```
┌─────────────────────────────────────────┐
│ @iexec/handles                         │
│ (Contract-agnostic package)            │
├─────────────────────────────────────────┤
│ HandleClient                            │
│ ├── encryptInput()                     │
│ ├── decrypt()                          │
│ └── viewACL()                          │
└─────────────────────────────────────────┘
```

## Supported Wallet Libraries

The SDK supports multiple wallet libraries:

- **Ethers.js**: Use `createEthersHandleClient(signer)`
- **Viem**: Use `createViemHandleClient(walletClient)`

## Documentation

- [Getting Started](/references/js-sdk/getting-started) - Installation and basic usage
- [Methods](/references/js-sdk/methods/) - API reference
  - [encryptInput](/references/js-sdk/methods/encryptInput) - Encrypt data and create handles
  - [decrypt](/references/js-sdk/methods/decrypt) - Decrypt handles
  - [viewACL](/references/js-sdk/methods/viewACL) - View access control permissions
- [Advanced Configuration](/references/js-sdk/advanced-configuration) - Custom configuration options

## Related Documentation

- [Gateway](/protocol/gateway) - Gateway service that handles encryption/decryption
- [ACL Manager](/protocol/nox-smart-contracts#acl-manager) - On-chain access control
- [Global Architecture Overview](/protocol/global-architecture-overview) - System architecture
