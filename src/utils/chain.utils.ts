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
  noxComputeAddress: string;
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
      noxComputeAddress: '0xd464B198f06756a1d00be223634b85E0a731c229',
    },
    {
      id: sepolia.id,
      // Literal label on purpose: viem's `sepolia.name` is just "Sepolia",
      // which would render ambiguously next to "Arbitrum Sepolia".
      name: 'Ethereum Sepolia',
      icon: ethereumLogo,
      nativeCurrency: sepolia.nativeCurrency,
      rpcUrls: sepolia.rpcUrls,
      blockExplorers: sepolia.blockExplorers,
      noxComputeAddress: '0x24ef36ec5b626d7dcd09a98f3083c2758f0f77bf',
    },
  ];
}

export function getChainById(chainId: number): Chain | undefined {
  return getSupportedChains().find((chain) => chain.id === chainId);
}
