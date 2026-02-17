---
title: Access Control
description:
  Manage permissions on encrypted handles, control who can compute and decrypt
---

# Access Control

Every new handle starts with **transient** access (valid only for the current
transaction). You must explicitly persist access using the functions below.

For a detailed explanation of the permission model, see
[Nox Smart Contracts: ACL](/protocol/nox-smart-contracts#acl-access-control-list).

## isInitialized

```solidity
function isInitialized(euint256 handle) internal pure returns (bool)
```

Returns `true` if the handle is non-zero (has been assigned a value). This is a
basic check and does not guarantee that the handle is valid or recognized by the
ACL.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

```solidity
euint256 balance = _balances[user];
if (!Nox.isInitialized(balance)) {
    balance = Nox.toEuint256(0);
    Nox.allowThis(balance);
    _balances[user] = balance;
}
```

## allow

```solidity
function allow(euint256 value, address account) internal
```

Grants persistent **admin** access to `account` on the handle. The account can
use the handle as input in future computations and manage its permissions.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

::: warning

The caller must already have access to the handle. You cannot grant access to a
handle you do not control.

:::

## allowThis

```solidity
function allowThis(euint256 value) internal
```

Shorthand for `allow(value, address(this))`. Grants persistent access to the
calling contract.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

```solidity
euint256 result = Nox.add(a, b);
Nox.allowThis(result); // contract can reuse this handle later
```

## allowTransient

```solidity
function allowTransient(euint256 value, address account) internal
```

Grants **one-time** access to `account` for the current transaction only.
Transient permissions are cleared at the end of the transaction.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

## isAllowed

```solidity
function isAllowed(euint256 handle, address account) internal view returns (bool)
```

Returns `true` if `account` has admin access (persistent or transient) to the
handle.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

## addViewer

```solidity
function addViewer(euint256 value, address viewer) internal
```

Grants **viewer** permission to `viewer`. The viewer can decrypt the handle's
data through the Handle Gateway but cannot use the handle in computations.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

```solidity
euint256 balance = Nox.add(a, b);
Nox.allowThis(balance);
Nox.addViewer(balance, msg.sender); // user can decrypt their balance
```

## isViewer

```solidity
function isViewer(euint256 handle, address viewer) internal view returns (bool)
```

Returns `true` if `viewer` has viewer permission on the handle.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

## allowPublicDecryption

```solidity
function allowPublicDecryption(euint256 value) internal
```

Makes the handle's data decryptable by anyone. Use this for values that should
be publicly visible (e.g. total supply, public counters).

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

## isPubliclyDecryptable

```solidity
function isPubliclyDecryptable(euint256 handle) internal view returns (bool)
```

Returns `true` if the handle is marked as publicly decryptable.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`
