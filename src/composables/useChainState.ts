import { onMounted, onUnmounted, ref } from 'vue';
import { getChainById } from '../data/chains';

export type ChainStatus =
  | 'no-wallet'
  | 'wrong-chain'
  | 'right-chain'
  | 'pending';
export type NoWalletHint = 'desktop' | 'mobile';

function isMobile(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const eth = (): any => (window as any).ethereum;

export function useChainState(chainId: number) {
  const status = ref<ChainStatus>('no-wallet');
  const currentChainId = ref<string | null>(null);
  const error = ref<Error | null>(null);
  const noWalletHint = ref<NoWalletHint | null>(null);

  function applyChainId(hexChainId: string) {
    const chain = getChainById(chainId);
    currentChainId.value = hexChainId;
    status.value =
      chain && hexChainId.toLowerCase() === chain.hex.toLowerCase()
        ? 'right-chain'
        : 'wrong-chain';
  }

  const handleChainChanged = (hexChainId: unknown) => {
    applyChainId(hexChainId as string);
  };

  onMounted(async () => {
    const ethereum = eth();
    if (!ethereum) {
      status.value = 'no-wallet';
      noWalletHint.value = isMobile() ? 'mobile' : 'desktop';
      return;
    }
    try {
      const hexChainId: string = await ethereum.request({
        method: 'eth_chainId',
      });
      applyChainId(hexChainId);
      ethereum.on('chainChanged', handleChainChanged);
    } catch (err) {
      error.value = err as Error;
    }
  });

  onUnmounted(() => {
    eth()?.removeListener('chainChanged', handleChainChanged);
  });

  async function addOrSwitch(): Promise<void> {
    const ethereum = eth();
    if (!ethereum) return;

    const chain = getChainById(chainId);
    if (!chain) return;

    const prevStatus = status.value;
    status.value = 'pending';
    error.value = null;

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain.hex }],
      });
      status.value = 'right-chain';
    } catch (switchErr: unknown) {
      const code = (switchErr as { code?: number }).code;
      if (code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chain.hex,
                chainName: chain.name,
                rpcUrls: [chain.rpc],
                blockExplorerUrls: [chain.explorer.url],
                nativeCurrency: chain.currency,
              },
            ],
          });
          status.value = 'right-chain';
        } catch (addErr: unknown) {
          status.value = prevStatus;
          error.value = addErr as Error;
        }
      } else {
        // Covers 4001 (user rejection) and any other error
        status.value = prevStatus;
        error.value = switchErr as Error;
      }
    }
  }

  return { status, currentChainId, error, noWalletHint, addOrSwitch };
}
