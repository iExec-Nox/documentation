import { afterEach, describe, expect, it } from 'vitest';
import { mockEthereum, restoreEthereum, rpcError } from './utils/ethereum-mock';

describe('test infrastructure', () => {
  it('vitest + happy-dom are wired up', () => {
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
  });
});

describe('ethereum-mock helper', () => {
  afterEach(() => restoreEthereum());

  it('installs window.ethereum and answers eth_chainId', async () => {
    mockEthereum({ chainId: '0x66eee' });
    const result = await (
      window as Window & {
        ethereum?: { request: (arg: { method: string }) => Promise<string> };
      }
    ).ethereum?.request({ method: 'eth_chainId' });
    expect(result).toBe('0x66eee');
  });

  it('restoreEthereum removes window.ethereum', () => {
    mockEthereum();
    restoreEthereum();
    expect(
      (window as Window & { ethereum?: unknown }).ethereum
    ).toBeUndefined();
  });

  it('rpcError attaches a numeric code', () => {
    const err = rpcError(4902, 'Unrecognized chain');
    expect((err as Error & { code: number }).code).toBe(4902);
  });

  it('simulateChainChanged notifies registered listeners', () => {
    const eth = mockEthereum({ chainId: '0x1' });
    const received: string[] = [];
    eth.on('chainChanged', (id) => received.push(id as string));
    eth.simulateChainChanged('0x66eee');
    expect(received).toEqual(['0x66eee']);
  });
});
