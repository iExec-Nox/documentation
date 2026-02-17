---
title: select
description: Encrypted conditional branching
---

# select

```solidity
function select(ebool condition, euint256 ifTrue, euint256 ifFalse) internal returns (euint256)
```

Returns `ifTrue` when `condition` is encrypted `true`, `ifFalse` otherwise. The
condition must be an `ebool` and both branches must be of the same type.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

## Example

```solidity
// Confidential max(a, b)
ebool aIsGreater = Nox.gt(a, b);
euint256 maxValue = Nox.select(aIsGreater, a, b);
Nox.allowThis(maxValue);
```

::: tip

`select` is the encrypted equivalent of a ternary operator
(`condition ? a : b`). Since encrypted values cannot be branched on with `if`,
use `select` for all conditional logic.

:::
