---
title: Getting Started
description: Getting started with Nox JS SDK
---

# Getting Started

The Nox JS SDK lets you encrypt values and decrypt handles for use with
confidential smart contracts, without dealing directly with the Handle Gateway
or the underlying cryptography. It manages encryption, proof generation, EIP-712
signatures, and key exchange transparently.

## How It Works

Working with confidential data on Nox follows a three-step workflow:

1. **Encrypt** — You encrypt a plaintext value (a balance, a vote, a flag…)
   using [`encryptInput`](/references/js-sdk/methods/encryptInput). The SDK
   sends the value to the Handle Gateway, which returns a **handle** (a 32-byte
   on-chain identifier pointing to the encrypted data) and a **handleProof** (an
   EIP-712 signed proof that the handle was created by a legitimate Gateway).

2. **Compute** — Your smart contract receives the handle and proof, verifies
   them, and performs operations on encrypted data. Handles are composable: they
   can be stored, transferred, or combined in contract logic without ever
   exposing the underlying values.

3. **Decrypt** — When a user needs to read the actual value,
   [`decrypt`](/references/js-sdk/methods/decrypt) requests decryption from the
   Gateway. The SDK signs an EIP-712 authorization message (no gas required). If
   the on-chain ACL authorizes the request, the plaintext is securely returned
   to the user — the value never travels in the clear.

## Prerequisites

- **Node.js** 18+ or Bun
- **A wallet library**: [Ethers.js](https://docs.ethers.org/) v6 or
  [Viem](https://viem.sh/) v2

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

The SDK exposes a dedicated factory function for each supported wallet library.
Pick the one that matches your stack — each is **async** and returns a
`Promise<HandleClient>`.

| Factory                    | Wallet library | Accepted client                                       |
| -------------------------- | -------------- | ----------------------------------------------------- |
| `createEthersHandleClient` | Ethers.js v6   | `BrowserProvider` or `AbstractSigner` with `Provider` |
| `createViemHandleClient`   | Viem v2        | `WalletClient`                                        |
| `createHandleClient`       | Any            | Auto-detects ethers or viem                           |

### With Ethers.js

::: code-group

```ts twoslash [Browser]
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

```ts twoslash [NodeJS]
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

::: code-group

```ts twoslash [Browser]
declare global {
  interface Window {
    ethereum: any;
  }
}
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';

const walletClient = createWalletClient({
  transport: custom(window.ethereum),
});
const handleClient = await createViemHandleClient(walletClient);
```

```ts twoslash [NodeJS]
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

`createHandleClient` inspects the provided client at runtime and delegates to
the appropriate adapter.

::: warning

Bundle size This factory imports both the ethers and viem adapters. If you only
use one library, prefer `createEthersHandleClient` or `createViemHandleClient`
to keep your bundle smaller.

:::

::: code-group

```ts twoslash [Ethers]
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

```ts twoslash [Viem]
declare global {
  interface Window {
    ethereum: any;
  }
}
// ---cut---
import { createHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';

const walletClient = createWalletClient({
  transport: custom(window.ethereum),
});
const handleClient = await createHandleClient(walletClient);
```

:::

## Next Steps

- Learn about [encryptInput](/references/js-sdk/methods/encryptInput) — encrypt
  values and create handles for smart contracts
- Explore [decrypt](/references/js-sdk/methods/decrypt) — retrieve plaintext
  from encrypted handles
- Configure advanced options in
  [Advanced Configuration](/references/js-sdk/advanced-configuration)
