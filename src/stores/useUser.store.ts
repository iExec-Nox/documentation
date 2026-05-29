import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getChainById, type Chain } from '@/utils/chain.utils';

const useUserStore = defineStore('user', () => {
  // State — chainId is the single source of truth.
  const chainId = ref<number | undefined>(undefined);

  // Derived: selectedChain always follows chainId, so the two can never drift.
  const selectedChain = computed<Chain | undefined>(() =>
    chainId.value ? getChainById(chainId.value) : undefined
  );

  // Actions
  function setChainId(newChainId: number) {
    chainId.value = newChainId;
  }

  function setSelectedChain(chain: Chain) {
    chainId.value = chain.id;
  }

  // Getters
  const getCurrentChainId = () => chainId.value;
  const getCurrentChain = () => selectedChain.value;

  return {
    // State
    chainId,
    selectedChain,
    // Actions
    setChainId,
    setSelectedChain,
    // Getters
    getCurrentChainId,
    getCurrentChain,
  };
});

export default useUserStore;
