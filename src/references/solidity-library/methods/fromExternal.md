---
title: fromExternal
description: Validate encrypted handles submitted by users via the JS SDK
---

# fromExternal

```solidity
function fromExternal(externalEuint256 handle, bytes calldata proof) internal returns (euint256)
```

Validates the EIP-712 proof and returns a typed encrypted handle. Reverts if the
proof is invalid, expired, or was issued for a different contract.

## Available overloads

| Input type         | Return type |
| ------------------ | ----------- |
| `externalEbool`    | `ebool`     |
| `externalEaddress` | `eaddress`  |
| `externalEuint16`  | `euint16`   |
| `externalEuint256` | `euint256`  |
| `externalEint16`   | `eint16`    |
| `externalEint256`  | `eint256`   |

## Example

```solidity
function deposit(externalEuint256 encryptedAmount, bytes calldata proof) external {
    euint256 amount = Nox.fromExternal(encryptedAmount, proof);
    // amount is now a validated handle, ready for computation
}
```

::: tip

The `external*` types enforce at the Solidity type level that unvalidated
handles cannot be used in computations. You must call `fromExternal` first.

:::
