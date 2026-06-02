import type { DefaultTheme } from 'vitepress';

function getStartedItems(active: boolean): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Welcome', link: '/getting-started/welcome' },
    { text: 'Hello World', link: '/getting-started/hello-world' },
    {
      text: 'Use Cases',
      link: '/getting-started/use-cases',
      collapsed: !active,
      items: [
        {
          text: 'Confidential Vault',
          link: '/getting-started/use-cases/confidential-vault',
        },
        {
          text: 'DeFi Capital Allocator',
          link: '/getting-started/use-cases/defi-allocator',
        },
        {
          text: 'RWA Issuance & Distribution',
          link: '/getting-started/use-cases/rwa',
        },
      ],
    },
    { text: 'Use AI to build on NOX', link: '/getting-started/use-ai' },
    { text: 'Status', link: '/getting-started/status' },
  ];
}

function guidesItems(active: boolean): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Build Confidential Smart Contracts',
      link: '/guides/build-confidential-smart-contracts/intro',
      collapsed: !active,
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
      text: 'Build Confidential Token',
      link: '/guides/build-confidential-tokens/intro',
      collapsed: !active,
      items: [
        {
          text: 'ERC7984',
          link: '/guides/build-confidential-tokens/erc7984-token',
        },
        {
          text: 'ERC20 to ERC7984',
          link: '/guides/build-confidential-tokens/erc20-to-erc7984-wrapper',
        },
        {
          text: 'Live Demo',
          link: '/guides/build-confidential-tokens/demo',
        },
      ],
    },
    {
      text: 'Accepting Private User Inputs',
      link: '/guides/accept-user-inputs',
    },
    {
      text: 'Manage Handle Access',
      link: '/guides/manage-handle-access/intro',
      collapsed: !active,
      items: [
        {
          text: 'Transient Access',
          link: '/guides/manage-handle-access/transient-access',
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
  ];
}

function referencesItems(active: boolean): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'JS SDK',
      link: '/references/js-sdk',
      collapsed: !active,
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
      text: 'Solidity Library',
      link: '/references/solidity-library',
      collapsed: !active,
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
              text: 'Wrap as Public Handle',
              link: '/references/solidity-library/methods/core-primitives/wrap-as-public-handle',
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
}

const protocolItems: DefaultTheme.SidebarItem[] = [
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
];

function buildSidebar(
  activeSection: 'getting-started' | 'guides' | 'references' | 'protocol'
): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Get Started',
      items: getStartedItems(activeSection === 'getting-started'),
    },
    {
      text: 'Guides',
      items: guidesItems(activeSection === 'guides'),
    },
    {
      text: 'References',
      items: referencesItems(activeSection === 'references'),
    },
    {
      text: 'Protocol',
      items: protocolItems,
    },
    {
      text: 'Glossary',
      link: '/references/glossary',
    },
  ];
}

export function getSidebar(): DefaultTheme.Sidebar {
  return {
    '/getting-started/': buildSidebar('getting-started'),
    '/guides/': buildSidebar('guides'),
    '/references/': buildSidebar('references'),
    '/protocol/': buildSidebar('protocol'),
  };
}
