import { createApp, defineComponent, h, nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { useChainState } from './useChainState';
import {
  mockEthereum,
  restoreEthereum,
  rpcError,
} from '../test/utils/ethereum-mock';

// Arbitrum Sepolia — matches chains.json
const TARGET_CHAIN_ID = 421614;
const TARGET_HEX = '0x66eee';
const OTHER_HEX = '0x1';

// Flush the microtask queue so async onMounted hooks settle.
async function flush() {
  await Promise.resolve();
  await Promise.resolve();
  await nextTick();
}

type ChainState = ReturnType<typeof useChainState>;

async function mountComposable(chainId = TARGET_CHAIN_ID): Promise<{
  state: ChainState;
  unmount: () => void;
}> {
  let state!: ChainState;
  const app = createApp(
    defineComponent({
      setup() {
        state = useChainState(chainId);
        return () => h('div');
      },
    })
  );
  app.mount(document.createElement('div'));
  await flush();
  return { state, unmount: () => app.unmount() };
}

describe('useChainState', () => {
  afterEach(() => {
    restoreEthereum();
  });

  it('window.ethereum absent → status is "no-wallet"', async () => {
    restoreEthereum();
    const { state, unmount } = await mountComposable();
    expect(state.status.value).toBe('no-wallet');
    unmount();
  });

  it('present, current chain ≠ target → status is "wrong-chain"', async () => {
    mockEthereum({ chainId: OTHER_HEX });
    const { state, unmount } = await mountComposable();
    expect(state.status.value).toBe('wrong-chain');
    expect(state.currentChainId.value).toBe(OTHER_HEX);
    unmount();
  });

  it('present, current chain === target → status is "right-chain"', async () => {
    mockEthereum({ chainId: TARGET_HEX });
    const { state, unmount } = await mountComposable();
    expect(state.status.value).toBe('right-chain');
    expect(state.currentChainId.value).toBe(TARGET_HEX);
    unmount();
  });

  it('addOrSwitch() switch succeeds → calls wallet_switchEthereumChain, status through "pending" to "right-chain"', async () => {
    const eth = mockEthereum({ chainId: OTHER_HEX });
    eth.request.mockImplementation(async ({ method }: { method: string }) => {
      if (method === 'eth_chainId') return OTHER_HEX;
      if (method === 'wallet_switchEthereumChain') return null;
      throw rpcError(4200, `Unsupported: ${method}`);
    });
    const { state, unmount } = await mountComposable();
    expect(state.status.value).toBe('wrong-chain');

    const promise = state.addOrSwitch();
    expect(state.status.value).toBe('pending');
    await promise;

    expect(state.status.value).toBe('right-chain');
    expect(eth.request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'wallet_switchEthereumChain' })
    );
    unmount();
  });

  it('addOrSwitch() 4902 → falls back to wallet_addEthereumChain, status reaches "right-chain"', async () => {
    const eth = mockEthereum({ chainId: OTHER_HEX });
    eth.request.mockImplementation(async ({ method }: { method: string }) => {
      if (method === 'eth_chainId') return OTHER_HEX;
      if (method === 'wallet_switchEthereumChain')
        throw rpcError(4902, 'Unrecognized chain');
      if (method === 'wallet_addEthereumChain') return null;
      throw rpcError(4200, `Unsupported: ${method}`);
    });
    const { state, unmount } = await mountComposable();

    await state.addOrSwitch();

    expect(state.status.value).toBe('right-chain');
    expect(eth.request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'wallet_addEthereumChain' })
    );
    unmount();
  });

  it('addOrSwitch() rejected by user (4001) → returns to prior idle, error populated', async () => {
    const eth = mockEthereum({ chainId: OTHER_HEX });
    eth.request.mockImplementation(async ({ method }: { method: string }) => {
      if (method === 'eth_chainId') return OTHER_HEX;
      if (method === 'wallet_switchEthereumChain')
        throw rpcError(4001, 'User rejected');
      throw rpcError(4200, `Unsupported: ${method}`);
    });
    const { state, unmount } = await mountComposable();
    expect(state.status.value).toBe('wrong-chain');

    await state.addOrSwitch();

    expect(state.status.value).toBe('wrong-chain');
    expect(state.error.value).not.toBeNull();
    expect((state.error.value as unknown as { code: number }).code).toBe(4001);
    unmount();
  });

  it('chainChanged event → currentChainId updates, status transitions accordingly', async () => {
    const eth = mockEthereum({ chainId: OTHER_HEX });
    const { state, unmount } = await mountComposable();
    expect(state.status.value).toBe('wrong-chain');

    eth.simulateChainChanged(TARGET_HEX);
    await nextTick();

    expect(state.currentChainId.value).toBe(TARGET_HEX);
    expect(state.status.value).toBe('right-chain');
    unmount();
  });

  it('unmount → chainChanged listener is removed (no leak)', async () => {
    const eth = mockEthereum({ chainId: OTHER_HEX });
    const { unmount } = await mountComposable();

    unmount();

    expect(eth.removeListener).toHaveBeenCalledWith(
      'chainChanged',
      expect.any(Function)
    );
  });
});
