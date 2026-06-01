import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

// Mirror wagmi's Ref<boolean> shape for isConnected.
const switchChainMock = vi.fn();
let isConnectedValue: boolean = false;

vi.mock('@wagmi/core', () => ({
  switchChain: (...args: unknown[]) => switchChainMock(...args),
}));

vi.mock('@wagmi/vue', () => ({
  useAccount: () => ({
    isConnected: {
      get value() {
        return isConnectedValue;
      },
    },
  }),
}));

// Mock the wagmi config so we don't pull in Reown / AppKit during the test.
vi.mock('@/utils/wagmiConfig', () => ({
  wagmiAdapter: { wagmiConfig: { __test: true } },
}));

import { useChainSwitch } from './useChainSwitch';
import useUserStore from '@/stores/useUser.store';

describe('useChainSwitch', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    switchChainMock.mockReset();
    isConnectedValue = false;
  });

  it('delegates to wagmi switchChain when a wallet is connected', async () => {
    isConnectedValue = true;
    const store = useUserStore();
    // Seed a real value so "store untouched" is a meaningful assertion.
    store.setChainId(1);

    const { requestChainChange } = useChainSwitch();
    await requestChainChange(421614);

    expect(switchChainMock).toHaveBeenCalledTimes(1);
    expect(switchChainMock).toHaveBeenCalledWith(
      { __test: true },
      { chainId: 421614 }
    );
    // store untouched when delegating to wagmi
    expect(store.chainId).toBe(1);
  });

  it('propagates rejection from wagmi switchChain when connected', async () => {
    isConnectedValue = true;
    switchChainMock.mockRejectedValueOnce(new Error('User rejected'));

    const { requestChainChange } = useChainSwitch();

    await expect(requestChainChange(421614)).rejects.toThrow('User rejected');
  });

  it('writes to the store only and does not call switchChain when disconnected', async () => {
    isConnectedValue = false;
    const store = useUserStore();

    const { requestChainChange } = useChainSwitch();
    await requestChainChange(421614);

    expect(switchChainMock).not.toHaveBeenCalled();
    expect(store.chainId).toBe(421614);
  });
});
