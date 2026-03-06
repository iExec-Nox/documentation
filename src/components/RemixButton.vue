<template>
  <a
    :href="remixUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="remix-btn"
  >
    <img src="/remix-logo.png" alt="Remix" class="remix-icon" />
    <span>Open in Remix</span>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ code: string }>();

const remixUrl = computed(() => {
  if (typeof window === 'undefined') return '';
  const bytes = new TextEncoder().encode(props.code);
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  return `https://remix.ethereum.org/#code=${btoa(binary)}&language=solidity&autoCompile=true&optimize=false&runs=200&evmVersion=paris`;
});
</script>

<style scoped>
.remix-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  margin: 1rem 0;
}

.remix-btn:hover {
  background: var(--vp-c-brand-2);
  color: var(--vp-c-white);
  transform: translateY(-1px);
}

.remix-icon {
  width: 20px;
  height: 20px;
}
</style>
