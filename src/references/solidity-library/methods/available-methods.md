---
title: Available Methods
description: Complete API reference for the Nox Solidity library
---

# Available Methods

All functions are called as `Nox.functionName(...)`. They are `internal` library
functions, so they can only be called from within your contract.

Operations on encrypted handles (arithmetic, comparisons, select, transfer,
mint, burn) emit events that trigger off-chain TEE computation. The result
handle is deterministic and computed on-chain, but the actual encrypted value is
produced off-chain by the [Runner](/protocol/runner).

## Trivial Encryption

Convert plaintext values to encrypted handles. The value is encrypted off-chain
by the Runner and stored in the [Handle Gateway](/protocol/gateway).

### toEbool

```solidity
function toEbool(bool value) internal returns (ebool)
```

Converts a plaintext boolean to an encrypted boolean handle.

```solidity
ebool flag = Nox.toEbool(true);
Nox.allowThis(flag);
```

### toEaddress

```solidity
function toEaddress(address value) internal returns (eaddress)
```

Converts a plaintext address to an encrypted address handle.

```solidity
eaddress recipient = Nox.toEaddress(msg.sender);
Nox.allowThis(recipient);
```

### toEuint16

```solidity
function toEuint16(uint16 value) internal returns (euint16)
```

Converts a plaintext `uint16` to an encrypted handle.

### toEuint256

```solidity
function toEuint256(uint256 value) internal returns (euint256)
```

Converts a plaintext `uint256` to an encrypted handle.

```solidity
euint256 initialBalance = Nox.toEuint256(1_000_000);
Nox.allowThis(initialBalance);
```

### toEint16

```solidity
function toEint16(int16 value) internal returns (eint16)
```

Converts a plaintext `int16` to an encrypted handle.

### toEint256

```solidity
function toEint256(int256 value) internal returns (eint256)
```

Converts a plaintext `int256` to an encrypted handle.

## Handle Validation

Validate handles submitted by users via the [JS SDK](/references/js-sdk). The
`external*` types represent unvalidated handles that must be converted to their
internal counterparts before use.

### fromExternal

```solidity
function fromExternal(externalEuint256 handle, bytes calldata proof) internal returns (euint256)
```

Validates the EIP-712 proof and returns a typed encrypted handle. Reverts if the
proof is invalid, expired, or was issued for a different contract.

**Available overloads:**

| Input type | Return type |
| --- | --- |
| `externalEbool` | `ebool` |
| `externalEaddress` | `eaddress` |
| `externalEuint16` | `euint16` |
| `externalEuint256` | `euint256` |
| `externalEint16` | `eint16` |
| `externalEint256` | `eint256` |

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

## Arithmetic

Binary operations on two encrypted values of the same type. All arithmetic uses
**wrapping semantics**, matching Solidity's `unchecked` behavior. See
[Computation Primitives](/protocol/computation-primitives) for detailed overflow
behavior and edge cases.

### add

```solidity
function add(euint256 a, euint256 b) internal returns (euint256)
```

Wrapping addition. On overflow, the result wraps around the type boundary.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

```solidity
euint256 total = Nox.add(balance, deposit);
Nox.allowThis(total);
```

### sub

```solidity
function sub(euint256 a, euint256 b) internal returns (euint256)
```

Wrapping subtraction. On underflow, the result wraps around.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### mul

```solidity
function mul(euint256 a, euint256 b) internal returns (euint256)
```

Wrapping multiplication. On overflow, the result wraps around.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### div

```solidity
function div(euint256 a, euint256 b) internal returns (euint256)
```

Integer division, truncated toward zero. Division by zero returns the maximum
representable value of the type instead of reverting.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

## Safe Arithmetic

Same operations as core arithmetic, but returning two handles:
`(ebool success, result)`. When `success` is `false`, the `result` is always
`0`.

### safeAdd

```solidity
function safeAdd(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Addition with overflow detection. Returns `success = false` and `result = 0` on
overflow.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

```solidity
(ebool ok, euint256 newBalance) = Nox.safeAdd(balance, amount);
Nox.allowThis(ok);
Nox.allowThis(newBalance);
```

### safeSub

```solidity
function safeSub(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Subtraction with underflow detection. Returns `success = false` and `result = 0`
on underflow.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### safeMul

```solidity
function safeMul(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Multiplication with overflow detection. Returns `success = false` and
`result = 0` on overflow.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### safeDiv

```solidity
function safeDiv(euint256 a, euint256 b) internal returns (ebool success, euint256 result)
```

Division with error detection. Returns `success = false` and `result = 0` on
division by zero or signed overflow (`MIN / -1`).

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

## Comparisons

Compare two encrypted values and return an encrypted boolean. Both operands must
be of the same type.

### eq

```solidity
function eq(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a == b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

```solidity
ebool isEqual = Nox.eq(balanceA, balanceB);
Nox.allowThis(isEqual);
```

### ne

```solidity
function ne(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a != b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### lt

```solidity
function lt(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a < b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### le

```solidity
function le(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a <= b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### gt

```solidity
function gt(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a > b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

### ge

```solidity
function ge(euint256 a, euint256 b) internal returns (ebool)
```

Returns encrypted `true` when `a >= b`.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

## Conditional

### select

```solidity
function select(ebool condition, euint256 ifTrue, euint256 ifFalse) internal returns (euint256)
```

Returns `ifTrue` when `condition` is encrypted `true`, `ifFalse` otherwise. The
condition must be an `ebool` and both branches must be of the same type.

**Available overloads:** `euint16`, `euint256`, `eint16`, `eint256`

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

## Token Operations

High-level operations for confidential token contracts. They follow
**all-or-nothing** semantics: if the operation cannot complete (insufficient
balance, overflow), nothing changes and `success` is set to `false`. This
prevents leaking balance information through transaction success/failure.

### transfer

```solidity
function transfer(
    euint256 balanceFrom,
    euint256 balanceTo,
    euint256 amount
) internal returns (ebool success, euint256 newBalanceFrom, euint256 newBalanceTo)
```

Moves tokens between two balances. If `amount > balanceFrom`, nothing is
transferred and all output handles contain the original values.

```solidity
(ebool ok, euint256 newFrom, euint256 newTo) = Nox.transfer(
    _balances[from],
    _balances[to],
    amount
);
Nox.allowThis(ok);
Nox.allowThis(newFrom);
Nox.allowThis(newTo);
Nox.allow(newFrom, from);
Nox.allow(newTo, to);
_balances[from] = newFrom;
_balances[to] = newTo;
```

### mint

```solidity
function mint(
    euint256 balanceTo,
    euint256 amount,
    euint256 totalSupply
) internal returns (ebool success, euint256 newBalanceTo, euint256 newTotalSupply)
```

Creates new tokens. If either `balanceTo + amount` or `totalSupply + amount`
overflows, nothing is minted.

### burn

```solidity
function burn(
    euint256 balanceFrom,
    euint256 amount,
    euint256 totalSupply
) internal returns (ebool success, euint256 newBalanceFrom, euint256 newTotalSupply)
```

Destroys tokens. If `amount > balanceFrom` or `totalSupply - amount` underflows,
nothing is burned.

## Handle Initialization

### isInitialized

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

## Access Control

Every new handle starts with **transient** access (valid only for the current
transaction). You must explicitly persist access using the functions below.

For a detailed explanation of the permission model, see
[Nox Smart Contracts: ACL](/protocol/nox-smart-contracts#acl-access-control-list).

### allow

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

### allowThis

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

### allowTransient

```solidity
function allowTransient(euint256 value, address account) internal
```

Grants **one-time** access to `account` for the current transaction only.
Transient permissions are cleared at the end of the transaction.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

### isAllowed

```solidity
function isAllowed(euint256 handle, address account) internal view returns (bool)
```

Returns `true` if `account` has admin access (persistent or transient) to the
handle.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

## Viewer Management

Viewers can decrypt the underlying data via the
[JS SDK](/references/js-sdk/methods/decrypt) but cannot use the handle in
computations.

### addViewer

```solidity
function addViewer(euint256 value, address viewer) internal
```

Grants **viewer** permission to `viewer`. The viewer can decrypt the handle's
data through the Handle Gateway.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

```solidity
euint256 balance = Nox.add(a, b);
Nox.allowThis(balance);
Nox.addViewer(balance, msg.sender); // user can decrypt their balance
```

### isViewer

```solidity
function isViewer(euint256 handle, address viewer) internal view returns (bool)
```

Returns `true` if `viewer` has viewer permission on the handle.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

## Public Decryption

### allowPublicDecryption

```solidity
function allowPublicDecryption(euint256 value) internal
```

Makes the handle's data decryptable by anyone. Use this for values that should
be publicly visible (e.g. total supply, public counters).

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

### isPubliclyDecryptable

```solidity
function isPubliclyDecryptable(euint256 handle) internal view returns (bool)
```

Returns `true` if the handle is marked as publicly decryptable.

**Available overloads:** `ebool`, `eaddress`, `euint16`, `euint256`, `eint16`,
`eint256`

## Learn More

- [Computation Primitives](/protocol/computation-primitives): detailed semantics
  for each operation (overflow behavior, edge cases, examples)
- [JS SDK](/references/js-sdk): encrypt inputs and decrypt results from
  JavaScript
- [Global Architecture Overview](/protocol/global-architecture-overview):
  understand how on-chain events trigger off-chain computation
