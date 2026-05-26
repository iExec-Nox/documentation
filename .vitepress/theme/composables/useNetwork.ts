import { onMounted, ref } from 'vue';
import { DEFAULT_NETWORK, NETWORKS, type Network } from '@/data/networks';

const STORAGE_KEY = 'nox-selected-network';

// Module-level singleton: a single reactive source of truth shared by every
// consumer (NetworkSwitcher, <NetworkCode>, PiggyBankDemo, ...). Switching the
// network therefore only re-renders the components that actually read it.
const selectedNetwork = ref<Network>(DEFAULT_NETWORK);

let hydrated = false;

function readStoredNetwork(): Network {
  if (typeof window === 'undefined') return DEFAULT_NETWORK;
  try {
    const id = window.localStorage.getItem(STORAGE_KEY);
    return NETWORKS.find((n) => n.id === id) ?? DEFAULT_NETWORK;
  } catch {
    return DEFAULT_NETWORK;
  }
}

export function useNetwork() {
  // Read localStorage only after mount so the initial client render matches the
  // server render (DEFAULT_NETWORK), avoiding hydration mismatches. The guard
  // makes sure we do this once, no matter how many components call the hook.
  onMounted(() => {
    if (hydrated) return;
    hydrated = true;
    selectedNetwork.value = readStoredNetwork();
  });

  function setNetwork(id: string) {
    const next = NETWORKS.find((n) => n.id === id);
    if (!next) return;
    selectedNetwork.value = next;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, id);
      } catch {
        /* localStorage may be unavailable (private mode, etc.) */
      }
    }
  }

  return {
    selectedNetwork,
    networks: NETWORKS,
    setNetwork,
  };
}
