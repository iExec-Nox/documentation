---
title: JS SDK
description: JavaScript SDK for Nox
---

# JS SDK

The Nox JavaScript SDK (`@iexec-nox/handle`) provides a simple and secure
interface for interacting with the Nox protocol from JavaScript/TypeScript
applications. It enables developers to encrypt data and decrypt handles without
dealing with the underlying cryptographic complexity.

## Key Features

- **Easy Integration**: Works with both Ethers.js and Viem
- **Type-Safe**: Full TypeScript support with type inference
- **Secure**: Handles encryption, decryption, and signature management
  automatically
- **Gasless Decryption**: Uses EIP-712 signatures for authentication without
  requiring gas

## Installation

::: code-group

```sh [npm]
npm install @iexec-nox/handle
```

```sh [yarn]
yarn add @iexec-nox/handle
```

```sh [pnpm]
pnpm add @iexec-nox/handle
```

```sh [bun]
bun add @iexec-nox/handle
```

:::

## Quick Start

```ts
declare const RPC_URL: string;
declare const PRIVATE_KEY: string;
// ---cut---
import { createEthersHandleClient } from '@iexec-nox/handle';
import { JsonRpcProvider, Wallet } from 'ethers';

// Initialize with your signer
const provider = new JsonRpcProvider(RPC_URL);
const signer = new Wallet(PRIVATE_KEY, provider);
const handleClient = await createEthersHandleClient(signer);

// Encrypt data
const { handle, inputProof } = await handleClient.encryptInput(
  100_000_000n,
  'uint256'
);

// Decrypt handle
const { value } = await handleClient.decrypt(handle);
```

## Core Concepts

### Handles

A handle is a 32-byte identifier that references encrypted data stored
off-chain. Handles are deterministic and can be verified on-chain through
cryptographic proofs.

### Input Proofs

When encrypting data, the Gateway returns an `inputProof` - a signed EIP-712
payload that proves the handle was created by a legitimate Gateway. This proof
is used when verifying handles in smart contracts.

### Access Control

Handles are protected by Access Control Lists (ACLs) managed on-chain. Only
authorized addresses (owners or viewers) can decrypt handles.

## Supported Wallet Libraries

- **Ethers.js**: Use `createEthersHandleClient(signer)`
- **Viem**: Use `createViemHandleClient(walletClient)`

## Documentation

- [Getting Started](/references/js-sdk/getting-started) - Installation and basic
  usage
- **Methods**
  - [encryptInput](/references/js-sdk/methods/encryptInput) - Encrypt data and
    create handles
  - [decrypt](/references/js-sdk/methods/decrypt) - Decrypt handles
- [Advanced Configuration](/references/js-sdk/advanced-configuration) - Custom
  configuration options
