<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { getPrimaryChain } from '@/data/chains';

const networksHref = withBase('/getting-started/networks');

const chainNotice = computed(() => {
  const primary = getPrimaryChain();
  if (!primary) return 'see Networks & Faucets for supported chains';
  const network = primary.isTestnet ? `${primary.name} testnet` : primary.name;
  return `Nox runs on ${network} only`;
});
</script>

<template>
  <div class="dev-banner">
    <span class="dev-banner__icon">🚧</span>
    <span class="dev-banner__text">
      Documentation under development —
      <strong>{{ chainNotice }}</strong>
      ·
      <a :href="networksHref" class="dev-banner__link"
        >Networks &amp; faucets</a
      >
    </span>
    <span class="dev-banner__icon">🚧</span>
  </div>
</template>

<style>
:root {
  --vp-layout-top-height: 36px;
}
</style>

<style scoped>
.dev-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--vp-z-index-layout-top, 40);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 36px;
  padding: 0 16px;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #1a1040 100%);
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  line-height: 1;
}

.dev-banner__icon {
  flex-shrink: 0;
  font-size: 12px;
  opacity: 0.7;
}

.dev-banner__text {
  flex: 1;
  max-width: 720px;
  letter-spacing: 0.01em;
}

.dev-banner__link {
  color: #ffd24a;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.dev-banner__link:hover {
  color: #fff;
}
</style>
