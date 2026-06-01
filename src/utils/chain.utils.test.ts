import { describe, expect, it } from 'vitest';
import {
  getChainById,
  getLiveChains,
  getSupportedChains,
  isChainLive,
} from './chain.utils';

const REQUIRED_STRING_FIELDS = [
  'name',
  'chainName',
  'viemChain',
  'noxComputeAddress',
  'gatewayUrl',
  'subgraphUrl',
] as const;

describe('getSupportedChains', () => {
  it('returns a non-empty array with every required field populated', () => {
    const chains = getSupportedChains();

    expect(Array.isArray(chains)).toBe(true);
    expect(chains.length).toBeGreaterThan(0);

    for (const chain of chains) {
      expect(typeof chain.id).toBe('number');
      expect(chain.id).toBeGreaterThan(0);

      for (const field of REQUIRED_STRING_FIELDS) {
        const value = chain[field];
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
        if (field === 'noxComputeAddress') {
          expect(value).toMatch(/^0x[0-9a-fA-F]{40}$/);
        }
      }

      expect(chain.nativeCurrency).toBeDefined();
      expect(typeof chain.nativeCurrency.name).toBe('string');
      expect(typeof chain.nativeCurrency.symbol).toBe('string');
      expect(typeof chain.nativeCurrency.decimals).toBe('number');

      expect(chain.rpcUrls?.default?.http?.length ?? 0).toBeGreaterThan(0);
      expect(chain.blockExplorers?.default?.url?.length ?? 0).toBeGreaterThan(
        0
      );
    }
  });
});

describe('getChainById', () => {
  it('returns the matching chain for a known id (Arbitrum Sepolia, 421614)', () => {
    const chain = getChainById(421614);
    expect(chain).toBeDefined();
    expect(chain?.id).toBe(421614);
    expect(chain?.viemChain).toBe('arbitrumSepolia');
    // Arbitrum Sepolia is live: its NoxCompute address must stay a real
    // 0x-address (guards against a regression).
    expect(chain?.noxComputeAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
    expect(chain?.noxComputeAddress).toBe(
      '0xd464B198f06756a1d00be223634b85E0a731c229'
    );
  });

  it('returns undefined for an unknown id (999999)', () => {
    expect(getChainById(999999)).toBeUndefined();
  });
});

describe('isChainLive / getLiveChains', () => {
  it('treats a chain with TODO_ placeholder endpoints as not live', () => {
    const [arbitrum] = getSupportedChains();
    expect(isChainLive(arbitrum)).toBe(true);

    expect(
      isChainLive({
        ...arbitrum,
        noxComputeAddress: 'TODO_ETH_SEPOLIA_NOX_COMPUTE_ADDRESS',
      })
    ).toBe(false);
    expect(isChainLive({ ...arbitrum, gatewayUrl: 'TODO_X' })).toBe(false);
    expect(isChainLive({ ...arbitrum, subgraphUrl: 'TODO_X' })).toBe(false);
  });

  it('only returns fully-deployed chains', () => {
    const live = getLiveChains();
    expect(live.length).toBeGreaterThan(0);
    for (const chain of live) {
      expect(chain.noxComputeAddress.startsWith('TODO_')).toBe(false);
      expect(chain.gatewayUrl.startsWith('TODO_')).toBe(false);
      expect(chain.subgraphUrl.startsWith('TODO_')).toBe(false);
    }
  });
});
