---
title: select
description: Encrypted conditional branching
---

# select

Returns `ifTrue` when `condition` is encrypted `true`, `ifFalse` otherwise.
Since encrypted values cannot be branched on with `if`, `select` is the only way
to implement conditional logic on encrypted data.

**Supported types:** `euint16`, `euint256`, `eint16`, `eint256`

::: tip

`select` is the encrypted equivalent of a ternary operator
(`condition ? a : b`). Since encrypted values cannot be branched on with `if`,
use `select` for all conditional logic.

:::

### Usage

```solidity
// Confidential max(a, b)
ebool aIsGreater = Nox.gt(a, b);
euint256 maxValue = Nox.select(aIsGreater, a, b);
Nox.allowThis(maxValue);
```

```solidity
// Apply a fee only if balance exceeds threshold
ebool exceedsThreshold = Nox.gt(balance, threshold);
euint256 fee = Nox.select(exceedsThreshold, feeAmount, zeroAmount);
euint256 finalBalance = Nox.sub(balance, fee);
Nox.allowThis(fee);
Nox.allowThis(finalBalance);
```

## Signature

```solidity
function select(ebool condition, euint256 ifTrue, euint256 ifFalse) internal returns (euint256)
```
