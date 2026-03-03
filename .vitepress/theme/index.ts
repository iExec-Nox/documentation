// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client';
import Layout from './Layout.vue';
import Required from './components/Required.vue';
import Optional from './components/Optional.vue';
import type { EnhanceAppContext } from 'vitepress';
import googleAnalytics from 'vitepress-plugin-google-analytics';
import 'virtual:group-icons.css';
import '@shikijs/vitepress-twoslash/style.css';
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
    app.component('Required', Required);
    app.component('Optional', Optional);
    app.use(TwoslashFloatingVue as any);

    googleAnalytics({
      id: 'GTM-P7KSD4T',
    });

    if (typeof window !== 'undefined') {
      // Mermaid diagram zoom modal
      const modal = document.createElement('div');
      modal.className = 'mermaid-zoom-modal';
      document.body.appendChild(modal);

      modal.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
          modal.classList.remove('open');
          document.body.style.overflow = '';
        }
      });

      document.addEventListener('click', (event) => {
        const target = event.target as Element;
        const mermaidContainer = target.closest('.mermaid');
        if (mermaidContainer) {
          const svg = mermaidContainer.querySelector('svg');
          if (svg) {
            const clone = svg.cloneNode(true) as SVGElement;
            clone.removeAttribute('width');
            clone.removeAttribute('height');
            modal.innerHTML = '';
            modal.appendChild(clone);
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
          }
        }
      });

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
