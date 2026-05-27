<template>
  <div class="flex items-center">
    <Select v-model="selectedChainId" :class="className">
      <SelectTrigger>
        <SelectValue :placeholder="selectedChain?.name || 'Select chain'">
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
          <SelectItemText>
            <div class="flex items-center gap-2">
              <img
                v-if="chain.icon"
                :src="chain.icon"
                :alt="chain.name"
                class="h-4 w-4 rounded-full"
              />
              <span>{{ chain.name }}</span>
            </div>
          </SelectItemText>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useAccount } from '@wagmi/vue';
import { useChainSwitch } from '@/hooks/useChainSwitch';
import { getSupportedChains, getChainById } from '@/utils/chain.utils';
import useUserStore from '@/stores/useUser.store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
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

// Data
const supportedChains = getSupportedChains();

// Default initialization: check first if wallet is connected
if (!userStore.chainId) {
  if (chainId.value) {
    // If wallet is connected, use its chain
    const walletChain = getChainById(chainId.value);
    if (walletChain) {
      userStore.setSelectedChain(walletChain);
    }
  } else {
    // Otherwise, use Arbitrum Sepolia as default
    const defaultChain = getChainById(421614); // Arbitrum Sepolia
    if (defaultChain) {
      userStore.setSelectedChain(defaultChain);
    }
  }
}

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
    if (numericValue && numericValue !== -1) {
      const chain = getChainById(numericValue);
      if (chain) {
        userStore.setSelectedChain(chain);
        await requestChainChange(numericValue);
      }
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
