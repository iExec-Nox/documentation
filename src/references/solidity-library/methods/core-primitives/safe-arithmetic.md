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

**Supported types:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
(ebool ok, euint256 newBalance) = Nox.safeAdd(balance, amount);
// Use select to keep the old balance on failure
euint256 finalBalance = Nox.select(ok, newBalance, balance);
Nox.allowThis(finalBalance);
```

## safeAdd

```solidity
function safeAdd(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Addition with overflow detection. Returns `success = false` and `result = 0` on
overflow.

## safeSub

```solidity
function safeSub(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Subtraction with underflow detection. Returns `success = false` and `result = 0`
on underflow.

## safeMul

```solidity
function safeMul(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Multiplication with overflow detection. Returns `success = false` and
`result = 0` on overflow.

## safeDiv

```solidity
function safeDiv(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Division with error detection. Returns `success = false` and `result = 0` on
division by zero or signed overflow (`MIN / -1`).
