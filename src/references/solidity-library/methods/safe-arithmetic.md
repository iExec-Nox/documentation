---
title: Safe Arithmetic
description: Encrypted arithmetic with overflow and underflow detection
---

# Safe Arithmetic

Same operations as
[core arithmetic](/references/solidity-library/methods/arithmetic), but
returning two handles: `(ebool success, result)`. When `success` is `false`, the
`result` is always `0`.

## safeAdd

```solidity
function safeAdd(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Addition with overflow detection. Returns `success = false` and `result = 0` on
overflow.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

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

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

## safeMul

```solidity
function safeMul(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Multiplication with overflow detection. Returns `success = false` and
`result = 0` on overflow.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

## safeDiv

```solidity
function safeDiv(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Division with error detection. Returns `success = false` and `result = 0` on
division by zero or signed overflow (`MIN / -1`).

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`
