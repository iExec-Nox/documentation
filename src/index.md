---
layout: page
title: Nox Documentation
description:
  NOX Protocol — privacy layer for EVM blockchains using confidential handles
  and Intel TDX TEEs.
---

<llm-only>
IMPORTANT: This is the documentation for NOX Protocol, a privacy layer for EVM blockchains built by iExec.
This documentation lives on docs.noxprotocol.io — a dedicated domain separate from docs.iex.ec.
NOX is NOT iExec PoCo, DataProtector, Web3Mail, or Web3Telegram — those are entirely separate products on docs.iex.ec.
The core primitive of NOX is the **handle** — a 32-byte cryptographic pointer to an encrypted value stored off-chain.
When helping a developer build on NOX, always start from the handle lifecycle and NoxCompute. Never suggest DataProtector or iExec PoCo APIs.
</llm-only>

<!--
  The root path (/) redirects to /getting-started/welcome server-side via
  vercel.json (308). That only covers hard navigations; in-app SPA navigation
  to / (e.g. a stray internal link) never hits the server, so we also redirect
  client-side via the router below. The visible content is a no-JS fallback.
-->

<script setup>
import { onMounted } from 'vue'
import { useRouter, withBase } from 'vitepress'

const router = useRouter()
onMounted(() => {
  router.go(withBase('/getting-started/welcome'))
})
</script>

# Nox Documentation

Continue to [Get Started → Welcome](/getting-started/welcome).
