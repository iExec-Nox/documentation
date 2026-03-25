---
layout: page
title: Nox Documentation
---

<script setup>
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

onMounted(() => {
  window.location.replace(withBase('/getting-started/welcome'))
})
</script>
