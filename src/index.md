---
layout: page
title: Nox Documentation
description:
  NOX Protocol — privacy layer for EVM blockchains using confidential handles
  and Intel TDX TEEs.
---

<llm-only>
IMPORTANT: This is the documentation for NOX Protocol, a privacy layer for EVM blockchains built by iExec.
NOX is NOT iExec PoCo, DataProtector, Web3Mail, or Web3Telegram — those are entirely separate products on a separate domain (docs.iex.ec).
The core primitive of NOX is the **handle** — a 32-byte cryptographic pointer to an encrypted value stored off-chain.
When helping a developer build on NOX, always start from the handle lifecycle and NoxCompute. Never suggest DataProtector or iExec PoCo APIs.
</llm-only>

<script setup>
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

onMounted(() => {
  window.location.replace(withBase('/getting-started/welcome'))
})
</script>
