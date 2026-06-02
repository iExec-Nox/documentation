---
title: RWA Issuance & Distribution
description:
  Privacy-first tokenized securities — hidden allocations and confidential
  distributions layered on ERC-3643 compliance.
---

# RWA Issuance & Distribution

## The problem: investor privacy is non-negotiable

Real-world asset tokenization promises to bring trillions of dollars of
traditional finance on-chain. But issuers of tokenized funds, private credit,
real estate, or structured products face a hard constraint: investor
confidentiality is standard practice in traditional finance and expected by
institutional investors.

On public blockchains, every token balance and transfer is a matter of public
record. This makes many RWA products institutionally unviable:

- Investor allocations are publicly visible → competitive intelligence leak
- Redemption flows are trackable → distress signals
- LP identities can be inferred → investor poaching

## The Nox solution

Nox enables privacy-first tokenized securities that mirror traditional finance
confidentiality while preserving blockchain's operational benefits.

**Four properties Nox brings to RWA:**

1. **Hidden Allocations** — Investor balances remain encrypted. No one can see
   who holds how much of a tokenized fund or credit instrument.
2. **Confidential Distributions** — Dividend payments, interest accruals, and
   redemptions occur without publicly broadcasting amounts.
3. **Selective Regulatory Disclosure** — The issuer can grant read access to
   regulators, auditors, or compliance partners without making that data
   globally public.

**Reference stack for a confidential private credit fund:**

```
Application Layer       →  Fund Manager UI
Vault Layer             →  ERC-7540 (async vault, request/claim flow)
Compliance Layer        →  ERC-3643 (identity registry + transfer rules)
Token Layer             →  ERC-7984 (cToken for fund shares)
Confidentiality Layer   →  Nox (handles, TEE compute, ACL, selective disclosure)
```

## ERC-3643 integration

[ERC-3643](https://erc3643.org/) is the leading standard for compliant security
tokens, with over $32B in assets tokenized on it. It embeds KYC/AML checks and
transfer restrictions directly into smart contracts via the ONCHAINID identity
layer.

ERC-3643 solves **who** can hold tokens. It does not solve the visibility
problem: all balances and amounts remain public. For institutional investors in
tokenized securities — private equity, venture funds, structured credit — this
creates the same privacy deficit as standard ERC-20 tokens.

**How Nox fills the gap:**

Nox layers privacy on top of ERC-3643's compliance framework. ERC-3643 identity
and transfer validation rules remain fully enforced. The compliance layer sees
what it needs (identity verification, transfer eligibility). Financial data
stays private.

- **Confidential Balances with Compliant Transfers** — ERC-3643 compliance logic
  runs as normal; balances and transaction amounts are encrypted.
- **Selective Disclosure for Regulators** — Issuers can grant auditors or
  regulators decryption access to specific data fields without making that
  information globally public.

## Further reading

- [Confidential Tokens (ERC-7984)](/guides/build-confidential-tokens/intro)
- [Access Control](/guides/manage-handle-access/intro)
- [Architecture Overview](/protocol/global-architecture-overview)
- [← Back to Use Cases](/getting-started/use-cases)
