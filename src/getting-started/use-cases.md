---
title: Use Cases
description: Real-world applications and use cases for Nox
---

# Use Cases

NOX is a confidential computing protocol for EVM ecosystems. It enables smart contracts to handle encrypted data — balances, amounts, positions — without exposing that data on-chain, while remaining composable with standard DeFi infrastructure.

This page covers the main use cases for which NOX provides a native solution.

---

## DeFi Capital Allocators

### The problem: transparency destroys competitive advantage

Professional capital allocators — hedge funds, DAOs, family offices, institutional treasuries — face a structural problem when deploying strategies on-chain: every move is visible before execution completes.

When a fund moves $50M into a yield strategy, the market front-runs the position. When it unwinds exposure, sophisticated bots extract value through sandwich attacks or by fading the strategy. At scale, on-chain transparency becomes a liability rather than an asset.

### The NOX solution

By wrapping treasury assets into Confidential Tokens ([cERC-20 / ERC-7984](/guides/build-confidential-tokens/intro)), allocators gain selective privacy without sacrificing DeFi composability. Balances and transaction amounts remain encrypted on-chain, readable only by the token holder and explicitly authorized parties.

This allows funds to:

- Deploy capital across DeFi protocols (lending, LP positions, derivatives) without broadcasting position size
- Execute rebalancing and unwinding without market front-running
- Maintain full on-chain verifiability and audit trails through selective disclosure to auditors, LPs, or compliance officers
- Preserve alpha by controlling exactly who sees what and when

The protocol enables privacy where it matters (strategy protection, execution quality) while maintaining transparency where it is required (regulatory reporting, investor updates).

---

## Confidential Vault

### The problem: public vaults leak alpha by design

On-chain vaults expose everything: portfolio allocations, execution timing, rebalancing logic, routing decisions, manager behavior — all publicly readable by competitors, front-runners, and MEV bots.

The result is copy-trading that erodes strategy value, front-running attacks that extract returns before execution settles, and degraded performance over time. Sustainable alpha is nearly impossible. Most institutional capital cannot deploy on-chain at scale under these conditions.

### The NOX solution

The Confidential Vault encrypts balances and LP positions at the protocol level, while allowing the vault operator to grant scoped read access to the right parties on demand.

Confidentiality becomes a building block, not a ground-up rebuild. The architecture separates what must be public (to preserve trust) from what must stay confidential (to protect alpha).

**What it enables:**

| Capability | Description |
|---|---|
| Encrypted positions & amounts | LP positions and transaction amounts are hidden on-chain. Visible to no one by default. |
| Confidential computation | Financial logic runs on encrypted data inside a TEE (Intel TDX). Results are verifiable on-chain via cryptographic attestation. |
| Selective disclosure | Grant and revoke read access to regulators, auditors, or counterparties on demand. Scoped, permissioned, revocable. |
| On-chain verifiability | Every computation is cryptographically attested. Privacy where it matters, transparency where it's required. |

**Actors:**

- **Vault Creator (Issuer):** Deploys the vault, configures access permissions and fee structure. Decides who can see what, and updates those permissions at any time.
- **LP (Liquidity Provider):** Deposits liquidity with balance and position encrypted on-chain. Exposure is visible only to themselves and explicitly authorized parties. Rewards are computed and distributed via confidential primitives — position size never leaks.
- **Auditor / Regulator:** Granted selective read access by the vault operator. Sees exactly what they need, nothing more. No party, including iExec, has unilateral visibility.

**Technical stack (reference implementation):**
- ERC-7540 (async vault standard) adapted to work with ERC-7984 (NOX cToken)
- Asynchronous deposit/withdrawal flow with backend validation
- Yield injection: the vault admin injects tokens directly into the encrypted balance, increasing share value for LPs without exposing individual positions

---

## RWA Issuance & Distribution

### The problem: investor privacy is non-negotiable

Real-world asset tokenization promises to bring trillions of dollars of traditional finance on-chain. But issuers of tokenized funds, private credit, real estate, or structured products face a hard constraint: investor confidentiality is standard practice in traditional finance and expected by institutional investors.

On public blockchains, every token balance and transfer is a matter of public record. This makes many RWA products institutionally unviable:

- Investor allocations are publicly visible → competitive intelligence leak
- Redemption flows are trackable → distress signals
- LP identities can be inferred → investor poaching

### The NOX solution

NOX enables privacy-first tokenized securities that mirror traditional finance confidentiality while preserving blockchain's operational benefits.

**Four properties NOX brings to RWA:**

1. **Hidden Allocations** — Investor balances remain encrypted. No one can see who holds how much of a tokenized fund or credit instrument.
2. **Confidential Distributions** — Dividend payments, interest accruals, and redemptions occur without publicly broadcasting amounts.
3. **Selective Regulatory Disclosure** — The issuer can grant read access to regulators, auditors, or compliance partners without making that data globally public.
4. **Composable Privacy** — Tokens remain usable in DeFi infrastructure (custody, settlement rails, secondary markets) despite encrypted balances.

**Reference stack for a confidential private credit fund:**

```
Application Layer       →  Fund Manager UI
Vault Layer             →  ERC-7540 (async vault, request/claim flow)
Compliance Layer        →  ERC-3643 (identity registry + transfer rules)
Token Layer             →  ERC-7984 (cToken for fund shares)
Confidentiality Layer   →  NOX (handles, TEE compute, ACL, selective disclosure)
```

### ERC-3643 integration

[ERC-3643](https://erc3643.org/) is the leading standard for compliant security tokens, with over $32B in assets tokenized on it. It embeds KYC/AML checks and transfer restrictions directly into smart contracts via the ONCHAINID identity layer.

ERC-3643 solves **who** can hold tokens. It does not solve the visibility problem: all balances and amounts remain public. For institutional investors in tokenized securities — private equity, venture funds, structured credit — this creates the same privacy deficit as standard ERC-20 tokens.

**How NOX fills the gap:**

NOX layers privacy on top of ERC-3643's compliance framework. ERC-3643 identity and transfer validation rules remain fully enforced. The compliance layer sees what it needs (identity verification, transfer eligibility). Financial data stays private.

- **Confidential Balances with Compliant Transfers** — ERC-3643 compliance logic runs as normal; balances and transaction amounts are encrypted.
- **Selective Disclosure for Regulators** — Issuers can grant auditors or regulators decryption access to specific data fields without making that information globally public.
- **Composability with Existing Infrastructure** — Confidential ERC-3643 tokens integrate with existing custody, settlement, and secondary trading platforms. No protocol rewrite required.

---

## Further reading

- [Confidential Tokens (ERC-7984)](/guides/build-confidential-tokens/intro)
- [Access Control](/guides/manage-handle-access/intro)
- [Architecture Overview](/protocol/global-architecture-overview)
