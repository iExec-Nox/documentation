<script setup>
import { computed } from 'vue';
import { VPBadge } from 'vitepress/theme';
import useUserStore from '@/stores/useUser.store';

const userStore = useUserStore();

// Check if a Nox-supported chain is selected (Arbitrum Sepolia 421614, Ethereum Sepolia 11155111)
const isSupportedChainSelected = computed(() => {
  return userStore.chainId === 421614 || userStore.chainId === 11155111;
});

// Only show the badge when a supported chain is selected
const shouldShow = computed(() => isSupportedChainSelected.value);
</script>

<template>
  <VPBadge
    v-if="shouldShow"
    type="tip"
    text="Chain Not Supported"
    style="
      color: var(--vp-c-red-1);
      background-color: hsla(350, 89%, 60%, 8%);
      margin-top: 1px;
      margin-right: 4px;
    "
  />
</template>
