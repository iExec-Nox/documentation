---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  text: 'Composable Privacy for DeFi'
  tagline:
    'The first truly on-chain composable privacy layer — multichain,
    multi-privacy. Like HTTPS made secure connections invisible, Nox makes
    privacy the default.'
  image:
    src: /illustration-large.webp
    alt: Nox Protocol
  actions:
    - theme: brand
      text: Get Started
      link: /get-started/welcome
    - theme: alt
      text: Hello World Tutorial
      link: /get-started/helloworld

features:
  - icon:
      <svg class="_stroke" width="36" height="36" viewBox="0 0 36 36"
      fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.81
      29.1774H8.8733C7.84604 29.1774 6.86085 28.7694 6.13446 28.043C5.40808
      27.3166 5 26.3314 5 25.3041V7.87428C5 6.84702 5.40808 5.86183 6.13446
      5.13544C6.86085 4.40906 7.84604 4.00098 8.8733 4.00098H26.3032C27.3304
      4.00098 28.3156 4.40906 29.042 5.13544C29.7684 5.86183 30.1765 6.84702
      30.1765 7.87428V9.81093" stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round"/> <path d="M22.5187 8.82727L10.9795
      22.6743H21.3648L20.2109 31.9057L31.7501 18.0586H21.3648L22.5187 8.82727Z"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>
    title: Quick Start
    details:
      Deploy your first confidential smart contract in minutes. One import, one
      function call — privacy becomes native.
    link: /get-started/helloworld
  - icon:
      <svg class="_stroke" width="38" height="36" viewBox="0 0 38 36"
      fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M5.16675
      10.5C5.16675 7.18629 7.85304 4.5 11.1667 4.5H26.1667C29.4805 4.5 32.1667
      7.18629 32.1667 10.5V25.5C32.1667 28.8137 29.4805 31.5 26.1667
      31.5H11.1667C7.85304 31.5 5.16675 28.8137 5.16675 25.5V10.5Z"
      stroke-width="2"/> <path d="M11.6667 12L11.6667 24" stroke-width="2"
      stroke-linecap="round"/> <path d="M15.6667 16.5L15.6667 24"
      stroke-width="2" stroke-linecap="round"/> <path d="M19.6667 25C19.6667
      21.6863 22.353 19 25.6667 19C28.9805 19 31.6667 21.6863 31.6667 25C31.6667
      28.3137 28.9805 31 25.6667 31C22.353 31 19.6667 28.3137 19.6667 25Z"
      stroke-width="2"/> <path d="M28.6667 20V16C28.6667 14.3431 27.3236 13
      25.6667 13C24.0099 13 22.6667 14.3431 22.6667 16V20" stroke-width="2"/>
      <path d="M25.6667 23.9996V25.9996" stroke-width="2"
      stroke-linecap="round"/> </svg>
    title: Confidential Smart Contracts
    details:
      Add privacy to your contracts with simple Solidity primitives. No
      specialized wallets, no off-chain steps — just native composability.
    link: /get-started/build-confidential-smart-contracts/hardhat
  - icon:
      <svg class="_stroke" width="37" height="36" viewBox="0 0 37 36"
      fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M7.8335 9C7.8335
      6.51472 9.84821 4.5 12.3335 4.5H20.0909C20.8865 4.5 21.6496 4.81607
      22.2122 5.37868L27.9548 11.1213C28.5174 11.6839 28.8335 12.447 28.8335
      13.2426V27C28.8335 29.4853 26.8188 31.5 24.3335 31.5H12.3335C9.84822 31.5
      7.8335 29.4853 7.8335 27V9Z" stroke-width="2"/> <path d="M19.8335
      4V7C19.8335 10.3137 22.5198 13 25.8335 13H28.8335" stroke-width="2"/>
      <path d="M16.2282 17.6052L12.8335 21L16.2282 24.3947" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round"/> <path d="M20.2283
      24.3947L23.623 21L20.2283 17.6052" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round"/> </svg>
    title: Confidential Tokens
    details:
      Build ERC-7984 compliant confidential tokens with hidden balances and
      private transfers. Wrap existing ERC20s or create native confidential
      assets.
    link: /get-started/build-confidential-tokens/erc7984-token
  - icon:
      <svg class="_stroke" width="36" height="36" viewBox="0 0 36 36"
      fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="4" y="4"
      width="28" height="28" rx="4" stroke-width="2"/> <path d="M12 18L16 22L24
      14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    title: Solidity Library
    details:
      Add privacy to your contracts in minutes. Familiar Solidity syntax with
      confidential primitives abstracted behind simple function calls.
    link: /references/solidity-library/getting-started
  - icon:
      <svg class="_stroke" width="37" height="36" viewBox="0 0 37 36"
      fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.5 4L32
      12V24L18.5 32L5 24V12L18.5 4Z" stroke-width="2" stroke-linejoin="round"/>
      <path d="M18.5 18V32" stroke-width="2"/> <path d="M5 12L18.5 18L32 12"
      stroke-width="2"/> <path d="M18.5 4V18" stroke-width="2"/> </svg>
    title: JS SDK
    details:
      Seamless client-side encryption. Handle encrypted inputs and decryption
      with a developer-friendly TypeScript SDK.
    link: /references/js-sdk/getting-started
  - icon:
      <svg class="_stroke" width="37" height="36" viewBox="0 0 37 36"
      fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="18.5" cy="18"
      r="14" stroke-width="2"/> <path d="M18.5 8V18L24.5 24" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"/> </svg>
    title: Protocol Architecture
    details:
      Understand how Nox enables confidential DeFi with TEE-based computation,
      distributed KMS, and on-chain ACL verification.
    link: /protocol/global-architecture-overview
---
