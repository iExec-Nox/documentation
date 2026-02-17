---
title: Comparisons
description: Compare two encrypted values and return an encrypted boolean
---

# Comparisons

Compare two encrypted values and return an encrypted boolean. Both operands must
be of the same type.

## eq

```solidity
function eq(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a == b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

```solidity
ebool isEqual = Nox.eq(balanceA, balanceB);
Nox.allowThis(isEqual);
```

## ne

```solidity
function ne(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a != b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

## lt

```solidity
function lt(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a < b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

## le

```solidity
function le(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a <= b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

## gt

```solidity
function gt(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a > b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

## ge

```solidity
function ge(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a >= b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`
