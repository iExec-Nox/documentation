---
title: Use Cases
description:
  Live demos and reference projects built with Nox, and the broader space of
  confidential applications you can build.
---

# Use Cases

Nox brings confidentiality to EVM smart contracts: encrypted balances, amounts,
and positions, processed inside Intel TDX TEEs without ever exposing plaintext
on-chain.

Below are live demos and reference projects, followed by the wider set of
applications you can build on the protocol.

## Demos & reference projects

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">

<UseCaseCard
  title="Confidential Vault: Encrypted Strategy"
  description="Keep the vault manager's strategy encrypted end to end: allocation weights, rebalancing triggers, and per-vault intents never hit the chain. Only aggregate net orders are public, while NAV, TVL, and APY stay visible for LPs."
  icon="ph:strategy"
  :features="['Encrypted intent', 'Cross-vault netting', 'Public NAV']"
  to="/getting-started/use-cases/confidential-vault-encrypted-strategy"
/>

<UseCaseCard
  title="Confidential Vault: Encrypted Positions"
  description="Encrypt LP balances and positions at the protocol level with Nox cTokens. The operator grants scoped read access on demand, so positions stay private while the vault remains verifiable on-chain."
  icon="ph:vault"
  :features="['ERC-7540', 'ERC-7984', 'Selective Disclosure']"
  to="/getting-started/use-cases/confidential-vault"
  demoUrl="http://cvault.demo.noxprotocol.io"
  githubUrl="https://github.com/iExec-Nox/nox-product-poc"
/>

<UseCaseCard
  title="Confidential Tokens (cToken)"
  description="Wrap public ERC-20s into their confidential equivalents (cUSDC, cRLC), transfer with encrypted amounts, and grant auditors selective disclosure, all from your browser on Arbitrum Sepolia."
  icon="ph:coins"
  :features="['ERC-7984', 'Wrap', 'Selective Disclosure']"
  to="/guides/build-confidential-tokens/demo"
  toLabel="Learn more"
  demoUrl="https://cdefi.iex.ec"
  githubUrl="https://github.com/iExec-Nox/demo-ctoken"
/>

<UseCaseCard
  title="DeFi Capital Allocator"
  description="Deploy treasury strategies across DeFi without broadcasting position size. Rebalance and unwind without market front-running, while keeping full on-chain auditability through selective disclosure."
  icon="ph:chart-line-up"
  :features="['DeFi', 'MEV protection', 'Treasury']"
  to="/getting-started/use-cases/defi-allocator"
/>

<UseCaseCard
  title="RWA Issuance & Distribution"
  description="Tokenize funds, private credit, or real estate with hidden investor allocations and confidential distributions, layering privacy on top of ERC-3643 compliance without breaking transfer rules."
  icon="ph:buildings"
  :features="['ERC-3643', 'Compliance', 'Tokenization']"
  to="/getting-started/use-cases/rwa"
/>

</div>

## What you can build with Nox

The same primitives apply well beyond these demos. you can build private
applications for:

<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 my-8 items-stretch">
  <div class="flex items-center gap-2.5 rounded-lg border border-border bg-soft-bg px-3 py-2.5">
    <Icon icon="ph:wallet" :height="20" class="text-primary2 shrink-0" />
    <span class="text-sm font-medium text-text1">Payments & Payroll</span>
  </div>
  <div class="flex items-center gap-2.5 rounded-lg border border-border bg-soft-bg px-3 py-2.5">
    <Icon icon="ph:hand-coins" :height="20" class="text-primary2 shrink-0" />
    <span class="text-sm font-medium text-text1">DeFi & Lending</span>
  </div>
  <div class="flex items-center gap-2.5 rounded-lg border border-border bg-soft-bg px-3 py-2.5">
    <Icon icon="ph:vault" :height="20" class="text-primary2 shrink-0" />
    <span class="text-sm font-medium text-text1">Vaults & Yields</span>
  </div>
  <div class="flex items-center gap-2.5 rounded-lg border border-border bg-soft-bg px-3 py-2.5">
    <Icon icon="ph:arrows-left-right" :height="20" class="text-primary2 shrink-0" />
    <span class="text-sm font-medium text-text1">OTC & Trading</span>
  </div>
  <div class="flex items-center gap-2.5 rounded-lg border border-border bg-soft-bg px-3 py-2.5">
    <Icon icon="ph:gavel" :height="20" class="text-primary2 shrink-0" />
    <span class="text-sm font-medium text-text1">Prediction Markets</span>
  </div>
  <div class="flex items-center gap-2.5 rounded-lg border border-border bg-soft-bg px-3 py-2.5">
    <Icon icon="ph:buildings" :height="20" class="text-primary2 shrink-0" />
    <span class="text-sm font-medium text-text1">RWA & Real Estate</span>
  </div>
  <div class="flex items-center gap-2.5 rounded-lg border border-border bg-soft-bg px-3 py-2.5">
    <Icon icon="ph:rocket-launch" :height="20" class="text-primary2 shrink-0" />
    <span class="text-sm font-medium text-text1">Fundraising / VC</span>
  </div>
  <div class="flex items-center gap-2.5 rounded-lg border border-border bg-soft-bg px-3 py-2.5">
    <Icon icon="ph:identification-card" :height="20" class="text-primary2 shrink-0" />
    <span class="text-sm font-medium text-text1">Identity</span>
  </div>
  <div class="flex items-center gap-2.5 rounded-lg border border-border bg-soft-bg px-3 py-2.5">
    <Icon icon="ph:image-square" :height="20" class="text-primary2 shrink-0" />
    <span class="text-sm font-medium text-text1">NFT</span>
  </div>
  <div class="flex items-center gap-2.5 rounded-lg border border-border bg-soft-bg px-3 py-2.5">
    <Icon icon="ph:receipt" :height="20" class="text-primary2 shrink-0" />
    <span class="text-sm font-medium text-text1">Invoicing</span>
  </div>
</div>

## Further reading

- [Confidential Tokens (ERC-7984)](/guides/build-confidential-tokens/intro)
- [Access Control](/guides/manage-handle-access/intro)
- [Architecture Overview](/protocol/global-architecture-overview)
