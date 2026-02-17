---
title: Solidity Library
description:
  Nox Solidity library for building confidential smart contracts with encrypted
  types and TEE-backed computation
---

# Solidity Library

The `Nox` library is the developer-facing Solidity SDK for building confidential
smart contracts. It provides type-safe wrappers around encrypted values, handles
proof validation, manages access control, and triggers off-chain TEE
computation, all through a single `import`.

## Quick Overview

```solidity
import {Nox} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";
import "encrypted-types/EncryptedTypes.sol";

contract ConfidentialVault {
    mapping(address => euint256) private _balances;

    function deposit(externalEuint256 encryptedAmount, bytes calldata proof) external {
        euint256 amount = Nox.fromExternal(encryptedAmount, proof);
        euint256 balance = _balances[msg.sender];

        if (!Nox.isInitialized(balance)) {
            balance = Nox.toEuint256(0);
            Nox.allowThis(balance);
        }

        euint256 newBalance = Nox.add(balance, amount);
        Nox.allowThis(newBalance);
        Nox.allow(newBalance, msg.sender);
        _balances[msg.sender] = newBalance;
    }
}
```

## What the Library Does

- **Encrypted types**: `euint256`, `ebool`, `eaddress`, `eint16`, etc.,
  user-defined value types backed by `bytes32` handles
- **Trivial encryption**: convert plaintext values to encrypted handles on-chain
  (`toEuint256`, `toEbool`, ...)
- **Proof validation**: verify handles submitted by users via the SDK
  (`fromExternal`)
- **Arithmetic**: `add`, `sub`, `mul`, `div` with wrapping semantics, plus safe
  variants with overflow detection
- **Comparisons**: `eq`, `ne`, `lt`, `le`, `gt`, `ge` returning `ebool`
- **Conditional logic**: `select` for encrypted branching
- **Token operations**: `transfer`, `mint`, `burn` with all-or-nothing semantics
- **Access control**: `allow`, `allowThis`, `allowTransient`, `addViewer`,
  `allowPublicDecryption`

## Next Steps

- [Getting Started](/references/solidity-library/getting-started): installation
  and project setup

### Methods

- [Trivial Encryption](/references/solidity-library/methods/trivial-encryption):
  convert plaintext values to encrypted handles
- [fromExternal](/references/solidity-library/methods/fromExternal): validate
  user-submitted handles with EIP-712 proofs
- [Arithmetic](/references/solidity-library/methods/arithmetic): `add`, `sub`,
  `mul`, `div` with wrapping semantics
- [Safe Arithmetic](/references/solidity-library/methods/safe-arithmetic):
  `safeAdd`, `safeSub`, `safeMul`, `safeDiv` with overflow detection
- [Comparisons](/references/solidity-library/methods/comparisons): `eq`, `ne`,
  `lt`, `le`, `gt`, `ge` returning `ebool`
- [select](/references/solidity-library/methods/select): encrypted conditional
  branching
- [Token Operations](/references/solidity-library/methods/token-operations):
  `transfer`, `mint`, `burn` with all-or-nothing semantics
- [Access Control](/references/solidity-library/methods/access-control):
  `allow`, `allowThis`, `addViewer`, `allowPublicDecryption` and more
