<template>
  <div class="network-card">
    <!-- Card header -->
    <div class="network-card__header">
      <div class="network-card__title-row">
        <span class="network-card__name">{{ chain.name }}</span>
        <span v-if="chain.isTestnet" class="network-card__badge network-card__badge--testnet">
          Testnet
        </span>
        <span
          :class="[
            'network-card__badge',
            chain.status === 'live'
              ? 'network-card__badge--live'
              : 'network-card__badge--inactive',
          ]"
        >
          {{ chain.status }}
        </span>
      </div>

      <!-- Add to wallet button -->
      <ClientOnly>
        <AddChainButton :chain-id="chain.id" />
      </ClientOnly>
    </div>

    <!-- Metadata grid -->
    <div class="network-card__body">
      <div class="network-card__row">
        <span class="network-card__label">Chain ID</span>
        <code class="network-card__value">{{ chain.id }}</code>
      </div>
      <div class="network-card__row">
        <span class="network-card__label">Nox Contract</span>
        <a
          :href="`${chain.explorer.url}/address/${chain.contract}`"
          target="_blank"
          rel="noopener noreferrer"
          class="network-card__value network-card__link"
        >
          <code>{{ shortAddress(chain.contract) }}</code>
        </a>
      </div>
      <div class="network-card__row">
        <span class="network-card__label">RPC URL</span>
        <code class="network-card__value">{{ chain.rpc }}</code>
      </div>
      <div class="network-card__row">
        <span class="network-card__label">Explorer</span>
        <a
          :href="chain.explorer.url"
          target="_blank"
          rel="noopener noreferrer"
          class="network-card__value network-card__link"
        >
          {{ chain.explorer.name }}
        </a>
      </div>
      <div class="network-card__row">
        <span class="network-card__label">Currency</span>
        <span class="network-card__value">
          {{ chain.currency.symbol }} ({{ chain.currency.name }}, {{ chain.currency.decimals }} decimals)
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chain } from '../data/chains'

defineProps<{
  chain: Chain
}>()

function shortAddress(addr: string): string {
  return `${addr.slice(0, 10)}…${addr.slice(-6)}`
}
</script>

<style scoped>
.network-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg);
  margin: 1.25rem 0;
  overflow: hidden;
}

/* Header */
.network-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  flex-wrap: wrap;
}

.network-card__title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.network-card__name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* Status / type badges */
.network-card__badge {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.1875rem 0.5rem;
  border-radius: 999px;
  border: 1px solid;
}

.network-card__badge--testnet {
  background: var(--vp-c-yellow-soft);
  border-color: var(--vp-c-yellow-2);
  color: var(--vp-c-yellow-1);
}

.network-card__badge--live {
  background: var(--vp-c-green-soft);
  border-color: var(--vp-c-green-2);
  color: var(--vp-c-green-1);
}

.network-card__badge--inactive {
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-border);
  color: var(--vp-c-text-3);
}

/* Metadata rows */
.network-card__body {
  padding: 0.25rem 0;
}

.network-card__row {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.5rem 1.25rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.network-card__row:last-child {
  border-bottom: none;
}

.network-card__label {
  flex-shrink: 0;
  width: 7.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
}

.network-card__value {
  font-size: 0.8125rem;
  color: var(--vp-c-text-1);
  word-break: break-all;
}

.network-card__value code {
  background: none;
  padding: 0;
  font-size: 0.8125rem;
}

.network-card__link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.network-card__link:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
