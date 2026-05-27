import {
  AppKitNetwork,
  arbitrumSepolia,
  sepolia,
} from '@reown/appkit/networks';

const wagmiNetworks = {
  arbitrumSepolia,
  sepolia,
} satisfies Record<string, AppKitNetwork>;

export default wagmiNetworks;
