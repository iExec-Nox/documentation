---
title: Plaintext to Encrypted
description: Convert plaintext values to encrypted handles
---

# Plaintext to Encrypted

Convert plaintext values to encrypted handles. The contract emits an event, and
the [Runner](/protocol/runner) encrypts the value off-chain inside a TEE. The
encrypted data is stored in the [Handle Gateway](/protocol/gateway).

::: info

Trivial encryption is useful for initializing state variables and constants. For
user-provided values, prefer
[fromExternal](/references/solidity-library/methods/core-primitives/fromExternal)
with the [JS SDK](/references/js-sdk) to avoid exposing plaintext on-chain.

:::

### Usage

```solidity
// Initialize encrypted state variables
euint256 initialBalance = Nox.toEuint256(0);
Nox.allowThis(initialBalance);

euint16 threshold = Nox.toEuint16(100);
Nox.allowThis(threshold);

ebool flag = Nox.toEbool(true);
Nox.allowThis(flag);
```

## toEbool

```solidity
function toEbool(bool value) internal returns (ebool)
```

Converts a plaintext boolean to an encrypted boolean handle.

## toEaddress

```solidity
function toEaddress(address value) internal returns (eaddress)
```

Converts a plaintext address to an encrypted address handle.

## toEuint16

```solidity
function toEuint16(uint16 value) internal returns (euint16)
```

Converts a plaintext `uint16` to an encrypted handle.

## toEuint256

```solidity
function toEuint256(uint256 value) internal returns (euint256)
```

Converts a plaintext `uint256` to an encrypted handle.

## toEint16

```solidity
function toEint16(int16 value) internal returns (eint16)
```

Converts a plaintext `int16` to an encrypted handle.

## toEint256

```solidity
function toEint256(int256 value) internal returns (eint256)
```

Converts a plaintext `int256` to an encrypted handle.
