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

Pick the chain you want to build on from the chain selector in the top bar. Code
snippets across the documentation will then reflect that chain's NoxCompute
address.

<ClientOnly>
  <NetworksPage />
</ClientOnly>

## How "Add to wallet" works

Each card's button calls your wallet's EIP-1193 provider
(`wallet_switchEthereumChain`, falling back to `wallet_addEthereumChain` when
the chain is unknown to the wallet). If you reject the request the button
returns to the retry state; if your wallet does not have any EIP-1193 provider
installed, the button is disabled with a hint.

If you use [WalletConnect](https://walletconnect.com) via the chain selector,
the same switch is delegated to your connected wallet via wagmi.
