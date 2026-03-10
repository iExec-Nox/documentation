<script setup lang="ts">
import { withBase } from 'vitepress';

import noxIcon from '@/assets/icons/nox.svg';
import pocoIcon from '@/assets/icons/poco.svg';
import ctokenIcon from '@/assets/icons/ctoken.svg';
import smartContractsIcon from '@/assets/icons/smart-contracts.svg';
import helloWorldIcon from '@/assets/icons/hello-world.svg';
import teeIcon from '@/assets/icons/tee.svg';
import govIcon from '@/assets/icons/gov.svg';

const protocolCards = [
  {
    icon: noxIcon,
    title: 'Nox Protocol',
    subtitle: 'Confidential DeFi',
    description:
      'Nox is a privacy layer that empowers smart contracts with confidential computation. Encrypted types are executed inside Trusted Execution Environments (TEE), composable with DeFi, without ever exposing plaintext on-chain.',
    link: '/getting-started/welcome',
    external: false,
  },
  {
    icon: pocoIcon,
    title: 'iExec PoCo',
    subtitle: 'Off-chain Privacy',
    description:
      'PoCo is a trust and coordination layer that secures off-chain execution in Trusted Execution Environments (TEE), enforcing correctness, privacy, and clear economic governance.',
    link: 'https://docs.iex.ec/get-started/welcome',
    external: true,
  },
];

const financialFeatures = [
  {
    icon: ctokenIcon,
    title: 'Confidential Token',
    description: 'Transform any ERC-20 into a confidential asset.',
    link: '/guides/build-confidential-tokens/erc7984-token',
  },
  {
    icon: smartContractsIcon,
    title: 'Confidential Smart Contracts',
    description: 'Write standard Solidity contracts using the Nox Library.',
    link: '/guides/build-confidential-smart-contracts/hardhat',
  },
  {
    icon: helloWorldIcon,
    title: 'Nox Hello World',
    description: 'Learn how to build on Nox with the Hello World guide.',
    link: '/getting-started/hello-world',
  },
];

const dappFeatures = [
  {
    icon: teeIcon,
    title: 'Bootstrap on TEE',
    description:
      'Generate and deploy dApps that gives you access to TEEs in just a few minutes with ready-to-use code.',
    link: '/protocol/global-architecture-overview',
  },
  {
    icon: govIcon,
    title: 'Governance & Ownership',
    description:
      'Choose who can access your data, with which privacy applications, and at what price.',
    link: '/guides/manage-handle-access/intro',
  },
  {
    icon: noxIcon,
    title: 'Privacy Hello World',
    description:
      'Learn how to build Privacy preserving decentralized applications (dApp) with iExec in this interactive guide.',
    link: 'https://docs.iex.ec/get-started/welcome',
    external: true,
  },
];
</script>

<template>
  <div class="home-custom">
    <!-- Protocol Cards -->
    <div class="protocol-cards">
      <component
        v-for="card in protocolCards"
        :key="card.title"
        :is="card.external ? 'a' : 'a'"
        :href="card.external ? card.link : withBase(card.link)"
        :target="card.external ? '_blank' : undefined"
        :rel="card.external ? 'noopener' : undefined"
        class="protocol-card"
      >
        <div class="protocol-card-header">
          <img
            :src="card.icon"
            :alt="card.title"
            class="protocol-card-icon"
          />
          <div>
            <h3 class="protocol-card-title">{{ card.title }}</h3>
            <span class="protocol-card-subtitle">{{ card.subtitle }}</span>
          </div>
        </div>
        <p class="protocol-card-desc">{{ card.description }}</p>
      </component>
    </div>

    <!-- Build confidential and programmable financial logic -->
    <section class="feature-section">
      <h2 class="section-title">
        Build confidential and programmable financial logic
      </h2>
      <div class="feature-grid">
        <a
          v-for="feature in financialFeatures"
          :key="feature.title"
          :href="withBase(feature.link)"
          class="feature-card"
        >
          <div class="feature-icon-wrapper">
            <img
              :src="feature.icon"
              :alt="feature.title"
              class="feature-icon"
            />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.description }}</p>
        </a>
      </div>
    </section>

    <!-- Build Privacy dApps faster -->
    <section class="feature-section">
      <h2 class="section-title">Build Privacy dApps faster</h2>
      <div class="feature-grid">
        <a
          v-for="feature in dappFeatures"
          :key="feature.title"
          :href="feature.external ? feature.link : withBase(feature.link)"
          :target="feature.external ? '_blank' : undefined"
          :rel="feature.external ? 'noopener' : undefined"
          class="feature-card"
        >
          <div class="feature-icon-wrapper">
            <img
              :src="feature.icon"
              :alt="feature.title"
              class="feature-icon"
            />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.description }}</p>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-custom {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px 64px;
}

@media (min-width: 640px) {
  .home-custom {
    padding: 0 48px 96px;
  }
}

@media (min-width: 960px) {
  .home-custom {
    padding: 0 64px 96px;
  }
}

/* Protocol Cards */
.protocol-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 64px;
}

@media (min-width: 640px) {
  .protocol-cards {
    grid-template-columns: 1fr 1fr;
  }
}

.protocol-card {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-gutter);
  background: var(--vp-c-bg-soft);
  transition: all 0.25s;
}

.protocol-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(24, 62, 233, 0.08);
}

.protocol-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.protocol-card-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.protocol-card-title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}

.protocol-card-subtitle {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.protocol-card-desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* Feature Sections */
.feature-section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 24px;
  border: none;
  padding: 0;
  letter-spacing: -0.02em;
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .feature-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-gutter);
  background: var(--vp-c-bg);
  transition: all 0.25s;
}

.feature-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(24, 62, 233, 0.08);
}

.feature-icon-wrapper {
  margin-bottom: 16px;
}

.feature-icon {
  width: 36px;
  height: 36px;
}

.feature-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.feature-desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* Dark mode adjustments */
:global(.dark) .protocol-card {
  border-color: rgba(255, 255, 255, 0.08);
}

:global(.dark) .protocol-card:hover {
  box-shadow: 0 4px 16px rgba(162, 179, 255, 0.08);
}

:global(.dark) .feature-card {
  border-color: rgba(255, 255, 255, 0.08);
  background: var(--vp-c-bg-soft);
}

:global(.dark) .feature-card:hover {
  box-shadow: 0 4px 16px rgba(162, 179, 255, 0.08);
}
</style>
