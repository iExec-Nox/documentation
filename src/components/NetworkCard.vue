<script setup lang="ts">
import type { Chain } from '@/data/chains';

defineProps<{ chain: Chain }>();
</script>

<template>
  <div class="network-card">
    <div class="header">
      <span class="header-title">{{ chain.name }}</span>
      <span v-if="chain.isTestnet" class="header-badge">testnet</span>
    </div>

    <div class="result-card">
      <div class="result-item">
        <div class="result-label">Chain ID</div>
        <div class="result-content">
          <code>{{ chain.id }}</code>
          <span class="result-muted">({{ chain.hex }})</span>
        </div>
      </div>

      <div class="result-item">
        <div class="result-label">Nox compute contract</div>
        <div class="result-content">
          <a
            :href="`${chain.explorer.url}/address/${chain.contract}`"
            target="_blank"
            rel="noopener"
          >
            <code>{{ chain.contract }}</code>
          </a>
        </div>
      </div>

      <div class="result-item">
        <div class="result-label">RPC URL</div>
        <div class="result-content">
          <code>{{ chain.rpc }}</code>
        </div>
      </div>

      <div class="result-item">
        <div class="result-label">Block explorer</div>
        <div class="result-content">
          <a :href="chain.explorer.url" target="_blank" rel="noopener">
            {{ chain.explorer.name }}
          </a>
        </div>
      </div>

      <div class="result-item">
        <div class="result-label">Native currency</div>
        <div class="result-content">
          <span>{{ chain.currency.name }}</span>
          <span class="result-muted">
            ({{ chain.currency.symbol }}, {{ chain.currency.decimals }} decimals)
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.network-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg);
  margin: 1.5rem 0;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
}

.header-title {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
}

.header-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-radius: 999px;
  padding: 0.125rem 0.5rem;
}

.result-card {
  background: var(--vp-c-bg);
}

.result-item {
  padding: 0.625rem 1.25rem;
}

.result-item + .result-item {
  border-top: 1px solid var(--vp-c-border);
}

.result-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin-bottom: 0.25rem;
}

.result-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.result-content code {
  font-size: 0.8125rem;
  line-height: 1.5;
  word-break: break-all;
  background: none;
  padding: 0;
  color: var(--vp-c-text-1);
}

.result-content a {
  text-decoration: none;
  border-bottom: 1px dashed var(--vp-c-brand-1);
}

.result-content a:hover {
  border-bottom-style: solid;
}

.result-muted {
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
}
</style>
