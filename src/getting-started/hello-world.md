---
title: Hello World
description: Build your first confidential smart contract with Nox
---

<script setup>
import piggyBankCode from '../contracts/ConfidentialPiggyBank.sol?raw';
</script>

# Hello World

In this tutorial, you will write a simple piggy bank contract, then make it
confidential with Nox. By the end, balances and amounts will be fully encrypted:
nobody can see how much is inside.

## Step 1: A simple piggy bank

Start with a standard Solidity contract. Nothing encrypted yet:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PiggyBank {
    uint256 private balance;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit(uint256 amount) external {
        balance += amount;
    }

    function withdraw(uint256 amount) external {
        require(msg.sender == owner);
        require(amount <= balance);
        balance -= amount;
    }

    function getBalance() external view returns (uint256) {
        return balance;
    }
}
```

This works, but the balance is visible to anyone reading the blockchain. Let's
fix that.

## Step 2: Import Nox

Replace the standard imports with the Nox library. A single import gives you
everything you need:

```solidity
import {Nox, euint256, externalEuint256, ebool} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol"; // [!code ++]
```

## Step 3: Replace types with encrypted equivalents

Swap `uint256` for `euint256`. On-chain, the value is now stored as a 32-byte
**handle** that points to encrypted data. The actual value is never visible.

```solidity
uint256 private balance; // [!code --]
euint256 private balance; // [!code ++]
```

## Step 4: Accept encrypted inputs

Users encrypt values off-chain with the JS SDK and send a handle + proof to your
contract. Replace plain `uint256` parameters with `externalEuint256` + a proof:

```solidity
function deposit(uint256 amount) external { // [!code --]
function deposit(externalEuint256 inputHandle, bytes calldata inputProof) external { // [!code ++]
```

Then validate the proof with `Nox.fromExternal()` to get a typed handle:

```solidity
euint256 amount = Nox.fromExternal(inputHandle, inputProof);
```

## Step 5: Use Nox for computations

Standard operators (`+=`, `-=`) don't work on encrypted types. Use `Nox.*`
functions instead. These trigger off-chain computation inside a TEE, the
plaintext is **never exposed on-chain**:

```solidity
balance += amount; // [!code --]
balance = Nox.add(balance, amount); // [!code ++]
```

For the withdrawal, the `require(amount <= balance)` check would reveal
information. Replace it with encrypted comparison and conditional selection:

```solidity
require(amount <= balance); // [!code --]
balance -= amount; // [!code --]
ebool canWithdraw = Nox.le(amount, balance); // [!code ++]
euint256 newBalance = Nox.sub(balance, amount); // [!code ++]
balance = Nox.select(canWithdraw, newBalance, balance); // [!code ++]
```

- `Nox.le()` compares two encrypted values and returns an encrypted boolean
- `Nox.select()` picks between two values based on that encrypted boolean
- If the withdrawal exceeds the balance, the balance stays unchanged, no
  information is leaked

## Step 6: Grant access

By default, only the handle creator has access. After each operation that
produces a new handle, grant the contract permission to reuse it:

```solidity
Nox.allowThis(balance);
```

## Final result

<ClientOnly>
  <RemixButton :code="piggyBankCode" />
</ClientOnly>

Here is the complete confidential piggy bank:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Piggy bank with a private balance.
// Nobody can see how much is inside, only the owner can withdraw.

import {Nox, euint256, externalEuint256, ebool} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";

contract ConfidentialPiggyBank {
    euint256 private balance;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit(externalEuint256 inputHandle, bytes calldata inputProof) external {
        euint256 amount = Nox.fromExternal(inputHandle, inputProof);
        balance = Nox.add(balance, amount);
        Nox.allowThis(balance);
    }

    function withdraw(externalEuint256 inputHandle, bytes calldata inputProof) external {
        require(msg.sender == owner);
        euint256 amount = Nox.fromExternal(inputHandle, inputProof);

        ebool canWithdraw = Nox.le(amount, balance);
        euint256 newBalance = Nox.sub(balance, amount);
        balance = Nox.select(canWithdraw, newBalance, balance);
        Nox.allowThis(balance);
    }

    function getBalanceHandle() external view returns (bytes32) {
        return euint256.unwrap(balance);
    }
}
```

## Next steps

- [Solidity Library](/references/solidity-library/getting-started) - Full
  reference for all Nox operations
- [JS SDK](/references/js-sdk) - Encrypt inputs and decrypt results from
  JavaScript
