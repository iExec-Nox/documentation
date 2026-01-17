import type { DefaultTheme } from 'vitepress';

export function getSidebar() {
  return {
    '/get-started/': [
      {
        text: 'OVERVIEW',
        items: [
          { text: 'Welcome', link: '/get-started/welcome' },
          { text: 'HelloWorld', link: '/get-started/helloworld' },
        ],
      },
      {
        text: 'BUILD CONFIDENTIAL SMART CONTRACTS',
        items: [
          {
            text: 'Hardhat',
            link: '/get-started/build-confidential-smart-contracts/hardhat',
          },
          {
            text: 'Foundry',
            link: '/get-started/build-confidential-smart-contracts/foundry',
          },
        ],
      },
      {
        text: 'BUILD CONFIDENTIAL TOKENS',
        items: [
          {
            text: 'ERC7984 Token',
            link: '/get-started/build-confidential-tokens/erc7984-token',
          },
          {
            text: 'ERC7984ERC20Wrapper',
            link: '/get-started/build-confidential-tokens/erc7984erc20wrapper',
          },
          {
            text: 'Swap',
            link: '/get-started/build-confidential-tokens/swap',
          },
        ],
      },
    ],
    '/references/': [
      {
        text: 'Handle SDK',
        link: '/references/handle-sdk',
        items: [
          {
            text: 'Getting Started',
            link: '/references/handle-sdk/getting-started',
          },
          {
            text: 'Methods',
            collapsed: true,
            items: [
              {
                text: 'encryptInput',
                link: '/references/handle-sdk/methods/encryptInput',
              },
              {
                text: 'decrypt',
                link: '/references/handle-sdk/methods/decrypt',
              },
              {
                text: 'viewACL',
                link: '/references/handle-sdk/methods/viewACL',
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
