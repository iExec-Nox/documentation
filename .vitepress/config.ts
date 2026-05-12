import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitepress';
import { fileURLToPath, URL } from 'node:url';
import { createRequire } from 'node:module';
import path from 'node:path';

// Resolve node_modules location dynamically so the config works from both the
// main repo root and any nested git worktree (where node_modules lives in the
// parent repo rather than alongside the worktree checkout).
const _require = createRequire(import.meta.url);
const nodeModulesRoot = path.resolve(
  _require.resolve('vitepress/package.json'),
  '../..'
);
const root = fileURLToPath(new URL('..', import.meta.url));
import { getSidebar } from './sidebar';
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons';
import { withMermaid } from 'vitepress-plugin-mermaid';
import markdownSteps from 'markdown-it-steps';

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: 'Nox documentation',
    description:
      'Build decentralized applications that combine ownership, privacy, and monetization.',
    base: '/nox-protocol/',
    cleanUrls: true,
    lastUpdated: true,
    vite: {
      plugins: [tailwindcss(), groupIconVitePlugin()],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('../src', import.meta.url)),
        },
      },
      server: {
        fs: {
          allow: [root, nodeModulesRoot],
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
      ['link', { rel: 'icon', href: '/nox-protocol/Logo-RLC-Yellow.png' }],
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

      logo: {
        light: '/Logo-RLC-Yellow.png',
        dark: '/Logo-RLC-Yellow.png',
        alt: 'iExec logo',
      },
    },
  })
);
