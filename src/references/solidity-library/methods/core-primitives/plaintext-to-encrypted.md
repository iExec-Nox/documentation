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

## toEbool

```solidity
function toEbool(bool value) internal returns (ebool)
```

Converts a plaintext boolean to an encrypted boolean handle.

### Parameters

| Name    | Type   | Description                  |
| ------- | ------ | ---------------------------- |
| `value` | `bool` | The plaintext boolean value. |

### Returns

`ebool` : an encrypted boolean handle.

### Usage

```solidity
ebool flag = Nox.toEbool(true);
Nox.allowThis(flag);
```

## toEaddress

```solidity
function toEaddress(address value) internal returns (eaddress)
```

Converts a plaintext address to an encrypted address handle.

### Parameters

| Name    | Type      | Description                  |
| ------- | --------- | ---------------------------- |
| `value` | `address` | The plaintext address value. |

### Returns

`eaddress` : an encrypted address handle.

### Usage

```solidity
eaddress recipient = Nox.toEaddress(msg.sender);
Nox.allowThis(recipient);
```

## toEuint16

```solidity
function toEuint16(uint16 value) internal returns (euint16)
```

Converts a plaintext `uint16` to an encrypted handle.

### Parameters

| Name    | Type     | Description             |
| ------- | -------- | ----------------------- |
| `value` | `uint16` | The plaintext `uint16`. |

### Returns

`euint16` : an encrypted unsigned 16-bit integer handle.

### Usage

```solidity
euint16 threshold = Nox.toEuint16(100);
Nox.allowThis(threshold);
```

## toEuint256

```solidity
function toEuint256(uint256 value) internal returns (euint256)
```

Converts a plaintext `uint256` to an encrypted handle.

### Parameters

| Name    | Type      | Description              |
| ------- | --------- | ------------------------ |
| `value` | `uint256` | The plaintext `uint256`. |

### Returns

`euint256` : an encrypted unsigned 256-bit integer handle.

### Usage

```solidity
euint256 initialBalance = Nox.toEuint256(1_000_000);
Nox.allowThis(initialBalance);
```

## toEint16

```solidity
function toEint16(int16 value) internal returns (eint16)
```

Converts a plaintext `int16` to an encrypted handle.

### Parameters

| Name    | Type    | Description            |
| ------- | ------- | ---------------------- |
| `value` | `int16` | The plaintext `int16`. |

### Returns

`eint16` : an encrypted signed 16-bit integer handle.

### Usage

```solidity
eint16 delta = Nox.toEint16(-50);
Nox.allowThis(delta);
```

## toEint256

```solidity
function toEint256(int256 value) internal returns (eint256)
```

Converts a plaintext `int256` to an encrypted handle.

### Parameters

| Name    | Type     | Description             |
| ------- | -------- | ----------------------- |
| `value` | `int256` | The plaintext `int256`. |

### Returns

`eint256` : an encrypted signed 256-bit integer handle.

### Usage

```solidity
eint256 offset = Nox.toEint256(-1_000);
Nox.allowThis(offset);
```
