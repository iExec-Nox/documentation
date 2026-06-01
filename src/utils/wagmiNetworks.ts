import type { AppKitNetwork } from '@reown/appkit/networks';
import { arbitrumSepolia } from '@reown/appkit/networks';

const wagmiNetworks = {
  arbitrumSepolia,
} satisfies Record<string, AppKitNetwork>;

export default wagmiNetworks;
