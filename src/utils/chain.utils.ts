import { arbitrumSepolia } from 'viem/chains';
import arbitrumLogo from '@/assets/icons/arbitrum.svg';

export interface Chain {
  id: number;
  name: string;
  icon: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: {
      http: readonly string[];
    };
  };
  blockExplorers: {
    default: {
      name: string;
      url: string;
    };
  };
  chainName: string;
  /**
   * Identifier of the chain in `viem/chains` (e.g. `arbitrumSepolia`). Used by
   * the Shiki `dynamic-nox-address` transformer to rewrite hardcoded viem chain
   * references in docs code blocks.
   */
  viemChain: string;
  noxComputeAddress: string;
  gatewayUrl: string;
  subgraphUrl: string;
}

export function getSupportedChains(): Chain[] {
  return [
    {
      id: arbitrumSepolia.id,
      name: arbitrumSepolia.name,
      icon: arbitrumLogo,
      nativeCurrency: arbitrumSepolia.nativeCurrency,
      rpcUrls: arbitrumSepolia.rpcUrls,
      blockExplorers: arbitrumSepolia.blockExplorers,
      chainName: 'arbitrum-sepolia-testnet',
      viemChain: 'arbitrumSepolia',
      noxComputeAddress: '0xd464B198f06756a1d00be223634b85E0a731c229',
      gatewayUrl:
        'https://2e1800fc0dddeeadc189283ed1dce13c1ae28d48-3000.apps.ovh-tdx-dev.noxprotocol.dev',
      subgraphUrl:
        'https://thegraph.arbitrum-sepolia-testnet.noxprotocol.io/api/subgraphs/id/BjQAX2HpmsSAzURJimKDhjZZnkSJtaczA8RPumggrStb',
    },
  ];
}

export function getChainById(chainId: number): Chain | undefined {
  return getSupportedChains().find((chain) => chain.id === chainId);
}
