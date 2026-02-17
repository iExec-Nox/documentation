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

## eq

```solidity
function eq(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a == b`.

### Parameters

| Name | Type       | Description    |
| ---- | ---------- | -------------- |
| `a`  | `euint256` | Left operand.  |
| `b`  | `euint256` | Right operand. |

### Returns

`ebool` : encrypted `true` if `a` equals `b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
ebool isEqual = Nox.eq(balanceA, balanceB);
Nox.allowThis(isEqual);
```

## ne

```solidity
function ne(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a != b`.

### Parameters

| Name | Type       | Description    |
| ---- | ---------- | -------------- |
| `a`  | `euint256` | Left operand.  |
| `b`  | `euint256` | Right operand. |

### Returns

`ebool` : encrypted `true` if `a` does not equal `b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
ebool isDifferent = Nox.ne(currentPrice, lastPrice);
Nox.allowThis(isDifferent);
```

## lt

```solidity
function lt(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a < b`.

### Parameters

| Name | Type       | Description    |
| ---- | ---------- | -------------- |
| `a`  | `euint256` | Left operand.  |
| `b`  | `euint256` | Right operand. |

### Returns

`ebool` : encrypted `true` if `a` is strictly less than `b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
ebool isUnderLimit = Nox.lt(amount, maxAllowed);
Nox.allowThis(isUnderLimit);
```

## le

```solidity
function le(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a <= b`.

### Parameters

| Name | Type       | Description    |
| ---- | ---------- | -------------- |
| `a`  | `euint256` | Left operand.  |
| `b`  | `euint256` | Right operand. |

### Returns

`ebool` : encrypted `true` if `a` is less than or equal to `b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
ebool withinBudget = Nox.le(spent, budget);
Nox.allowThis(withinBudget);
```

## gt

```solidity
function gt(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a > b`.

### Parameters

| Name | Type       | Description    |
| ---- | ---------- | -------------- |
| `a`  | `euint256` | Left operand.  |
| `b`  | `euint256` | Right operand. |

### Returns

`ebool` : encrypted `true` if `a` is strictly greater than `b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
ebool hasSurplus = Nox.gt(revenue, expenses);
Nox.allowThis(hasSurplus);
```

## ge

```solidity
function ge(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a >= b`.

### Parameters

| Name | Type       | Description    |
| ---- | ---------- | -------------- |
| `a`  | `euint256` | Left operand.  |
| `b`  | `euint256` | Right operand. |

### Returns

`ebool` : encrypted `true` if `a` is greater than or equal to `b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
ebool hasEnough = Nox.ge(balance, minRequired);
Nox.allowThis(hasEnough);
```
