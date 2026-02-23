import type { DefaultTheme } from 'vitepress';

export function getSidebar() {
  return {
    '/getting-started/': [
      {
        text: 'GET STARTED',
        items: [
          { text: 'Welcome', link: '/getting-started/welcome' },
          { text: 'Hello World', link: '/getting-started/hello-world' },
          {
            text: 'Developer',
            items: [
              { text: 'Release Note', link: '/getting-started/release-notes' },
              { text: 'Status', link: '/getting-started/status' },
            ],
          },
          { text: 'Use Cases', link: '/getting-started/use-cases' },
        ],
      },
    ],
    '/guides/': [
      {
        text: 'BUILD CONFIDENTIAL SMART CONTRACTS',
        items: [
          {
            text: 'Intro',
            link: '/guides/build-confidential-smart-contracts/intro',
          },
          {
            text: 'Hardhat',
            link: '/guides/build-confidential-smart-contracts/hardhat',
          },
          {
            text: 'Foundry',
            link: '/guides/build-confidential-smart-contracts/foundry',
          },
        ],
      },
      {
        text: 'BUILD CONFIDENTIAL TOKEN',
        items: [
          {
            text: 'Intro',
            link: '/guides/build-confidential-tokens/intro',
          },
          {
            text: 'ERC7984',
            link: '/guides/build-confidential-tokens/erc7984-token',
          },
          {
            text: 'ERC20 to ERC7984',
            link: '/guides/build-confidential-tokens/erc7984erc20wrapper',
          },
          {
            text: 'Demo',
            link: '/guides/build-confidential-tokens/swap',
          },
        ],
      },
    ],
    '/references/': [
      {
        text: 'JS SDK',
        link: '/references/js-sdk',
        items: [
          {
            text: 'Getting Started',
            link: '/references/js-sdk/getting-started',
          },
          {
            text: 'Methods',
            collapsed: true,
            items: [
              {
                text: 'encryptInput',
                link: '/references/js-sdk/methods/encryptInput',
              },
              {
                text: 'decrypt',
                link: '/references/js-sdk/methods/decrypt',
              },
            ],
          },
          {
            text: 'Advanced Configuration',
            link: '/references/js-sdk/advanced-configuration',
          },
        ],
      },
      {
        text: 'SOLIDITY LIBRARY',
        link: '/references/solidity-library',
        items: [
          {
            text: 'Getting Started',
            link: '/references/solidity-library/getting-started',
          },
          {
            text: 'Methods',
            collapsed: true,
            items: [
              {
                text: 'Available Methods',
                link: '/references/solidity-library/methods/available-methods',
              },
            ],
          },
          {
            text: 'Advanced Configuration',
            link: '/references/solidity-library/advanced-configuration',
          },
        ],
      },
      {
        text: '📖 Glossary',
        link: '/references/glossary',
      },
    ],
    '/protocol/': [
      {
        text: 'PROTOCOL',
        items: [
          {
            text: 'Global Architecture Overview',
            link: '/protocol/global-architecture-overview',
          },
          {
            text: 'Protocol Vision',
            link: '/protocol/protocol-vision',
          },
          {
            text: 'Nox Smart Contracts',
            link: '/protocol/nox-smart-contracts',
          },
          {
            text: 'Ingestor',
            link: '/protocol/ingestor',
          },
          {
            text: 'Runner',
            link: '/protocol/runner',
          },
          {
            text: 'Gateway',
            link: '/protocol/gateway',
          },
          {
            text: 'KMS',
            link: '/protocol/kms',
          },
          {
            text: 'Computation Primitives',
            link: '/protocol/computation-primitives',
          },
        ],
      },
    ],
  } as DefaultTheme.Sidebar;
}
