import type { DefaultTheme } from 'vitepress';

const referenceItems: DefaultTheme.SidebarItem[] = [
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
            text: 'publicDecrypt',
            link: '/references/js-sdk/methods/publicDecrypt',
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
    text: 'SOLIDITY LIBRARY',
    link: '/references/solidity-library',
    items: [
      {
        text: 'Getting Started',
        link: '/references/solidity-library/getting-started',
      },
      {
        text: 'Core Primitives',
        collapsed: true,
        items: [
          {
            text: 'Plaintext to Encrypted',
            link: '/references/solidity-library/methods/core-primitives/plaintext-to-encrypted',
          },
          {
            text: 'fromExternal',
            link: '/references/solidity-library/methods/core-primitives/fromExternal',
          },
          {
            text: 'Arithmetic',
            link: '/references/solidity-library/methods/core-primitives/arithmetic',
          },
          {
            text: 'Safe Arithmetic',
            link: '/references/solidity-library/methods/core-primitives/safe-arithmetic',
          },
          {
            text: 'Comparisons',
            link: '/references/solidity-library/methods/core-primitives/comparisons',
          },
          {
            text: 'select',
            link: '/references/solidity-library/methods/core-primitives/select',
          },
          {
            text: 'Access Control',
            link: '/references/solidity-library/methods/core-primitives/access-control',
          },
        ],
      },
      {
        text: 'Advanced Functions',
        collapsed: true,
        items: [
          {
            text: 'Token Operations',
            link: '/references/solidity-library/methods/advanced/token-operations',
          },
        ],
      },
    ],
  },
];

const protocolItems: DefaultTheme.SidebarItem[] = [
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
        text: 'Handle Gateway',
        link: '/protocol/handle-gateway',
      },
      {
        text: 'KMS',
        link: '/protocol/kms',
      },
    ],
  },
];

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
            text: 'Live Demo',
            link: '/guides/build-confidential-tokens/demo',
          },
        ],
      },
      {
        text: 'MANAGE HANDLE ACCESS',
        items: [
          {
            text: 'Intro',
            link: '/guides/manage-handle-access/intro',
          },
          {
            text: 'Manage Viewers',
            link: '/guides/manage-handle-access/viewers',
          },
          {
            text: 'Manage Admins',
            link: '/guides/manage-handle-access/admins',
          },
          {
            text: 'Manage Public Decryption',
            link: '/guides/manage-handle-access/public-decryption',
          },
        ],
      },
    ],
    '/references/': [
      ...referenceItems,
      ...protocolItems,
      { text: '📖 Glossary', link: '/references/glossary' },
    ],
    '/protocol/': [
      ...referenceItems,
      ...protocolItems,
      { text: '📖 Glossary', link: '/references/glossary' },
    ],
  } as DefaultTheme.Sidebar;
}
