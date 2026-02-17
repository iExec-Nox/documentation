---
title: Safe Arithmetic
description: Encrypted arithmetic with overflow and underflow detection
---

# Safe Arithmetic

Same operations as
[core arithmetic](/references/solidity-library/methods/core-primitives/arithmetic),
but returning two handles: `(ebool success, result)`. When `success` is `false`,
the `result` is always `0`.

Use safe arithmetic when your contract needs to detect and handle overflow or
underflow without leaking information through transaction reverts.

## safeAdd

```solidity
function safeAdd(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Addition with overflow detection. Returns `success = false` and `result = 0` on
overflow.

### Parameters

| Name | Type       | Description    |
| ---- | ---------- | -------------- |
| `a`  | `euint256` | Left operand.  |
| `b`  | `euint256` | Right operand. |

### Returns

| Name      | Type       | Description                               |
| --------- | ---------- | ----------------------------------------- |
| `success` | `ebool`    | `true` if no overflow, `false` otherwise. |
| `result`  | `euint256` | The sum `a + b`, or `0` on overflow.      |

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
(ebool ok, euint256 newBalance) = Nox.safeAdd(balance, amount);
Nox.allowThis(ok);
Nox.allowThis(newBalance);
```

## safeSub

```solidity
function safeSub(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Subtraction with underflow detection. Returns `success = false` and `result = 0`
on underflow.

### Parameters

| Name | Type       | Description             |
| ---- | ---------- | ----------------------- |
| `a`  | `euint256` | Value to subtract from. |
| `b`  | `euint256` | Value to subtract.      |

### Returns

| Name      | Type       | Description                                  |
| --------- | ---------- | -------------------------------------------- |
| `success` | `ebool`    | `true` if no underflow, `false` otherwise.   |
| `result`  | `euint256` | The difference `a - b`, or `0` on underflow. |

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
(ebool ok, euint256 remaining) = Nox.safeSub(balance, withdrawal);
Nox.allowThis(ok);
Nox.allowThis(remaining);
```

## safeMul

```solidity
function safeMul(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Multiplication with overflow detection. Returns `success = false` and
`result = 0` on overflow.

### Parameters

| Name | Type       | Description    |
| ---- | ---------- | -------------- |
| `a`  | `euint256` | Left operand.  |
| `b`  | `euint256` | Right operand. |

### Returns

| Name      | Type       | Description                               |
| --------- | ---------- | ----------------------------------------- |
| `success` | `ebool`    | `true` if no overflow, `false` otherwise. |
| `result`  | `euint256` | The product `a * b`, or `0` on overflow.  |

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
(ebool ok, euint256 total) = Nox.safeMul(price, quantity);
Nox.allowThis(ok);
Nox.allowThis(total);
```

## safeDiv

```solidity
function safeDiv(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Division with error detection. Returns `success = false` and `result = 0` on
division by zero or signed overflow (`MIN / -1`).

### Parameters

| Name | Type       | Description  |
| ---- | ---------- | ------------ |
| `a`  | `euint256` | Numerator.   |
| `b`  | `euint256` | Denominator. |

### Returns

| Name      | Type       | Description                                 |
| --------- | ---------- | ------------------------------------------- |
| `success` | `ebool`    | `true` if no error, `false` on div-by-zero. |
| `result`  | `euint256` | The quotient `a / b`, or `0` on error.      |

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
(ebool ok, euint256 share) = Nox.safeDiv(rewards, participants);
Nox.allowThis(ok);
Nox.allowThis(share);
```
