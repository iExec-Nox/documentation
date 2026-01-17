// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client';
import Layout from './Layout.vue';
import type { EnhanceAppContext } from 'vitepress';
import googleAnalytics from 'vitepress-plugin-google-analytics';
import 'virtual:group-icons.css';
import '@shikijs/vitepress-twoslash/style.css';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { WagmiPlugin } from '@wagmi/vue';
import { createPinia } from 'pinia';
import { wagmiAdapter } from '@/utils/wagmiConfig';
import ChainSelector from '@/components/ChainSelector.vue';
import './style.css';

declare global {
  interface Window {
    dataLayer: any[];
    axeptioSettings: {
      clientId: string;
      cookiesVersion: string;
    };
  }
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue as any);

    const queryClient = new QueryClient();
    const pinia = createPinia();

    app.use(pinia);
    app.use(VueQueryPlugin, { queryClient });

    app.use(WagmiPlugin, { config: wagmiAdapter.wagmiConfig });

    app.component('ChainSelector', ChainSelector);

    googleAnalytics({
      id: 'GTM-P7KSD4T',
    });

    if (typeof window !== 'undefined') {
      // Ensure dataLayer exists
      window.dataLayer = window.dataLayer || [];

      // Define a map of event types and their corresponding actions
      const eventMap = {
        connectWallet: 'hw_connectWallet',
        protectData: 'hw_protectData',
        grantAccess: 'hw_grantAccess',
      };

      // Add a global click listener
      document.addEventListener('click', (event) => {
        if (event.target instanceof Element) {
          // Iterate through eventMap to check which event matches
          Object.keys(eventMap).forEach((key) => {
            if ((event.target as Element).matches(`[data-track="${key}"]`)) {
              window.dataLayer.push({
                event: eventMap[key],
              });
            }
          });
        }
      });
    }
  },
} satisfies Theme;
