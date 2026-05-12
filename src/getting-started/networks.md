---
title: Networks & Faucets
description:
  Supported networks, contract addresses, RPC endpoints, and curated faucets for
  running Nox.
---

<script setup>
import { getLiveChains, getComingSoonChains, getPrimaryChain } from '@/data/chains';

const liveChains = getLiveChains();
const comingSoonChains = getComingSoonChains();
const primary = getPrimaryChain();

const liveCount = liveChains.length;
const soonCount = comingSoonChains.length;
const livePart =
  liveCount === 0
    ? 'No live networks yet'
    : liveCount === 1
      ? `Nox is live on ${liveChains[0].name}${liveChains[0].isTestnet ? ' testnet' : ''}`
      : `Nox is live on ${liveCount} networks`;
const introLine = `${livePart}${soonCount > 0 ? `, with ${soonCount} more coming soon` : ''}.`;

const sortedFaucets = primary
  ? [...primary.faucets].sort(
      (a, b) => Number(b.recommended ?? false) - Number(a.recommended ?? false)
    )
  : [];
</script>

# Networks & Faucets

<p class="networks-intro">{{ introLine }}</p>

This page is the single source of truth for chain details — chain ID, contract
address, RPC endpoint, block explorer, currency — and for curated faucets that
actually distribute the right network's tokens.

## Supported networks

<div v-if="liveChains.length === 0" class="networks-empty">No live networks yet.</div>

<NetworkCard v-for="chain in liveChains" :key="chain.id" :chain="chain" />

## Get testnet ETH

<div v-for="(warning, i) in (primary?.faucetWarnings ?? [])" :key="i" class="custom-block warning">
  <p class="custom-block-title">⚠️ Faucet warning</p>
  <p>{{ warning }}</p>
</div>

<p v-if="sortedFaucets.length > 0">
  Use one of the following faucets — recommended first:
</p>

<ul v-if="sortedFaucets.length > 0" class="faucet-list">
  <li v-for="faucet in sortedFaucets" :key="faucet.url">
    <div class="faucet-list__line">
      <a :href="faucet.url" target="_blank" rel="noopener">{{ faucet.name }}</a>
      <span v-if="faucet.recommended" class="faucet-list__badge">recommended</span>
    </div>
    <p v-if="faucet.note" class="faucet-list__note">{{ faucet.note }}</p>
  </li>
</ul>

<div v-if="primary?.bridge">
  <h3>Bridge fallback</h3>
  <p>
    If faucets are dry, you can bridge ETH Sepolia tokens to {{ primary.name }}
    via the
    <a :href="primary.bridge.url" target="_blank" rel="noopener">{{ primary.bridge.name }}</a>.
  </p>
</div>

## Coming soon

<div v-if="comingSoonChains.length === 0" class="networks-empty">
  No additional networks are announced yet.
</div>

<div v-for="chain in comingSoonChains" :key="chain.id" class="networks-soon">
  <h3>{{ chain.name }} <span class="networks-soon__badge">coming soon</span></h3>
</div>

## Add the network to your wallet

Most EIP-1193 wallets (MetaMask, Rabby, Frame, Coinbase Wallet, Brave Wallet…)
let you add a custom EVM network manually. The exact menu wording differs from
one wallet to the next, but the input fields are the same:

1. Open your wallet's network selector and choose <em>Add network</em> (or
   <em>Add custom network</em> / <em>Add a network manually</em>, depending on
   the wallet).
2. Fill in the values from the [Supported networks](#supported-networks)
   section above:
   - <strong>Network name</strong>
   - <strong>RPC URL</strong>
   - <strong>Chain ID</strong>
   - <strong>Currency symbol</strong>
   - <strong>Block explorer URL</strong>
3. Save, then select the new network from the dropdown so your wallet signs
   transactions on it.

Mobile wallets typically expose the same form under <em>Settings → Networks</em>.
If your wallet does not support custom networks, switch to one that does
before continuing.

<style scoped>
.networks-intro {
  font-size: 1.05rem;
  color: var(--vp-c-text-2);
}

.networks-empty {
  padding: 12px 16px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.networks-soon {
  margin: 12px 0;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  opacity: 0.85;
}

.networks-soon__badge {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.75rem;
  font-weight: 600;
  vertical-align: middle;
}

.faucet-list {
  list-style: disc;
  padding-left: 1.4rem;
}

.faucet-list li {
  margin: 8px 0;
}

.faucet-list__line {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.faucet-list__badge {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.72rem;
  font-weight: 600;
}

.faucet-list__note {
  margin: 2px 0 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>
