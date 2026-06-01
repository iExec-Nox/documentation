import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getChainById, type Chain } from '@/utils/chain.utils';

const useUserStore = defineStore('user', () => {
  // Within this store, chainId is canonical and selectedChain is derived from
  // it. (In the UI layer the connected wallet's chain takes precedence.)
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

  return {
    // State
    chainId,
    selectedChain,
    // Actions
    setChainId,
    setSelectedChain,
  };
});

export default useUserStore;
