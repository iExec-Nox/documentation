---
title: ERC-20 to ERC-7984 Wrapper
description: Wrap existing ERC-20 tokens into confidential ERC-7984 tokens
---

# Wrap ERC-20 into Confidential ERC-7984

<!-- prettier-ignore -->
::: info Coming Soon
This guide is under active development. The ERC-20 to ERC-7984 wrapper contract
will be available in an upcoming release of `@iexec-nox/nox-confidential-contracts`.
:::

## What it will do

An ERC-7984 wrapper lets users convert existing ERC-20 tokens into confidential
ERC-7984 tokens and back:

- **Wrap**: deposit ERC-20 tokens into the wrapper contract, receive an
  equivalent amount of confidential ERC-7984 tokens with encrypted balances
- **Unwrap**: burn confidential ERC-7984 tokens, receive the underlying ERC-20
  tokens back in plaintext

This enables any existing ERC-20 token to gain confidentiality without modifying
the original contract.

## How it works

```mermaid
sequenceDiagram
    participant User
    participant Wrapper as ERC7984Wrapper
    participant ERC20 as ERC-20 Token

    Note over User,ERC20: Wrap (ERC-20 → ERC-7984)
    User->>ERC20: approve(wrapper, amount)
    User->>Wrapper: wrap(amount)
    Wrapper->>ERC20: transferFrom(user, wrapper, amount)
    Wrapper->>Wrapper: _mint(user, encryptedAmount)

    Note over User,ERC20: Unwrap (ERC-7984 → ERC-20)
    User->>Wrapper: unwrap(encryptedAmount, proof)
    Wrapper->>Wrapper: _burn(user, encryptedAmount)
    Wrapper->>ERC20: transfer(user, decryptedAmount)
```

## Next steps

- [ERC-7984 Token](/guides/build-confidential-tokens/erc7984-token): create a
  native confidential token
- [Demo](/guides/build-confidential-tokens/swap): confidential token swap
  application
