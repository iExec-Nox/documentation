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
rebalancing logic, routing decisions, manager behavior — all publicly readable
by competitors, front-runners, and MEV bots.

The result is copy-trading that erodes strategy value, front-running attacks
that extract returns before execution settles, and degraded performance over
time. Sustainable alpha is nearly impossible. Most institutional capital cannot
deploy on-chain at scale under these conditions.

## The Nox solution

The Confidential Vault encrypts balances and LP positions at the protocol level,
while allowing the vault operator to grant scoped read access to the right
parties on demand.

Confidentiality becomes a building block, not a ground-up rebuild. The
architecture separates what must be public (to preserve trust) from what must
stay confidential (to protect alpha).

**What it enables:**

| Capability                    | Description                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Encrypted positions & amounts | LP positions and transaction amounts are hidden on-chain. Visible to no one by default.                                         |
| Confidential computation      | Financial logic runs on encrypted data inside a TEE (Intel TDX). Results are verifiable on-chain via cryptographic attestation. |
| Selective disclosure          | Grant scoped read access to regulators, auditors, or counterparties on demand.                                                  |
| On-chain verifiability        | Every computation is cryptographically attested. Privacy where it matters, transparency where it's required.                    |

**Actors:**

- **Vault Creator (Issuer):** Deploys the vault, configures access permissions
  and fee structure. Decides who can see what, and updates those permissions at
  any time.
- **LP (Liquidity Provider):** Deposits liquidity with balance and position
  encrypted on-chain. Exposure is visible only to themselves and explicitly
  authorized parties. Rewards are computed and distributed via confidential
  primitives — position size never leaks.
- **Auditor / Regulator:** Granted selective read access by the vault operator.
  Sees exactly what they need, nothing more. No party, including iExec, has
  unilateral visibility.

**Technical stack (reference implementation):**

- ERC-7540 (async vault standard) adapted to work with ERC-7984 (Nox cToken)
- Asynchronous deposit/withdrawal flow with backend validation
- Yield injection: the vault admin injects tokens directly into the encrypted
  balance, increasing share value for LPs without exposing individual positions

## Further reading

- [Confidential Tokens (ERC-7984)](/guides/build-confidential-tokens/intro)
- [Access Control](/guides/manage-handle-access/intro)
- [Architecture Overview](/protocol/global-architecture-overview)
- [← Back to Use Cases](/getting-started/use-cases)
