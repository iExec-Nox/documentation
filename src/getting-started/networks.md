---
title: Networks
description:
  Supported chains, NoxCompute contract addresses, RPCs, explorers and faucets.
---

<script setup>
import NetworksPage from '../components/NetworksPage.vue';
</script>

# Networks

Nox runs on several testnets. This page lists every supported chain with the
data you need to wire your dApp end-to-end: the NoxCompute contract address, the
canonical RPC URL, the block explorer, faucet links for test funds, and a
one-click _Add to wallet_ action.

Code snippets across the documentation default to **Ethereum Sepolia** and show
the Arbitrum Sepolia alternative in a comment, so you can adapt them to
whichever network below you target.

<ClientOnly>
  <NetworksPage />
</ClientOnly>

## How "Add to wallet" works

Each card's button calls your wallet's EIP-1193 provider
(`wallet_switchEthereumChain`, falling back to `wallet_addEthereumChain` when
the chain is unknown to the wallet). If you reject the request the button
returns to the retry state; if your wallet does not have any EIP-1193 provider
installed, the button is disabled with a hint.
