---
title: Access Control
description:
  Manage permissions on encrypted handles, control who can compute and decrypt
---

# Access Control

Every new handle starts with **transient** access (valid only for the current
transaction). You must explicitly persist access so handles can be reused in
future transactions and decrypted by authorized users.

For a detailed explanation of the permission model, see
[Nox Smart Contracts: ACL](/protocol/nox-smart-contracts#acl-access-control-list).

## isInitialized

```solidity
function isInitialized(euint256 handle) internal pure returns (bool)
```

Returns `true` if the handle is non-zero (has been assigned a value). Use this
to check whether a mapping entry has been set before performing operations on
it. This is a basic check and does not guarantee that the handle is valid or
recognized by the ACL.

### Parameters

| Name     | Type       | Description          |
| -------- | ---------- | -------------------- |
| `handle` | `euint256` | The handle to check. |

### Returns

`bool` : `true` if the handle is non-zero, `false` otherwise.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

### Usage

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

### Parameters

| Name      | Type       | Description                           |
| --------- | ---------- | ------------------------------------- |
| `value`   | `euint256` | The handle to grant access on.        |
| `account` | `address`  | The address to grant admin access to. |

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

::: warning

The caller must already have access to the handle. You cannot grant access to a
handle you do not control.

:::

### Usage

```solidity
euint256 newBalance = Nox.add(balance, deposit);
Nox.allowThis(newBalance);          // contract keeps access
Nox.allow(newBalance, msg.sender);  // user can use this handle too
_balances[msg.sender] = newBalance;
```

## allowThis

```solidity
function allowThis(euint256 value) internal
```

Shorthand for `allow(value, address(this))`. Grants persistent access to the
calling contract so the handle can be reused in future transactions.

### Parameters

| Name    | Type       | Description                      |
| ------- | ---------- | -------------------------------- |
| `value` | `euint256` | The handle to persist access on. |

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

### Usage

```solidity
euint256 result = Nox.add(a, b);
Nox.allowThis(result); // contract can reuse this handle later
```

## allowTransient

```solidity
function allowTransient(euint256 value, address account) internal
```

Grants **one-time** access to `account` for the current transaction only.
Transient permissions are cleared at the end of the transaction. Useful for
passing handles to another contract within the same transaction without giving
permanent access.

### Parameters

| Name      | Type       | Description                              |
| --------- | ---------- | ---------------------------------------- |
| `value`   | `euint256` | The handle to grant transient access on. |
| `account` | `address`  | The address to grant one-time access to. |

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

### Usage

```solidity
// Grant temporary access to a helper contract for this transaction
Nox.allowTransient(amount, address(helperContract));
helperContract.processAmount(amount);
```

## isAllowed

```solidity
function isAllowed(euint256 handle, address account) internal view returns (bool)
```

Returns `true` if `account` has admin access (persistent or transient) to the
handle.

### Parameters

| Name      | Type       | Description               |
| --------- | ---------- | ------------------------- |
| `handle`  | `euint256` | The handle to check.      |
| `account` | `address`  | The address to check for. |

### Returns

`bool` : `true` if the account has admin access.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

### Usage

```solidity
require(Nox.isAllowed(balance, msg.sender), "No access to this handle");
```

## addViewer

```solidity
function addViewer(euint256 value, address viewer) internal
```

Grants **viewer** permission to `viewer`. Viewers can decrypt the handle's data
through the Handle Gateway using the
[JS SDK](/references/js-sdk/methods/decrypt) but cannot use the handle as input
in computations.

### Parameters

| Name     | Type       | Description                             |
| -------- | ---------- | --------------------------------------- |
| `value`  | `euint256` | The handle to grant viewer access on.   |
| `viewer` | `address`  | The address that can decrypt this data. |

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

### Usage

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

### Parameters

| Name     | Type       | Description               |
| -------- | ---------- | ------------------------- |
| `handle` | `euint256` | The handle to check.      |
| `viewer` | `address`  | The address to check for. |

### Returns

`bool` : `true` if the address has viewer permission.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

### Usage

```solidity
bool canDecrypt = Nox.isViewer(balance, user);
```

## allowPublicDecryption

```solidity
function allowPublicDecryption(euint256 value) internal
```

Makes the handle's data decryptable by anyone. Use this for values that should
be publicly visible (e.g. total supply, auction results, public counters).

### Parameters

| Name    | Type       | Description                           |
| ------- | ---------- | ------------------------------------- |
| `value` | `euint256` | The handle to make publicly readable. |

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

### Usage

```solidity
euint256 totalSupply = Nox.add(currentSupply, mintAmount);
Nox.allowThis(totalSupply);
Nox.allowPublicDecryption(totalSupply); // anyone can read the total supply
```

## isPubliclyDecryptable

```solidity
function isPubliclyDecryptable(euint256 handle) internal view returns (bool)
```

Returns `true` if the handle is marked as publicly decryptable.

### Parameters

| Name     | Type       | Description          |
| -------- | ---------- | -------------------- |
| `handle` | `euint256` | The handle to check. |

### Returns

`bool` : `true` if the handle is publicly decryptable.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

### Usage

```solidity
bool isPublic = Nox.isPubliclyDecryptable(totalSupply);
```
