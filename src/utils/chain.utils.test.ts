import { describe, expect, it } from 'vitest';
import { getChainById, getSupportedChains } from './chain.utils';

const REQUIRED_STRING_FIELDS = [
  'name',
  'chainName',
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

      // The Eth Sepolia placeholders (TODO_ETH_SEPOLIA_*) count as
      // "populated" — what we assert here is "non-empty string", not a real
      // value. Slice 08 will swap those markers for real data.
      for (const field of REQUIRED_STRING_FIELDS) {
        const value = chain[field];
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
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
    expect(chain?.chainName).toBe('arbitrum-sepolia-testnet');
  });

  it('returns undefined for an unknown id (999999)', () => {
    expect(getChainById(999999)).toBeUndefined();
  });
});
