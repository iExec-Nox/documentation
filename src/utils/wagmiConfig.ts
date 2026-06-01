import { createAppKit } from '@reown/appkit/vue';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { http } from '@wagmi/vue';
import wagmiNetworks from '@/utils/wagmiNetworks';
import { AppKitNetwork } from '@reown/appkit/networks';

// VITE_REOWN_PROJECT_ID is optional: set it to enable WalletConnect (QR modal).
// Without it, doc-view chain switching and the injected-wallet (MetaMask) path
// still work — we fall back to a placeholder so dev/build never hard-fail.
export const projectId =
  (import.meta.env.VITE_REOWN_PROJECT_ID as string) || 'nox-docs-fallback';

const networks = Object.values(wagmiNetworks) as [
  AppKitNetwork,
  ...AppKitNetwork[],
];

export const wagmiAdapter = new WagmiAdapter({
  networks: networks,
  // Let AppKit/wagmi own EIP-6963 injected-wallet discovery. Discovery is an
  // async, event-driven handshake (requestProvider → announceProvider on a
  // later tick), so it cannot be done in a one-shot synchronous block at
  // module load — delegating to AppKit avoids that race entirely.
  multiInjectedProviderDiscovery: true,
  transports: Object.fromEntries(
    Object.values(wagmiNetworks).map((network) => [network.id, http()])
  ),
  projectId,
});

// Force some wallets to be displayed even if not detected in user's browser
// Find wallets IDs here: https://explorer.walletconnect.com/
const featuredWalletIds = [
  'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // Metamask
  'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // Coinbase Wallet
  '163d2cf19babf05eb8962e9748f9ebe613ed52ebf9c8107c9a0f104bfcf161b3', // Brave Wallet
  'ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18', // Zerion
];

// Initialise the Reown modal on the client only. `createAppKit` runs
// `AppKit.initialize()`, which fires live network calls to api.web3modal.org.
// Under `vitepress build` (SSR) this module is evaluated server-side, so an
// unguarded call would hit that endpoint on every build (slow, network-bound,
// and pointless — the modal is browser-only).
if (typeof window !== 'undefined') {
  createAppKit({
    adapters: [wagmiAdapter],
    networks: networks,
    projectId,
    featuredWalletIds,
    features: {
      socials: false,
      email: false,
    },
    allWallets: 'HIDE',
    allowUnsupportedChain: false,
    enableWalletGuide: false,
  });
}
