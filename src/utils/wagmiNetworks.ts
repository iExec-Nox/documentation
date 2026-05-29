import type { AppKitNetwork } from '@reown/appkit/networks';
import { arbitrumSepolia, sepolia } from '@reown/appkit/networks';

const wagmiNetworks = {
  arbitrumSepolia,
  sepolia,
} satisfies Record<string, AppKitNetwork>;

export default wagmiNetworks;
