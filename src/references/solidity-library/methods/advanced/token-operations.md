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

### Usage

```solidity
// Confidential ERC-20 transfer
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
