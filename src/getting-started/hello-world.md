---
title: Hello World
description: Build your first confidential smart contract with Nox
---

<script setup>
import piggyBankCode from '../contracts/ConfidentialPiggyBank.sol?raw';
import PiggyBankDemo from '../components/PiggyBankDemo.vue';
</script>

# Hello World

A piggy bank is a simple savings container: you put money in, and only the owner
can take it out. In this tutorial, you will first write a classic piggy bank,
then turn it into a confidential one using Nox. By the end, balances and amounts
will be fully encrypted: nobody can see how much is inside.

## Write a simple contract

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

## Turn it into a confidential contract

Nox provides **confidentiality**, not anonymity. Addresses and function calls
remain visible on-chain, only **balances and amounts** are encrypted.

:::steps

1. ### Import Nox

   Add the Nox library. A single import gives you everything you need:

   ```solidity
   import {Nox, euint256, externalEuint256, ebool} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol"; // [!code ++]
   ```

2. ### Replace types with encrypted equivalents

   Swap `uint256` for `euint256`. On-chain, the value is now stored as a 32-byte
   **handle** that points to encrypted data. The actual value is never visible.

   ```solidity
   uint256 private balance; // [!code --]
   euint256 public balance; // [!code ++]
   ```

3. ### Initialize encrypted state

   Unlike plain `uint256` (which defaults to `0`), an `euint256` must be
   explicitly initialized to a valid encrypted handle. Use `Nox.toEuint256()` in
   the constructor:

   ```solidity
   constructor() {
       owner = msg.sender;
       balance = Nox.toEuint256(0); // [!code ++]
       Nox.allowThis(balance); // [!code ++]
       Nox.allow(balance, owner); // [!code ++]
   }
   ```

4. ### Accept encrypted inputs

   Users encrypt values off-chain with the JS SDK and send a handle + proof to
   your contract. Replace plain `uint256` parameters with `externalEuint256` + a
   proof:

   ```solidity
   function deposit(uint256 amount) external { // [!code --]
   function deposit(externalEuint256 inputHandle, bytes calldata inputProof) external { // [!code ++]
   ```

   Then validate the proof with `Nox.fromExternal()` to get a typed handle:

   ```solidity
   euint256 amount = Nox.fromExternal(inputHandle, inputProof);
   ```

5. ### Use Nox for computations

   Standard operators (`+=`, `-=`) don't work on encrypted types. Use `Nox.*`
   functions instead. These trigger off-chain computation inside a TEE, the
   plaintext is **never exposed on-chain**:

   ```solidity
   balance += amount; // [!code --]
   balance = Nox.add(balance, amount); // [!code ++]
   ```

   For the withdrawal, `require(amount <= balance)` would leak information (a
   revert reveals the condition failed). Use `Nox.safeSub()` instead: it handles
   underflow detection on encrypted values without reverting.

   ```solidity
   require(amount <= balance); // [!code --]
   balance -= amount; // [!code --]
   (ebool ok, euint256 newBalance) = Nox.safeSub(balance, amount); // [!code ++]
   balance = Nox.select(ok, newBalance, balance); // [!code ++]
   ```

   - `Nox.safeSub()` subtracts and returns `(ebool ok, euint256 result)`. If
     `amount > balance`, `ok` is false and `result` is zero
   - `Nox.select()` picks between two values based on an encrypted boolean: on
     underflow the balance stays unchanged, no information is leaked

6. ### Grant access

   By default, only the handle creator has access. After each operation that
   produces a new handle, grant permissions so the contract can keep computing
   on it and the owner can decrypt it:

   ```solidity
   Nox.allowThis(balance);
   Nox.allow(balance, owner);
   ```

:::

## Final result

Here is the complete confidential piggy bank. Click **Open in Remix** to load
it, compile with Solidity `0.8.24+`, connect MetaMask to **Arbitrum Sepolia**,
and deploy.

<ClientOnly>
  <RemixButton :code="piggyBankCode" />
</ClientOnly>

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// A piggy bank is a simple savings container: you put money in
// and only the owner can take it out. This version keeps the
// balance encrypted so nobody can see how much is inside.

import {Nox, euint256, externalEuint256, ebool} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";

contract ConfidentialPiggyBank {
    euint256 public balance;
    address public owner;

    constructor() {
        owner = msg.sender;
        balance = Nox.toEuint256(0);
        Nox.allowThis(balance);
        Nox.allow(balance, owner);
    }

    function deposit(externalEuint256 inputHandle, bytes calldata inputProof) external {
        euint256 amount = Nox.fromExternal(inputHandle, inputProof);
        balance = Nox.add(balance, amount);
        Nox.allowThis(balance);
        Nox.allow(balance, owner);
    }

    function withdraw(externalEuint256 inputHandle, bytes calldata inputProof) external {
        require(msg.sender == owner);
        euint256 amount = Nox.fromExternal(inputHandle, inputProof);

        (ebool ok, euint256 newBalance) = Nox.safeSub(balance, amount);
        balance = Nox.select(ok, newBalance, balance);
        Nox.allowThis(balance);
        Nox.allow(balance, owner);
    }
}
```

## Try it

Use the widget below to encrypt values and decrypt handles with the JS SDK.
Connect your wallet, enter your deployed contract address, and encrypt an
amount. Copy the resulting **handle** and **handle proof**, then paste them into
the `deposit` or `withdraw` fields in Remix to call the contract. To read the
balance, copy the handle returned by `balance()` in Remix and decrypt it here.

<ClientOnly>
  <PiggyBankDemo />
</ClientOnly>

## Next steps

- [Solidity Library](/references/solidity-library/getting-started) - Full
  reference for all Nox operations
- [JS SDK](/references/js-sdk) - Encrypt inputs and decrypt results from
  JavaScript
