---
title: Token Operations
description:
  High-level confidential token operations with all-or-nothing semantics
---

# Token Operations

High-level operations for confidential token contracts. They follow
**all-or-nothing** semantics: if the operation cannot complete (insufficient
balance, overflow), nothing changes and `success` is set to `false`. This
prevents leaking balance information through transaction success/failure.

These operations are composed from
[core primitives](/references/solidity-library/methods/core-primitives/arithmetic)
and executed atomically inside the TEE.

## transfer

```solidity
function transfer(
    euint256 balanceFrom,
    euint256 balanceTo,
    euint256 amount
) internal returns (ebool success, euint256 newBalanceFrom, euint256 newBalanceTo)
```

Moves tokens between two balances. If `amount > balanceFrom`, nothing is
transferred and all output handles retain the original values.

### Parameters

| Name          | Type       | Description                  |
| ------------- | ---------- | ---------------------------- |
| `balanceFrom` | `euint256` | Sender's current balance.    |
| `balanceTo`   | `euint256` | Recipient's current balance. |
| `amount`      | `euint256` | Amount to transfer.          |

### Returns

| Name             | Type       | Description                                      |
| ---------------- | ---------- | ------------------------------------------------ |
| `success`        | `ebool`    | `true` if transfer succeeded, `false` otherwise. |
| `newBalanceFrom` | `euint256` | Sender's updated balance.                        |
| `newBalanceTo`   | `euint256` | Recipient's updated balance.                     |

### Usage

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

## mint

```solidity
function mint(
    euint256 balanceTo,
    euint256 amount,
    euint256 totalSupply
) internal returns (ebool success, euint256 newBalanceTo, euint256 newTotalSupply)
```

Creates new tokens. If either `balanceTo + amount` or `totalSupply + amount`
overflows, nothing is minted and `success` is `false`.

### Parameters

| Name          | Type       | Description                  |
| ------------- | ---------- | ---------------------------- |
| `balanceTo`   | `euint256` | Recipient's current balance. |
| `amount`      | `euint256` | Amount to mint.              |
| `totalSupply` | `euint256` | Current total supply.        |

### Returns

| Name             | Type       | Description                                  |
| ---------------- | ---------- | -------------------------------------------- |
| `success`        | `ebool`    | `true` if mint succeeded, `false` otherwise. |
| `newBalanceTo`   | `euint256` | Recipient's updated balance.                 |
| `newTotalSupply` | `euint256` | Updated total supply.                        |

### Usage

```solidity
(ebool ok, euint256 newBalance, euint256 newSupply) = Nox.mint(
    _balances[to],
    amount,
    _totalSupply
);
Nox.allowThis(ok);
Nox.allowThis(newBalance);
Nox.allowThis(newSupply);
Nox.allow(newBalance, to);
_balances[to] = newBalance;
_totalSupply = newSupply;
```

## burn

```solidity
function burn(
    euint256 balanceFrom,
    euint256 amount,
    euint256 totalSupply
) internal returns (ebool success, euint256 newBalanceFrom, euint256 newTotalSupply)
```

Destroys tokens. If `amount > balanceFrom` or `totalSupply - amount` underflows,
nothing is burned and `success` is `false`.

### Parameters

| Name          | Type       | Description               |
| ------------- | ---------- | ------------------------- |
| `balanceFrom` | `euint256` | Sender's current balance. |
| `amount`      | `euint256` | Amount to burn.           |
| `totalSupply` | `euint256` | Current total supply.     |

### Returns

| Name             | Type       | Description                                  |
| ---------------- | ---------- | -------------------------------------------- |
| `success`        | `ebool`    | `true` if burn succeeded, `false` otherwise. |
| `newBalanceFrom` | `euint256` | Sender's updated balance.                    |
| `newTotalSupply` | `euint256` | Updated total supply.                        |

### Usage

```solidity
(ebool ok, euint256 newBalance, euint256 newSupply) = Nox.burn(
    _balances[from],
    amount,
    _totalSupply
);
Nox.allowThis(ok);
Nox.allowThis(newBalance);
Nox.allowThis(newSupply);
Nox.allow(newBalance, from);
_balances[from] = newBalance;
_totalSupply = newSupply;
```
