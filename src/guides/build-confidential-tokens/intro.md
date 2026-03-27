---
title: Introduction
description: Introduction to building confidential tokens with Nox
---

# Building Confidential Tokens

[ERC-7984](https://eips.ethereum.org/EIPS/eip-7984) is a confidential fungible
token standard designed from the ground up with privacy in mind. Unlike ERC-20,
where balances and transfer amounts are visible on-chain, ERC-7984 stores
everything as encrypted handles. Only authorized parties can decrypt the actual
values.

The `@iexec-nox/nox-confidential-contracts` library provides a ready-to-use
`ERC7984` base contract, similar to how OpenZeppelin provides `ERC20`. You
inherit from it and add your own logic (minting, burning, access control).

## ERC-7984 vs ERC-20

| Feature            | ERC-20           | ERC-7984                                |
| ------------------ | ---------------- | --------------------------------------- |
| Balances           | Public `uint256` | Encrypted `euint256`                    |
| Transfer amounts   | Public           | Encrypted                               |
| Total supply       | Public           | Encrypted                               |
| Approval mechanism | Allowances       | Time-bound operators                    |
| Callbacks          | No (ERC-1363)    | Built-in (`transferAndCall`)            |
| Addresses          | Public           | Public (confidentiality, not anonymity) |

## Key Concepts

### Encrypted handles

Balances and amounts are not stored as plain numbers. They are stored as
`euint256` handles: 32-byte references to encrypted data managed by the Nox
protocol. All arithmetic on these values happens off-chain inside a TEE.

### Operators (not allowances)

ERC-7984 replaces the ERC-20 `approve`/`transferFrom` pattern with
**operators**. An operator can move any amount of tokens on behalf of a holder
until a timestamp. This is simpler and avoids the well-known ERC-20 approval
front-running issue.

### All-or-nothing transfers

Transfers never revert on insufficient balance. Instead, the contract uses
`Nox.safeSub()` internally: if the sender does not have enough tokens, the
transfer silently succeeds with zero tokens moved. This prevents leaking balance
information through transaction reverts.

### Callbacks

ERC-7984 has built-in `transferAndCall` support (inspired by ERC-1363). When
transferring to a smart contract, the recipient's
`onConfidentialTransferReceived` hook is called. If the callback returns `false`
(encrypted), the transfer is automatically refunded.

## What You'll Learn

- How to create ERC-7984 compliant tokens
- How to wrap existing ERC20 tokens
- How to build token swap applications
- Best practices for confidential token design

## Next Steps

- [ERC7984 Token](/guides/build-confidential-tokens/erc7984-token) - Create
  native confidential tokens
- [ERC20 to ERC7984](/guides/build-confidential-tokens/erc20-to-erc7984-wrapper) -
  Wrap existing ERC20 tokens
- [Live Demo](/guides/build-confidential-tokens/demo) - Explore a live
  application showcasing confidential tokens
