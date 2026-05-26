// Supported networks for the Nox documentation.
//
// Each entry drives the network switcher in the navbar and the <NetworkCode>
// blocks that show network-specific code, contract addresses, and config.
//
// The `id` slug must match the slot names used by <NetworkCode>
// (e.g. <template #arbitrum-sepolia>) and the value persisted in localStorage.
//
// ⚠️ TODO — Ethereum Sepolia is not deployed yet. The following fields are
// placeholders and MUST be filled in before this network is announced/shipped:
//   - noxComputeAddress: 'TODO_ETH_SEPOLIA_NOX_COMPUTE_ADDRESS'
//   - gatewayUrl:        'TODO_ETH_SEPOLIA_GATEWAY_URL'
//   - subgraphUrl:       'TODO_ETH_SEPOLIA_SUBGRAPH_URL'
// (rpcUrl and blockExplorerUrl below use the well-known public Sepolia values.)

export interface Network {
  /** URL/slot-friendly slug, e.g. "arbitrum-sepolia". */
  id: string;
  /** Human-readable label shown in the UI. */
  name: string;
  /** EVM chain ID as a number. */
  chainId: number;
  /** EVM chain ID as a 0x-prefixed hex string (used by wallet RPC calls). */
  chainIdHex: string;
  /** Name of the chain export from `viem/chains` (e.g. "arbitrumSepolia"). */
  viemChain: string;
  /**
   * Path to the chain logo (served from `src/public`, base path included).
   * Testnets reuse their mainnet logo, per the usual explorer convention.
   */
  logo: string;
  /** Public JSON-RPC endpoint. */
  rpcUrl: string;
  /** Block explorer base URL. */
  blockExplorerUrl: string;
  /** NoxCompute singleton contract address on this network. */
  noxComputeAddress: string;
  /** Handle Gateway base URL (TEE). */
  gatewayUrl: string;
  /** The Graph subgraph URL. */
  subgraphUrl: string;
}

export const NETWORKS: Network[] = [
  {
    id: 'arbitrum-sepolia',
    name: 'Arbitrum Sepolia',
    chainId: 421614,
    chainIdHex: '0x66eee',
    viemChain: 'arbitrumSepolia',
    logo: '/nox-protocol/chain-logos/arbitrum.svg',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    blockExplorerUrl: 'https://sepolia.arbiscan.io',
    noxComputeAddress: '0xd464B198f06756a1d00be223634b85E0a731c229',
    gatewayUrl:
      'https://2e1800fc0dddeeadc189283ed1dce13c1ae28d48-3000.apps.ovh-tdx-dev.noxprotocol.dev',
    subgraphUrl:
      'https://thegraph.arbitrum-sepolia-testnet.noxprotocol.io/api/subgraphs/id/BjQAX2HpmsSAzURJimKDhjZZnkSJtaczA8RPumggrStb',
  },
  {
    id: 'ethereum-sepolia',
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    chainIdHex: '0xaa36a7',
    viemChain: 'sepolia',
    logo: '/nox-protocol/chain-logos/ethereum.svg',
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    // ⚠️ TODO: replace the three placeholders below before shipping (see header).
    noxComputeAddress: 'TODO_ETH_SEPOLIA_NOX_COMPUTE_ADDRESS',
    gatewayUrl: 'TODO_ETH_SEPOLIA_GATEWAY_URL',
    subgraphUrl: 'TODO_ETH_SEPOLIA_SUBGRAPH_URL',
  },
];

/** Default network used during SSR and before localStorage is read. */
export const DEFAULT_NETWORK: Network = NETWORKS[0];
