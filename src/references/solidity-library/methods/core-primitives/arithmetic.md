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

**Supported types:** `euint16`, `euint256`, `eint16`, `eint256`

### Usage

```solidity
euint256 total = Nox.add(balance, deposit);
euint256 remaining = Nox.sub(total, fee);
euint256 reward = Nox.mul(remaining, rate);
euint256 share = Nox.div(reward, participantCount);
Nox.allowThis(share);
```

## add

```solidity
function add(euint256 a, euint256 b) internal returns (euint256)
```

Wrapping addition. On overflow, the result wraps around the type boundary.

## sub

```solidity
function sub(euint256 a, euint256 b) internal returns (euint256)
```

Wrapping subtraction. On underflow, the result wraps around.

## mul

```solidity
function mul(euint256 a, euint256 b) internal returns (euint256)
```

Wrapping multiplication. On overflow, the result wraps around.

## div

```solidity
function div(euint256 a, euint256 b) internal returns (euint256)
```

Integer division, truncated toward zero. Division by zero returns the maximum
representable value of the type instead of reverting.
