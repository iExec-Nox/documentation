<template>
  <div class="flex items-center">
    <Select v-model="selectedChainId" :class="className">
      <SelectTrigger>
        <SelectValue :placeholder="selectedChain?.name || 'Select Chain'">
          <div v-if="selectedChain" class="flex items-center gap-2">
            <img
              v-if="selectedChain.icon"
              :src="selectedChain.icon"
              :alt="selectedChain.name"
              class="h-4 w-4 rounded-full"
            />
            <span>{{ selectedChain.name }}</span>
          </div>
          <span v-else>Select Chain</span>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        <SelectItem
          v-for="chain in supportedChains"
          :key="chain.id"
          :value="chain.id.toString()"
        >
          <!-- SelectItem already wraps its slot in <SelectItemText>; nesting a
               second one duplicates the option's DOM id and registers it twice. -->
          <div class="flex items-center gap-2">
            <img
              v-if="chain.icon"
              :src="chain.icon"
              :alt="chain.name"
              class="h-4 w-4 rounded-full"
            />
            <span>{{ chain.name }}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useAccount } from '@wagmi/vue';
import { useChainSwitch } from '@/hooks/useChainSwitch';
import { getLiveChains, getChainById } from '@/utils/chain.utils';
import useUserStore from '@/stores/useUser.store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  className?: string;
}

defineProps<Props>();

// Composables
const { chainId } = useAccount();
const { requestChainChange } = useChainSwitch();
const userStore = useUserStore();

// Data — only offer fully-deployed chains; a not-yet-deployed chain (TODO_
// placeholders) is hidden until its real values land.
const supportedChains = getLiveChains();

// Default initialization: check first if wallet is connected.
// Runs client-side only (onMounted) so we never mutate the Pinia store during
// SSR, which would risk cross-request state leakage / hydration mismatches.
onMounted(() => {
  if (userStore.chainId) return;
  // Prefer the wallet's chain if supported, else the first live chain.
  const walletChain = chainId.value ? getChainById(chainId.value) : undefined;
  const defaultChain = walletChain ?? supportedChains[0];
  if (defaultChain) {
    userStore.setSelectedChain(defaultChain);
  } else {
    console.error('[ChainSelector] no live chain available to initialize');
  }
});

// Computed
const selectedChain = computed(() => {
  // Priority: 1. Connected wallet chain, 2. Selected chain in store
  const currentChainId = chainId.value || userStore.chainId;
  return currentChainId ? getChainById(currentChainId) : undefined;
});

const selectedChainId = computed({
  get: () => {
    const currentChainId = chainId.value || userStore.chainId;
    return currentChainId ? currentChainId.toString() : '';
  },
  set: async (value: string) => {
    const numericValue = Number(value);
    if (!numericValue) return;
    const chain = getChainById(numericValue);
    if (!chain) return;
    try {
      // Switch first; a connected wallet can reject the prompt.
      await requestChainChange(numericValue);
      // Commit the selection only once the switch actually succeeded, so the
      // store never points at a chain the wallet isn't on (the `watch(chainId)`
      // below keeps things in sync when the wallet's chain really changes).
      userStore.setSelectedChain(chain);
    } catch (err) {
      // Wallet rejection is expected; surface anything else (RPC, chain not added).
      // The store wasn't written optimistically, so the v-model reverts on its own.
      const rejected = err instanceof Error && /reject/i.test(err.message);
      if (!rejected) console.error('[ChainSelector] chain switch failed', err);
    }
  },
});

// Watch to synchronize store with wallet chain
watch(chainId, (newChainId) => {
  if (newChainId) {
    const chain = getChainById(newChainId);
    if (chain) {
      userStore.setSelectedChain(chain);
    }
  }
});
</script>
