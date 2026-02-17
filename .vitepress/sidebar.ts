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
                text: 'Trivial Encryption',
                link: '/references/solidity-library/methods/available-methods#trivial-encryption',
              },
              {
                text: 'Handle Validation',
                link: '/references/solidity-library/methods/available-methods#handle-validation',
              },
              {
                text: 'Arithmetic',
                link: '/references/solidity-library/methods/available-methods#arithmetic',
              },
              {
                text: 'Safe Arithmetic',
                link: '/references/solidity-library/methods/available-methods#safe-arithmetic',
              },
              {
                text: 'Comparisons',
                link: '/references/solidity-library/methods/available-methods#comparisons',
              },
              {
                text: 'Conditional',
                link: '/references/solidity-library/methods/available-methods#conditional',
              },
              {
                text: 'Token Operations',
                link: '/references/solidity-library/methods/available-methods#token-operations',
              },
              {
                text: 'Access Control',
                link: '/references/solidity-library/methods/available-methods#access-control',
              },
              {
                text: 'Viewer Management',
                link: '/references/solidity-library/methods/available-methods#viewer-management',
              },
              {
                text: 'Public Decryption',
                link: '/references/solidity-library/methods/available-methods#public-decryption',
              },
            ],
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
            text: 'Protocol Vision',
            link: '/protocol/protocol-vision',
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
            text: 'Computation Primitives',
            link: '/protocol/computation-primitives',
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
