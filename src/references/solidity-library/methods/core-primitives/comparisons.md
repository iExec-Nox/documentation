---
title: Comparisons
description: Compare two encrypted values and return an encrypted boolean
---

# Comparisons

Compare two encrypted values and return an encrypted boolean. Both operands must
be of the same type. The result is always an `ebool`, regardless of the operand
type.

Comparison results are typically used with
[select](/references/solidity-library/methods/core-primitives/select) for
encrypted conditional logic.

**Supported types:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
// Check if balance is sufficient and conditionally apply a transfer
ebool hasEnough = Nox.ge(balance, amount);
euint256 newBalance = Nox.select(hasEnough, Nox.sub(balance, amount), balance);
Nox.allowThis(newBalance);
```

## eq

```solidity
function eq(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a == b`.

## ne

```solidity
function ne(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a != b`.

## lt

```solidity
function lt(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a < b`.

## le

```solidity
function le(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a <= b`.

## gt

```solidity
function gt(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a > b`.

## ge

```solidity
function ge(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a >= b`.
