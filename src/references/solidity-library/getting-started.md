---
title: Getting Started
description: Install and configure the Nox Solidity library for confidential
  smart contracts
---

# Getting Started

The Nox Solidity library lets you write smart contracts that operate on
encrypted data. You import the `Nox` library, use encrypted types like
`euint256` instead of `uint256`, and the protocol handles encryption, key
management, and off-chain computation transparently.

## How It Works

Working with confidential data in Solidity follows three steps:

1. **Receive encrypted inputs**: the user encrypts a value with the
   [JS SDK](/references/js-sdk) and sends a handle + proof to your contract. You
   call `Nox.fromExternal()` to validate the proof and get a typed encrypted
   handle.

2. **Compute on encrypted data**: use `Nox.add()`, `Nox.sub()`, `Nox.eq()`,
   `Nox.select()`, etc. These functions emit events that trigger off-chain TEE
   computation. The result is a new encrypted handle.

3. **Manage access**: grant permissions with `Nox.allow()` so handles can be
   reused in future transactions, and `Nox.addViewer()` so users can decrypt
   results via the JS SDK.

::: info

Operations on encrypted handles are not executed on-chain. The contract emits
events, and the off-chain [Runner](/protocol/runner) performs the actual
computation inside a TEE. The encrypted result is stored in the
[Handle Gateway](/protocol/gateway) under the deterministic handle computed
on-chain.

:::

## Prerequisites

- **Solidity** ^0.8.0
- **Hardhat 3** or **Foundry**
- **Node.js** 18+ with `npm`, `yarn`, `pnpm`, or `bun`

## Installation

::: code-group

```sh [npm]
npm install @iexec-nox/nox-protocol-contracts
```

```sh [yarn]
yarn add @iexec-nox/nox-protocol-contracts
```

```sh [pnpm]
pnpm add @iexec-nox/nox-protocol-contracts
```

```sh [bun]
bun add @iexec-nox/nox-protocol-contracts
```

:::

The package includes:

- `contracts/sdk/Nox.sol`: the main library
- `contracts/NoxCompute.sol`: the on-chain compute contract
- `contracts/ACL.sol`: the access control contract
- `contracts/interfaces/`: contract interfaces
- `contracts/shared/TypeUtils.sol`: type utilities

The `encrypted-types` package (providing `euint256`, `ebool`, etc.) is installed
automatically as a dependency.

## Imports

```solidity
// The library (required)
import {Nox} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";

// Encrypted types (required)
import "encrypted-types/EncryptedTypes.sol";
```

The `EncryptedTypes.sol` import brings all encrypted types into scope: `ebool`,
`euint8` through `euint256`, `eint8` through `eint256`, `eaddress`,
`ebytes1` through `ebytes32`, and their `external*` variants.

## Encrypted Types

Encrypted types are user-defined value types backed by `bytes32`. Each type
wraps a **handle**, a 32-byte identifier that references encrypted data stored
off-chain in the Handle Gateway.

| Category | Types | Example |
| --- | --- | --- |
| Boolean | `ebool` | Encrypted true/false |
| Unsigned integers | `euint8`, `euint16`, ..., `euint256` | Encrypted balances, amounts |
| Signed integers | `eint8`, `eint16`, ..., `eint256` | Encrypted signed values |
| Address | `eaddress` | Encrypted Ethereum address |
| Fixed bytes | `ebytes1`, ..., `ebytes32` | Encrypted raw bytes |

Each type has a corresponding `external*` variant (e.g. `externalEuint256`)
used for handles received from users that need proof validation before use.

## Minimal Example

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Nox} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";
import "encrypted-types/EncryptedTypes.sol";

contract ConfidentialCounter {
    euint256 private _count;

    constructor() {
        _count = Nox.toEuint256(0);
        Nox.allowThis(_count);
    }

    /// @notice Increment the counter by an encrypted amount.
    function increment(externalEuint256 encryptedAmount, bytes calldata proof) external {
        // 1. Validate the user's encrypted input
        euint256 amount = Nox.fromExternal(encryptedAmount, proof);

        // 2. Compute on encrypted data
        euint256 newCount = Nox.add(_count, amount);

        // 3. Manage access: allow this contract to reuse the handle
        Nox.allowThis(newCount);

        // 4. Allow the caller to decrypt the result
        Nox.addViewer(newCount, msg.sender);

        _count = newCount;
    }

    function count() external view returns (euint256) {
        return _count;
    }
}
```

::: warning Important: Access Control

Every time you produce a new encrypted handle (from `Nox.add()`,
`Nox.toEuint256()`, `Nox.fromExternal()`, etc.), you must explicitly grant
permissions:

- `Nox.allowThis(handle)`: lets your contract use the handle in future
  transactions
- `Nox.allow(handle, account)`: lets another contract use the handle as a
  computation input
- `Nox.addViewer(handle, user)`: lets a user decrypt the handle via the JS SDK

Without `allowThis()`, your contract will lose access to the handle after the
current transaction.

:::

## Next Steps

- [Available Methods](/references/solidity-library/methods/available-methods):
  full API reference for all functions
- [Computation Primitives](/protocol/computation-primitives): detailed semantics
  for each operation (overflow behavior, edge cases)
- [JS SDK](/references/js-sdk): encrypt inputs and decrypt results from
  JavaScript
