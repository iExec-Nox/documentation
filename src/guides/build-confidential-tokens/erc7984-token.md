---
title: ERC-7984 Token
description: Build a confidential fungible token with ERC-7984
---

# Create a Confidential ERC-7984 Token

This guide walks you through creating a confidential token using the `ERC7984`
base contract from `@iexec-nox/nox-confidential-contracts`. By the end you will
have a token with encrypted balances, private transfers, and owner-controlled
minting and burning.

## Prerequisites

- [Hardhat](/guides/build-confidential-smart-contracts/hardhat) or
  [Foundry](/guides/build-confidential-smart-contracts/foundry) project set up
  with Nox
- Solidity `^0.8.28`

## Installation

::: code-group

```sh [npm]
npm install @iexec-nox/nox-confidential-contracts
```

```sh [yarn]
yarn add @iexec-nox/nox-confidential-contracts
```

```sh [pnpm]
pnpm add @iexec-nox/nox-confidential-contracts
```

```sh [bun]
bun add @iexec-nox/nox-confidential-contracts
```

:::

This also installs `@iexec-nox/nox-protocol-contracts` and
`@openzeppelin/contracts` as dependencies.

## Write the contract

Start by inheriting from `ERC7984` and adding mint/burn functions restricted to
the owner:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Nox, euint256, externalEuint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";
import {ERC7984} from "@iexec-nox/nox-confidential-contracts/contracts/token/ERC7984.sol";

contract ConfidentialToken is ERC7984, Ownable {
    constructor()
        ERC7984("Confidential Token", "CTOK", "")
        Ownable(msg.sender)
    {}

    /// @notice Mint tokens to `to` with an encrypted amount
    function mint(
        address to,
        externalEuint256 encryptedAmount,
        bytes calldata inputProof
    ) external onlyOwner returns (euint256) {
        euint256 amount = Nox.fromExternal(encryptedAmount, inputProof);
        return _mint(to, amount);
    }

    /// @notice Burn tokens from `from` with an encrypted amount
    function burn(
        address from,
        externalEuint256 encryptedAmount,
        bytes calldata inputProof
    ) external onlyOwner returns (euint256) {
        euint256 amount = Nox.fromExternal(encryptedAmount, inputProof);
        return _burn(from, amount);
    }
}
```

That's it. The `ERC7984` base contract handles everything else: encrypted
balances, transfers, operators, callbacks, and access control on handles.

## What happens under the hood

### Constructor

`ERC7984("Confidential Token", "CTOK", "")` sets the token name, symbol, and an
optional `contractURI` (see
[ERC-7572](https://eips.ethereum.org/EIPS/eip-7572)).

The total supply and all balances start uninitialized. The first `_mint` call
sets the total supply to the minted amount.

### `_mint`

When you call `_mint(to, amount)`, the base contract:

1. Safely adds `amount` to the total supply using `Nox.safeAdd()`. If it would
   overflow, zero tokens are minted (all-or-nothing)
2. Adds `amount` to the recipient's balance
3. Grants handle permissions so the contract can reuse the balance
   (`Nox.allowThis`) and the recipient can decrypt it (`Nox.allow`)
4. Emits a `ConfidentialTransfer(address(0), to, amount)` event

### `_burn`

When you call `_burn(from, amount)`, the base contract:

1. Safely subtracts `amount` from the sender's balance using `Nox.safeSub()`. If
   `amount > balance`, zero tokens are burned
2. Subtracts the actually burned amount from the total supply
3. Updates handle permissions
4. Emits a `ConfidentialTransfer(from, address(0), amount)` event

### Transfers

Users call `confidentialTransfer` to send tokens. The amount is encrypted, so
nobody watching the blockchain can see how much was sent:

```solidity
// User encrypts the amount off-chain using the JS SDK,
// then calls the contract with the handle and proof
token.confidentialTransfer(
    recipientAddress,
    encryptedAmount,
    inputProof
);
```

Internally, the base contract:

1. Subtracts from the sender's balance with `Nox.safeSub()`, if the sender does
   not have enough tokens, zero tokens are transferred (no revert, no leak)
2. Adds the actually transferred amount to the recipient's balance
3. Grants permissions to both parties
4. Returns the actually transferred amount (encrypted)

## Operators

ERC-7984 replaces ERC-20 allowances with time-bound operators. An operator can
transfer any amount on behalf of the holder until a given timestamp:

```solidity
// Grant operator access until a specific timestamp
token.setOperator(spenderAddress, uint48(block.timestamp + 1 hours));

// Operator calls transferFrom
token.confidentialTransferFrom(
    holderAddress,
    recipientAddress,
    encryptedAmount,
    inputProof
);
```

<!-- prettier-ignore -->
::: warning
Setting an operator grants full access to all tokens until the timestamp
expires. There is no amount limit. Only set operators you trust completely.
:::

To revoke an operator, set the timestamp to `0`:

```solidity
token.setOperator(spenderAddress, 0);
```

## Receiving tokens in a contract

Smart contracts that want to react to incoming ERC-7984 transfers should
implement the `IERC7984Receiver` interface:

```solidity
import {ebool, euint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";
import {IERC7984Receiver} from "@iexec-nox/nox-confidential-contracts/contracts/interfaces/IERC7984Receiver.sol";

contract Vault is IERC7984Receiver {
    function onConfidentialTransferReceived(
        address operator,
        address from,
        euint256 amount,
        bytes calldata data
    ) external returns (ebool) {
        // Process the incoming transfer...
        // Return encrypted true to accept, false to refund
        return Nox.toEbool(true);
    }
}
```

When a user calls `confidentialTransferAndCall`, the token contract transfers
first, then calls the hook on the recipient. If the hook returns encrypted
`false`, the transfer is automatically reversed.

## View functions

| Function                         | Returns    | Description                                           |
| -------------------------------- | ---------- | ----------------------------------------------------- |
| `name()`                         | `string`   | Token name                                            |
| `symbol()`                       | `string`   | Token symbol                                          |
| `decimals()`                     | `uint8`    | Decimals (default: 18)                                |
| `confidentialTotalSupply()`      | `euint256` | Encrypted total supply                                |
| `confidentialBalanceOf(account)` | `euint256` | Encrypted balance (decrypt with JS SDK if authorized) |
| `isOperator(holder, spender)`    | `bool`     | Whether spender is an active operator                 |

## Transfer functions

ERC-7984 provides 8 transfer variants combining these options:

| Variant                           | Who sends | Proof needed         | Callback |
| --------------------------------- | --------- | -------------------- | -------- |
| `confidentialTransfer`            | Caller    | Yes (external input) | No       |
| `confidentialTransfer`            | Caller    | No (pre-allowed)     | No       |
| `confidentialTransferFrom`        | Operator  | Yes (external input) | No       |
| `confidentialTransferFrom`        | Operator  | No (pre-allowed)     | No       |
| `confidentialTransferAndCall`     | Caller    | Yes (external input) | Yes      |
| `confidentialTransferAndCall`     | Caller    | No (pre-allowed)     | Yes      |
| `confidentialTransferFromAndCall` | Operator  | Yes (external input) | Yes      |
| `confidentialTransferFromAndCall` | Operator  | No (pre-allowed)     | Yes      |

The "no proof" variants are used when the caller already has ACL access to the
encrypted amount handle (e.g. the handle was returned by a previous operation
and the caller was granted access).

## Customizing behavior

The `_update` function is the single entry point for all balance changes (mint,
burn, transfer). Override it to add custom logic:

```solidity
function _update(
    address from,
    address to,
    euint256 amount
) internal override returns (euint256 transferred) {
    // Custom logic before update...

    transferred = super._update(from, to, amount);

    // Custom logic after update...
}
```

## Next steps

- [ERC-20 to ERC-7984](/guides/build-confidential-tokens/erc7984erc20wrapper):
  wrap existing ERC-20 tokens
- [Solidity Library](/references/solidity-library/getting-started): all Nox
  operations
- [JS SDK](/references/js-sdk): encrypt inputs and decrypt balances from
  JavaScript
