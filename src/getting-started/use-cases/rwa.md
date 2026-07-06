---
title: RWA Issuance & Distribution
description:
  Privacy-first tokenized securities with hidden allocations and confidential
  distributions, layered on ERC-3643 compliance.
---

# RWA Issuance & Distribution

## The problem: investor privacy is non-negotiable

Real-world asset tokenization promises to bring trillions of dollars of
traditional finance on-chain. But issuers of tokenized funds, private credit,
real estate, or structured products face a hard constraint: investor
confidentiality is standard practice in traditional finance and expected by
institutional investors.

On a public blockchain, every token balance and transfer is a matter of public
record, which makes many RWA products institutionally unviable:

- Investor allocations are publicly visible → competitive intelligence leak
- Redemption flows are trackable → distress signals
- LP identities can be inferred → investor poaching

## The Nox solution

Nox brings traditional-finance confidentiality to tokenized securities while
preserving the operational benefits of a public chain. Investor balances stay
encrypted, so no one can see who holds how much of a fund or credit instrument.
Dividend payments, interest accruals, and redemptions settle without
broadcasting amounts. And the issuer can grant read access to regulators,
auditors, or compliance partners without making that data public.

A confidential private credit fund stacks these layers:

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
transfer restrictions directly into smart contracts through the ONCHAINID
identity layer.

ERC-3643 solves _who_ can hold tokens. It does not solve the visibility problem:
all balances and amounts remain public. For institutional investors in tokenized
securities (private equity, venture funds, structured credit), that is the same
privacy deficit as a standard ERC-20 token.

Nox layers privacy on top of that compliance framework without weakening it. The
identity and transfer-validation rules stay fully enforced, so the compliance
layer still sees identity verification and transfer eligibility while balances
and transaction amounts are encrypted. Issuers can also grant auditors or
regulators decryption access to specific fields without making that information
public.

## Further reading

- [Confidential Tokens (ERC-7984)](/guides/build-confidential-tokens/intro)
- [Access Control](/guides/manage-handle-access/intro)
- [Architecture Overview](/protocol/global-architecture-overview)
- [← Back to Use Cases](/getting-started/use-cases)
