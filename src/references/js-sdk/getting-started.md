---
title: Getting Started
description: Getting started with Nox JS SDK
---

## Installation

Install the Nox JS SDK using npm:

```bash
npm install @iexec/handles
```

Or with yarn:

```bash
yarn add @iexec/handles
```

## Prerequisites

- Node.js 18+ or Bun
- A wallet library (Ethers.js or Viem)
- A wallet with funds for on-chain operations (encryption is free, but smart contract interactions require gas)

## Initialization

### Using Ethers.js

```typescript
import { createEthersHandleClient } from "@iexec/handles";
import { ethers } from "ethers";

// Create a provider
const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");

// Create a signer (using a private key)
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Or use a browser wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Initialize the SDK
const handlesClient = createEthersHandleClient(signer);
```

### Using Viem

```typescript
import { createViemHandleClient } from "@iexec/handles";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";

// Create account
const account = privateKeyToAccount(PRIVATE_KEY);

// Create wallet client
const walletClient = createWalletClient({
  account,
  chain: arbitrumSepolia,
  transport: http(),
});

// Initialize the SDK
const handlesClient = createViemHandleClient(walletClient);
```

## Basic Usage

### Encrypt Data

Encrypt a value to create a handle:

```typescript
// Encrypt a uint256 value
const { handle, inputProof } = await handlesClient.encryptInput(
  100_000_000n,
  "uint256"
);

console.log("Handle:", handle);
console.log("Input Proof:", inputProof);
```

The `inputProof` can be used to verify the handle on-chain in smart contracts.

### Decrypt a Handle

Decrypt a handle to retrieve the original value:

```typescript
// Decrypt the handle
const { value, solidityType } = await handlesClient.decrypt(handle);

console.log("Decrypted value:", value);
console.log("Type:", solidityType); // "uint256"
```

::: info Note
Decryption requires EIP-712 signature authentication but doesn't consume gas. The SDK handles signature generation automatically.
:::

### View ACL Permissions

Check who has access to a handle:

```typescript
const acl = await handlesClient.viewACL(handle);

console.log("Owner:", acl.owner);
console.log("Allowed addresses:", acl.allowedAddresses);
console.log("Publicly decryptable:", acl.publiclyDecryptable);
```

## Supported Types

The SDK supports various Solidity types:

- **Integers**: `uint8`, `uint16`, `uint32`, `uint64`, `uint128`, `uint256`
- **Signed Integers**: `int8`, `int16`, `int32`, `int64`, `int128`, `int256`
- **Other**: `bool`, `address`, `bytes`, `string`, `bytes1` through `bytes32`

## Complete Example

```typescript
import { createEthersHandleClient } from "@iexec/handles";
import { ethers } from "ethers";

async function main() {
  // Initialize
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const handlesClient = createEthersHandleClient(signer);

  // Encrypt a balance
  const balance = 1_000_000_000n; // 1 token with 9 decimals
  const { handle, inputProof } = await handlesClient.encryptInput(
    balance,
    "uint256"
  );

  console.log(`Encrypted balance handle: ${handle}`);

  // Later, decrypt the balance
  const { value } = await handlesClient.decrypt(handle);
  console.log(`Decrypted balance: ${value}`);

  // Check permissions
  const acl = await handlesClient.viewACL(handle);
  console.log(`Handle owner: ${acl.owner}`);
}

main().catch(console.error);
```

## Next Steps

- Learn about [encryptInput](/references/js-sdk/methods/encryptInput) method
- Explore [decrypt](/references/js-sdk/methods/decrypt) functionality
- Check [viewACL](/references/js-sdk/methods/viewACL) for access control
- Configure advanced options in [Advanced Configuration](/references/js-sdk/advanced-configuration)
