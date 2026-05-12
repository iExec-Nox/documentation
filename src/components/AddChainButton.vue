<template>
  <div class="add-chain-wrapper">
    <!-- right-chain: success badge -->
    <div v-if="status === 'right-chain'" class="chain-badge chain-badge--success">
      <svg
        class="chain-badge__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Connected to {{ chainName }}
    </div>

    <!-- pending: disabled button with spinner -->
    <button v-else-if="status === 'pending'" class="btn-brand" disabled>
      <span class="btn-spinner" aria-hidden="true" />
      Adding…
    </button>

    <!-- no-wallet desktop -->
    <template v-else-if="status === 'no-wallet' && noWalletHint === 'desktop'">
      <button class="btn-brand" disabled>Add to wallet</button>
      <p class="chain-hint">
        No wallet detected.
        <a
          href="https://metamask.io"
          target="_blank"
          rel="noopener noreferrer"
          class="chain-hint__link"
        >Install MetaMask</a>
      </p>
    </template>

    <!-- no-wallet mobile -->
    <template v-else-if="status === 'no-wallet' && noWalletHint === 'mobile'">
      <button class="btn-brand" disabled>Add to wallet</button>
      <p class="chain-hint">Open in MetaMask mobile and add manually.</p>
    </template>

    <!-- no-wallet (hint not yet resolved — SSR/initial) -->
    <template v-else-if="status === 'no-wallet'">
      <button class="btn-brand" disabled>Add to wallet</button>
    </template>

    <!-- wrong-chain: active button -->
    <button v-else class="btn-brand" @click="handleClick">
      Add {{ chainName }} to wallet
    </button>

    <!-- inline error -->
    <p v-if="error" class="chain-error" role="alert">
      {{ error.message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChainState } from '../composables/useChainState'
import { getChainById } from '../data/chains'

const props = defineProps<{
  chainId: number
}>()

const { status, error, noWalletHint, addOrSwitch } = useChainState(props.chainId)

const chainName = computed(() => getChainById(props.chainId)?.name ?? `Chain ${props.chainId}`)

async function handleClick() {
  await addOrSwitch()
}
</script>

<style scoped>
.add-chain-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.375rem;
}

/* Brand button — same style as PiggyBankDemo */
.btn-brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  background: var(--vp-c-brand-1);
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-brand:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

.btn-brand:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Spinner inside pending button */
.btn-spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Success badge */
.chain-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid;
}

.chain-badge--success {
  background: var(--vp-c-green-soft);
  border-color: var(--vp-c-green-2);
  color: var(--vp-c-green-1);
}

.chain-badge__icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* Hint text below the button */
.chain-hint {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin: 0;
  line-height: 1.4;
}

.chain-hint__link {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.chain-hint__link:hover {
  color: var(--vp-c-brand-2);
}

/* Inline error */
.chain-error {
  font-size: 0.75rem;
  color: var(--vp-c-danger-1);
  margin: 0;
  line-height: 1.4;
}
</style>
