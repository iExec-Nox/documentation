import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitepress';
import { loadEnv, createLogger } from 'vite';
import { fileURLToPath, URL } from 'node:url';

// `vitepress build` does not inject .env.local into the SSR bundle's
// import.meta.env, so the chain switcher's wagmi config would throw at build
// time. Load the VITE_* vars (notably VITE_REOWN_PROJECT_ID) into process.env
// here so they are available to both `dev` and `build`.
Object.assign(
  process.env,
  loadEnv(process.env.NODE_ENV || '', process.cwd(), 'VITE_')
);

// Silence a harmless dev-only Vite warning: `ox` (a viem dependency) ships an
// experimental `tempo` module that does a Node-only
// `import("node:worker_threads")`, which Vite cannot statically analyze. That
// code path never runs in the browser and does not affect the build.
const viteLogger = createLogger();
const isOxTempoNoise = (msg: string) =>
  typeof msg === 'string' && msg.includes('node:worker_threads');
const originalWarn = viteLogger.warn.bind(viteLogger);
viteLogger.warn = (msg, options) => {
  if (isOxTempoNoise(msg)) return;
  originalWarn(msg, options);
};
const originalWarnOnce = viteLogger.warnOnce.bind(viteLogger);
viteLogger.warnOnce = (msg, options) => {
  if (isOxTempoNoise(msg)) return;
  originalWarnOnce(msg, options);
};
import { getSidebar } from './sidebar';
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons';
import { withMermaid } from 'vitepress-plugin-mermaid';
import markdownSteps from 'markdown-it-steps';
import llmstxt from 'vitepress-plugin-llms';

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: 'Nox documentation',
    description:
      'Build decentralized applications that combine ownership, privacy, and monetization.',
    base: '/',
    cleanUrls: true,
    lastUpdated: true,
    vite: {
      customLogger: viteLogger,
      plugins: [tailwindcss(), groupIconVitePlugin(), llmstxt()],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('../src', import.meta.url)),
        },
      },
    },
    srcDir: './src',
    markdown: {
      codeTransformers: [transformerTwoslash()],
      config(md) {
        md.use(groupIconMdPlugin);
        md.use(markdownSteps);
      },
    },

    head: [
      // Google Tag Manager
      [
        'script',
        {},
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://metrics.iex.ec/bs7fgjd8lvy4l31.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-P7KSD4T');`,
      ],
      ['link', { rel: 'icon', href: '/Logo-RLC-Yellow.png' }],
      [
        'link',
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Mulish:wght@400;600;700;800&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
        },
      ],
      [
        'script',
        {},
        `
      window.axeptioSettings = {
        clientId: "6413111857e4d2a6342cd5c6",
        cookiesVersion: "iexec-en",
      };

      (function(d, s) {
        var t = d.getElementsByTagName(s)[0], e = d.createElement(s);
        e.async = true; e.src = "//static.axept.io/sdk.js";
        t.parentNode.insertBefore(e, t);
      })(document, "script");
      `,
      ],
      // Mava widget
      [
        'script',
        {
          defer: '',
          src: 'https://widget.mava.app',
          'widget-version': 'v2',
          id: 'MavaWebChat',
          'enable-sdk': 'false',
          'data-token':
            '8e4e10aad5750451e8726768e8c639dae54f461beeb176f5ebd687371c9390f2',
        },
      ],
      // Hotjar Tracking Script
      [
        'script',
        {},
        `
      (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:5303222,hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `,
      ],
    ],

    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
        {
          text: 'Get Started',
          link: '/getting-started/welcome',
          activeMatch: '^/getting-started/',
        },
        {
          text: 'Guides',
          link: '/guides/build-confidential-smart-contracts/intro',
          activeMatch: '^/guides/',
        },
        {
          text: 'Protocol',
          link: '/protocol/global-architecture-overview',
          activeMatch: '^/(protocol|references)/',
        },
        {
          component: 'ChainSelector',
          props: { className: 'w-48' },
        },
      ],
      outline: {
        level: [2, 4],
      },
      footer: {
        copyright: '© All Rights Reserved iExec 2018-present',
      },

      sidebar: getSidebar(),

      search: {
        provider: 'local',
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/iExec-Nox' },
        { icon: 'x', link: 'https://x.com/iEx_ec' },
        { icon: 'discord', link: 'https://discord.com/invite/5TewNUnJHN' },
      ],

      editLink: {
        pattern: 'https://github.com/iExec-Nox/documentation/blob/main/:path',
        text: 'Suggest changes to this page',
      },

      siteTitle: false,

      // The home page (/) only redirects to /getting-started/welcome server-side
      // (vercel.json). Clicking the logo is an in-app SPA navigation that never
      // hits the server, so point it straight at Welcome to avoid landing on the
      // bare fallback page.
      logoLink: '/getting-started/welcome',

      logo: {
        light: '/Logo-RLC-Yellow.png',
        dark: '/Logo-RLC-Yellow.png',
        alt: 'iExec logo',
      },
    },
  })
);
