---
title: fromExternal
description: Validate encrypted handles submitted by users via the JS SDK
---

# fromExternal

Validates an EIP-712 proof attached to an encrypted handle submitted by a user.
On success, returns a typed handle ready for computation. Reverts if the proof
is invalid, expired, or was issued for a different contract.

This is the entry point for all user-provided encrypted inputs. The user
encrypts a value with the [JS SDK](/references/js-sdk/methods/encryptInput), and
the contract validates the proof on-chain before using the handle.

**Supported types:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

::: tip

The `external*` types enforce at the Solidity type level that unvalidated
handles cannot be used in computations. You must call `fromExternal` first.

:::

### Usage

```solidity
function deposit(externalEuint256 encryptedAmount, bytes calldata proof) external {
    // Validate the user's encrypted input
    euint256 amount = Nox.fromExternal(encryptedAmount, proof);

    // Now use the validated handle in computations
    euint256 newBalance = Nox.add(_balances[msg.sender], amount);
    Nox.allowThis(newBalance);
    Nox.allow(newBalance, msg.sender);
    _balances[msg.sender] = newBalance;
}
```

## Signature

```solidity
function fromExternal(externalEuint256 handle, bytes calldata proof) internal returns (euint256)
```
