// ⚠️ TODO Ethereum Sepolia: Nox is not deployed on Ethereum Sepolia yet.
// The Ethereum Sepolia entry below ships with placeholder values that MUST be
// replaced with the real ones before this chain is announced:
//   - noxComputeAddress: 'TODO_ETH_SEPOLIA_NOX_COMPUTE_ADDRESS'
//   - gatewayUrl:        'TODO_ETH_SEPOLIA_GATEWAY_URL'
//   - subgraphUrl:       'TODO_ETH_SEPOLIA_SUBGRAPH_URL'
// (rpcUrls / blockExplorers come from viem's well-known `sepolia` chain.)
import { arbitrumSepolia, sepolia } from 'viem/chains';
import arbitrumLogo from '@/assets/icons/arbitrum.svg';
import ethereumLogo from '@/assets/icons/ethereum.svg';

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
   * Identifier of the chain in `viem/chains` (e.g. `arbitrumSepolia`,
   * `sepolia`). Used by the Shiki `dynamic-nox-address` transformer to
   * rewrite hardcoded viem chain references in docs code blocks.
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
    {
      id: sepolia.id,
      // Literal label on purpose: viem's `sepolia.name` is just "Sepolia",
      // which would render ambiguously in the chain switcher and `{{ chainName }}`.
      name: 'Ethereum Sepolia',
      icon: ethereumLogo,
      nativeCurrency: sepolia.nativeCurrency,
      rpcUrls: sepolia.rpcUrls,
      blockExplorers: sepolia.blockExplorers,
      chainName: 'ethereum-sepolia-testnet',
      viemChain: 'sepolia',
      // ⚠️ TODO Ethereum Sepolia — replace before shipping (see file header).
      noxComputeAddress: 'TODO_ETH_SEPOLIA_NOX_COMPUTE_ADDRESS',
      gatewayUrl: 'TODO_ETH_SEPOLIA_GATEWAY_URL',
      subgraphUrl: 'TODO_ETH_SEPOLIA_SUBGRAPH_URL',
    },
  ];
}

export function getChainById(chainId: number): Chain | undefined {
  return getSupportedChains().find((chain) => chain.id === chainId);
}
