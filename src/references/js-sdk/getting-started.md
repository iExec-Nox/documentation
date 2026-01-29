---
title: Getting Started
description: Getting started with Nox JS SDK
---

# Getting Started

The Nox JS SDK provides a simple interface for encrypting and decrypting
confidential data on the blockchain. It enables developers to create encrypted
handles that can be used in smart contracts while keeping the underlying data
private.

## Prerequisites

- **Node.js** 18+ or Bun

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

## Initialization

The SDK provides three factory functions depending on the wallet library you
use. All factory functions are **async** and return a `Promise<HandleClient>`.

### With Ethers.js

Use `createEthersHandleClient` with either a `BrowserProvider` (browser wallet)
or an `AbstractSigner` connected to a `Provider` (e.g. `Wallet`).

::: code-group

```ts [Browser]
declare global {
  interface Window {
    ethereum: any;
  }
}
// ---cut---
import { createEthersHandleClient } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const provider = new BrowserProvider(window.ethereum);
const handleClient = await createEthersHandleClient(provider);
```

```ts [NodeJS]
declare const RPC_URL: string;
declare const PRIVATE_KEY: string;
// ---cut---
import { createEthersHandleClient } from '@iexec-nox/handle';
import { JsonRpcProvider, Wallet } from 'ethers';

const provider = new JsonRpcProvider(RPC_URL);
const signer = new Wallet(PRIVATE_KEY, provider);
const handleClient = await createEthersHandleClient(signer);
```

:::

### With Viem

Use `createViemHandleClient` with a viem `WalletClient`.

::: code-group

```ts [Browser]
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';

const walletClient = createWalletClient({
  transport: custom(window.ethereum),
});
const handleClient = await createViemHandleClient(walletClient);
```

```ts [NodeJS]
declare const RPC_URL: string;
declare const PRIVATE_KEY: `0x${string}`;
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const walletClient = createWalletClient({
  account: privateKeyToAccount(PRIVATE_KEY),
  transport: http(RPC_URL),
});
const handleClient = await createViemHandleClient(walletClient);
```

:::

### With Auto-Detection

Use `createHandleClient` if you want the SDK to automatically detect whether the
provided client is from ethers or viem.

::: warning Bundle size `createHandleClient` imports both ethers and viem
adapters. For a smaller bundle, prefer `createEthersHandleClient` or
`createViemHandleClient`. :::

::: code-group

```ts [Ethers]
declare global {
  interface Window {
    ethereum: any;
  }
}
// ---cut---
import { createHandleClient } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const provider = new BrowserProvider(window.ethereum);
const handleClient = await createHandleClient(provider);
```

```ts [Viem]
// ---cut---
import { createHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';

const walletClient = createWalletClient({
  transport: custom(window.ethereum),
});
const handleClient = await createHandleClient(walletClient);
```

:::

## Basic Usage

### Encrypt Data

Encrypt a value to create a handle:

```ts
import { createEthersHandleClient } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const handleClient = await createEthersHandleClient(
  new BrowserProvider(window.ethereum)
);
// ---cut---
const { handle, inputProof } = await handleClient.encryptInput(
  100_000_000n,
  'uint256'
);

console.log('Handle:', handle);
console.log('Input Proof:', inputProof);
```

The `inputProof` can be used to verify the handle on-chain in smart contracts.

### Decrypt a Handle

Decrypt a handle to retrieve the original value:

```ts
import { createEthersHandleClient } from '@iexec-nox/handle';
import type { Handle } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const handleClient = await createEthersHandleClient(
  new BrowserProvider(window.ethereum)
);
const { handle } = await handleClient.encryptInput(100n, 'uint256');
// ---cut---
const { value, solidityType } = await handleClient.decrypt(handle);

console.log('Decrypted value:', value);
console.log('Type:', solidityType); // "uint256"
```

::: tip Gasless operation Decryption requires EIP-712 signature authentication
but doesn't consume gas. The SDK handles signature generation automatically. :::

## Supported Types

The SDK supports the following Solidity types:

- **Boolean**: `bool`
- **Address**: `address`
- **Dynamic types**: `bytes`, `string`
- **Unsigned integers**: `uint8`, `uint16`, `uint24`, ... , `uint256`
- **Signed integers**: `int8`, `int16`, `int24`, ... , `int256`
- **Fixed-size bytes**: `bytes1`, `bytes2`, ... , `bytes32`

## Complete Example

```ts
declare const RPC_URL: string;
declare const PRIVATE_KEY: string;
// ---cut---
import { createEthersHandleClient } from '@iexec-nox/handle';
import { JsonRpcProvider, Wallet } from 'ethers';

async function main() {
  // Initialize
  const provider = new JsonRpcProvider(RPC_URL);
  const signer = new Wallet(PRIVATE_KEY, provider);
  const handleClient = await createEthersHandleClient(signer);

  // Encrypt a balance
  const balance = 1_000_000_000n; // 1 token with 9 decimals
  const { handle, inputProof } = await handleClient.encryptInput(
    balance,
    'uint256'
  );

  console.log(`Encrypted balance handle: ${handle}`);

  // Later, decrypt the balance
  const { value } = await handleClient.decrypt(handle);
  console.log(`Decrypted balance: ${value}`);
}

main().catch(console.error);
```

## Next Steps

- Learn about [encryptInput](/references/js-sdk/methods/encryptInput) method
- Explore [decrypt](/references/js-sdk/methods/decrypt) functionality
- Configure advanced options in
  [Advanced Configuration](/references/js-sdk/advanced-configuration)
