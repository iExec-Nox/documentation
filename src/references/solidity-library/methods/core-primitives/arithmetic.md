---
title: Arithmetic
description: Encrypted arithmetic operations with wrapping semantics
---

# Arithmetic

Binary operations on two encrypted values of the same type. All arithmetic uses
**wrapping semantics**, matching Solidity's `unchecked` behavior. See
[Computation Primitives](/protocol/computation-primitives) for detailed overflow
behavior and edge cases.

For overflow-safe variants, see
[Safe Arithmetic](/references/solidity-library/methods/core-primitives/safe-arithmetic).

## add

```solidity
function add(euint256 a, euint256 b) internal returns (euint256)
```

Wrapping addition. On overflow, the result wraps around the type boundary.

### Parameters

| Name | Type       | Description    |
| ---- | ---------- | -------------- |
| `a`  | `euint256` | Left operand.  |
| `b`  | `euint256` | Right operand. |

### Returns

`euint256` : the encrypted sum `a + b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
euint256 total = Nox.add(balance, deposit);
Nox.allowThis(total);
```

## sub

```solidity
function sub(euint256 a, euint256 b) internal returns (euint256)
```

Wrapping subtraction. On underflow, the result wraps around.

### Parameters

| Name | Type       | Description             |
| ---- | ---------- | ----------------------- |
| `a`  | `euint256` | Value to subtract from. |
| `b`  | `euint256` | Value to subtract.      |

### Returns

`euint256` : the encrypted difference `a - b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
euint256 remaining = Nox.sub(balance, amount);
Nox.allowThis(remaining);
```

## mul

```solidity
function mul(euint256 a, euint256 b) internal returns (euint256)
```

Wrapping multiplication. On overflow, the result wraps around.

### Parameters

| Name | Type       | Description    |
| ---- | ---------- | -------------- |
| `a`  | `euint256` | Left operand.  |
| `b`  | `euint256` | Right operand. |

### Returns

`euint256` : the encrypted product `a * b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
euint256 fee = Nox.mul(amount, feeRate);
Nox.allowThis(fee);
```

## div

```solidity
function div(euint256 a, euint256 b) internal returns (euint256)
```

Integer division, truncated toward zero. Division by zero returns the maximum
representable value of the type instead of reverting.

### Parameters

| Name | Type       | Description  |
| ---- | ---------- | ------------ |
| `a`  | `euint256` | Numerator.   |
| `b`  | `euint256` | Denominator. |

### Returns

`euint256` : the encrypted quotient `a / b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
euint256 share = Nox.div(totalRewards, participantCount);
Nox.allowThis(share);
```
