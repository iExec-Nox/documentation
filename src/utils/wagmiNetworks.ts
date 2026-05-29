import { AppKitNetwork, arbitrumSepolia } from '@reown/appkit/networks';

const wagmiNetworks = {
  arbitrumSepolia,
} satisfies Record<string, AppKitNetwork>;

export default wagmiNetworks;
