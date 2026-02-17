---
title: Trivial Encryption
description: Convert plaintext values to encrypted handles
---

# Trivial Encryption

Convert plaintext values to encrypted handles. The value is encrypted off-chain
by the Runner and stored in the [Handle Gateway](/protocol/gateway).

::: info

Trivial encryption is useful for initializing state variables and constants. For
user-provided values, prefer
[fromExternal](/references/solidity-library/methods/fromExternal) with the
[JS SDK](/references/js-sdk) to avoid exposing plaintext on-chain.

:::

## toEbool

```solidity
function toEbool(bool value) internal returns (ebool)
```

Converts a plaintext boolean to an encrypted boolean handle.

```solidity
ebool flag = Nox.toEbool(true);
Nox.allowThis(flag);
```

## toEaddress

```solidity
function toEaddress(address value) internal returns (eaddress)
```

Converts a plaintext address to an encrypted address handle.

```solidity
eaddress recipient = Nox.toEaddress(msg.sender);
Nox.allowThis(recipient);
```

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

```solidity
euint256 initialBalance = Nox.toEuint256(1_000_000);
Nox.allowThis(initialBalance);
```

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
