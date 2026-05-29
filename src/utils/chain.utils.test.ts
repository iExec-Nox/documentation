import { describe, expect, it } from 'vitest';
import { getChainById, getSupportedChains } from './chain.utils';

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

      // The TODO_ETH_SEPOLIA_* placeholders count as "populated" here — we
      // assert non-empty strings (and 0x-format for noxComputeAddress), not
      // real on-chain values. Tighten this check once Ethereum Sepolia goes
      // live.
      for (const field of REQUIRED_STRING_FIELDS) {
        const value = chain[field];
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
        if (field === 'noxComputeAddress') {
          expect(value).toMatch(/^0x[0-9a-fA-F]{40}$|^TODO_/);
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
    // 0x-address, never a TODO_ placeholder (guards against a regression).
    expect(chain?.noxComputeAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
    expect(chain?.noxComputeAddress).toBe(
      '0xd464B198f06756a1d00be223634b85E0a731c229'
    );
  });

  it('returns the matching chain for a known id (Ethereum Sepolia, 11155111)', () => {
    const chain = getChainById(11155111);
    expect(chain).toBeDefined();
    expect(chain?.id).toBe(11155111);
    expect(chain?.viemChain).toBe('sepolia');
    // Once Ethereum Sepolia is live, tighten this to assert a real 0x address
    // (today it still ships the TODO_ placeholder — see chain.utils.ts header).
  });

  it('returns undefined for an unknown id (999999)', () => {
    expect(getChainById(999999)).toBeUndefined();
  });
});
