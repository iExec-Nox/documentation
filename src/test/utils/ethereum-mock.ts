import { vi } from 'vitest';

// Pattern: inject a controlled window.ethereum stub before each test,
// then call restoreEthereum() in afterEach to avoid leaking state.
//
// Usage:
//   const eth = mockEthereum({ chainId: '0x66eee' })
//   eth.simulateChainChanged('0x1')
//   eth.request.mockRejectedValueOnce(rpcError(4902, 'Unrecognized chain'))
//   restoreEthereum()

export type MockEthereum = {
  request: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
  removeListener: ReturnType<typeof vi.fn>;
  /** Fire a chainChanged event on all registered listeners. */
  simulateChainChanged: (chainId: string) => void;
};

type EthereumMockOptions = {
  /** Hex chain ID returned by eth_chainId, e.g. '0x66eee' for Arbitrum Sepolia. */
  chainId?: string;
};

/**
 * Installs a controllable window.ethereum mock and returns handles for
 * per-test customisation. Call restoreEthereum() in afterEach.
 */
export function mockEthereum(options: EthereumMockOptions = {}): MockEthereum {
  const { chainId = '0x1' } = options;
  const listeners: Map<string, Set<(...args: unknown[]) => void>> = new Map();

  const request = vi.fn(async ({ method }: { method: string }) => {
    if (method === 'eth_chainId') return chainId;
    throw rpcError(4200, `Method ${method} not supported by mock`);
  });

  const on = vi.fn((event: string, handler: (...args: unknown[]) => void) => {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(handler);
  });

  const removeListener = vi.fn(
    (event: string, handler: (...args: unknown[]) => void) => {
      listeners.get(event)?.delete(handler);
    }
  );

  const mock: MockEthereum = {
    request,
    on,
    removeListener,
    simulateChainChanged(newChainId: string) {
      listeners.get('chainChanged')?.forEach((h) => h(newChainId));
    },
  };

  Object.defineProperty(window, 'ethereum', {
    value: mock,
    writable: true,
    configurable: true,
  });

  return mock;
}

/** Remove window.ethereum — simulates a desktop browser with no wallet installed. */
export function restoreEthereum(): void {
  Object.defineProperty(window, 'ethereum', {
    value: undefined,
    writable: true,
    configurable: true,
  });
}

/** Build an EIP-1193 JSON-RPC error with a numeric code. */
export function rpcError(code: number, message: string): Error {
  const err = new Error(message) as Error & { code: number };
  err.code = code;
  return err;
}
