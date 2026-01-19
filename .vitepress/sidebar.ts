import type { DefaultTheme } from 'vitepress';

export function getSidebar() {
  return {
    '/overview/': [
      {
        text: 'OVERVIEW',
        items: [
          { text: 'Introduction', link: '/overview/introduction' },
          { text: 'Hello World', link: '/overview/hello-world' },
          { text: 'Developer Resources', link: '/overview/developer' },
          { text: 'Support', link: '/overview/support' },
          { text: 'Manifesto', link: '/overview/manifesto' },
          { text: 'Release Notes', link: '/overview/release-notes' },
          { text: 'Status', link: '/overview/status' },
          { text: 'Use Cases', link: '/overview/use-cases' },
        ],
      },
    ],
    '/guides/': [
      {
        text: 'BUILD CONFIDENTIAL SMART CONTRACTS',
        items: [
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
        text: 'BUILD CONFIDENTIAL TOKENS',
        items: [
          {
            text: 'ERC7984 Token',
            link: '/guides/build-confidential-tokens/erc7984-token',
          },
          {
            text: 'ERC7984ERC20Wrapper',
            link: '/guides/build-confidential-tokens/erc7984erc20wrapper',
          },
          {
            text: 'Swap',
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
              {
                text: 'viewACL',
                link: '/references/js-sdk/methods/viewACL',
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
        text: 'Solidity Library',
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
            link: '/references/handle-sdk/advanced-configuration',
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
            text: 'Nox Long-Term Vision',
            link: '/protocol/nox-long-term-vision',
          },
          {
            text: 'Global Architecture Overview',
            link: '/protocol/global-architecture-overview',
          },
          {
            text: 'KMS',
            link: '/protocol/kms',
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
            text: 'Ingestor',
            link: '/protocol/ingestor',
          },
          {
            text: 'Nox Smart Contracts',
            link: '/protocol/nox-smart-contracts',
          },
        ],
      },
    ],
  } as DefaultTheme.Sidebar;
}
