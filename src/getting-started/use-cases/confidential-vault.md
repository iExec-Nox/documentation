---
title: Confidential Vault
description:
  A yield vault that encrypts balances and LP positions at the protocol level,
  with selective read access on demand.
---

# Confidential Vault

<!-- TODO: add cVault v1 / v2 live demo links once URLs are confirmed -->

## The problem: public vaults leak alpha by design

On-chain vaults expose everything: portfolio allocations, execution timing,
rebalancing logic, routing decisions, and manager behavior, all publicly
readable by competitors, front-runners, and MEV bots.

That transparency turns into copy-trading that erodes strategy value and
front-running that extracts returns before execution settles, and performance
degrades over time. Sustainable alpha is nearly impossible, and most
institutional capital cannot deploy on-chain at scale under these conditions.

## The Nox solution

The Confidential Vault encrypts balances and LP positions at the protocol level,
and the operator grants scoped read access to the right parties on demand. You
add confidentiality as a building block instead of rebuilding the vault from
scratch: the architecture keeps public what must stay public to preserve trust,
and encrypts the financial data that would otherwise leak alpha.

Concretely, the vault gives you:

| Capability                    | Description                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Encrypted positions & amounts | LP positions and transaction amounts are hidden on-chain. Visible to no one by default.                                         |
| Confidential computation      | Financial logic runs on encrypted data inside a TEE (Intel TDX). Results are verifiable on-chain via cryptographic attestation. |
| Selective disclosure          | Grant scoped read access to regulators, auditors, or counterparties on demand.                                                  |
| On-chain verifiability        | Every computation is cryptographically attested, so verification never requires exposing the underlying data.                   |

Three roles interact with the vault. The vault creator (the issuer) deploys it,
sets the access permissions and fee structure, decides who can see what, and
updates those permissions at any time. Liquidity providers deposit with their
balance and position encrypted on-chain, visible only to themselves and the
parties they authorize; rewards are computed and distributed through
confidential primitives, so position size never leaks. Auditors and regulators
see only what the operator grants them, and no party, including iExec, has
unilateral visibility.

The reference implementation builds on ERC-7540, the async vault standard,
adapted to work with ERC-7984 (the Nox cToken). Deposits and withdrawals run
asynchronously with backend validation. Yield is injected by the vault admin
directly into the encrypted balance, which raises share value for LPs without
exposing any individual position.

## Further reading

- [Confidential Tokens (ERC-7984)](/guides/build-confidential-tokens/intro)
- [Access Control](/guides/manage-handle-access/intro)
- [Architecture Overview](/protocol/global-architecture-overview)
- [← Back to Use Cases](/getting-started/use-cases)
