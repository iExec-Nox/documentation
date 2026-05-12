import chainsJson from './chains.json';

export type ChainStatus = 'live' | 'coming-soon' | 'deprecated';

export interface ChainFaucet {
  name: string;
  url: string;
  recommended?: boolean;
  note?: string;
}

export interface ChainExplorer {
  name: string;
  url: string;
}

export interface ChainCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface ChainBridge {
  name: string;
  url: string;
}

export interface Chain {
  id: number;
  name: string;
  hex: string;
  status: ChainStatus;
  primary: boolean;
  isTestnet: boolean;
  contract: string;
  rpc: string;
  explorer: ChainExplorer;
  currency: ChainCurrency;
  faucets: ChainFaucet[];
  faucetWarnings: string[];
  bridge?: ChainBridge;
}

export const chains: Chain[] = chainsJson as Chain[];

export function getPrimaryChain(): Chain | null {
  const primaries = chains.filter((c) => c.primary);
  return primaries.length === 1 ? primaries[0] : null;
}

export function getLiveChains(): Chain[] {
  return chains.filter((c) => c.status === 'live');
}

export function getComingSoonChains(): Chain[] {
  return chains.filter((c) => c.status === 'coming-soon');
}

export function getChainById(id: number): Chain | undefined {
  return chains.find((c) => c.id === id);
}
