<script setup lang="ts">
import { withBase } from 'vitepress';

import heroImage from '@/assets/images/doc-landing.png';
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
      'Learn how to build Privacy-preserving decentralized applications (dApp) with iExec in this interactive guide.',
    link: 'https://docs.iex.ec/get-started/welcome',
    external: true,
  },
];
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Programmable<br />
            Privacy
          </h1>
          <p class="hero-tagline">
            Build, deploy, and govern confidential execution across Web3, with
            programmable access control and hardware-enforced computation.
          </p>
        </div>
        <div class="hero-image-container">
          <img
            src="/bg-gradient.svg"
            alt=""
            aria-hidden="true"
            class="hero-gradient"
          />
          <img :src="heroImage" alt="Nox Protocol" class="hero-image" />
        </div>
      </div>
    </section>

    <!-- Protocol Cards -->
    <section class="section-container">
      <div class="protocol-cards">
        <a
          v-for="card in protocolCards"
          :key="card.title"
          :href="card.external ? card.link : withBase(card.link)"
          :target="card.external ? '_blank' : undefined"
          :rel="card.external ? 'noopener' : undefined"
          class="protocol-card"
        >
          <div class="protocol-card-header">
            <div class="icon-box">
              <img :src="card.icon" :alt="card.title" class="icon-img" />
            </div>
            <div class="protocol-card-titles">
              <h3 class="protocol-card-title">{{ card.title }}</h3>
              <span class="protocol-card-subtitle">{{ card.subtitle }}</span>
            </div>
          </div>
          <p class="protocol-card-desc">{{ card.description }}</p>
        </a>
      </div>

      <!-- Build confidential and programmable financial logic -->
      <div class="feature-section">
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
            <div class="feature-card-header">
              <div class="icon-box">
                <img
                  :src="feature.icon"
                  :alt="feature.title"
                  class="icon-img"
                />
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
            </div>
            <p class="feature-desc">{{ feature.description }}</p>
          </a>
        </div>
      </div>

      <!-- Build Privacy dApps faster -->
      <div class="feature-section">
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
            <div class="feature-card-header">
              <div class="icon-box">
                <img
                  :src="feature.icon"
                  :alt="feature.title"
                  class="icon-img"
                />
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
            </div>
            <p class="feature-desc">{{ feature.description }}</p>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
/* Override VitePress container constraints for homepage */
.VPHome .vp-doc.container {
  max-width: 100%;
  padding: 0;
}
</style>

<style scoped>
/* ============ Hero ============ */

.hero {
  padding: 0 80px;
  margin-bottom: 52px;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  margin: 0 auto;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 459px;
  flex-shrink: 0;
}

.hero-title {
  font-family: 'Mulish', sans-serif;
  font-size: 56px;
  font-weight: 800;
  line-height: 64px;
  letter-spacing: 0.112px;
  color: var(--vp-c-text-1);
  margin: 0;
  border: none;
  padding: 0;
}

.hero-tagline {
  font-family: 'Mulish', sans-serif;
  font-size: 24px;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0.2px;
  color: #303038;
  margin: 0;
}

.dark .hero-tagline {
  color: var(--vp-c-text-2);
}

/*
 * Figma "Image Header": 667x608
 * - Gradient box (608x608) at left=0
 * - Image (587x574) at left=80, top=8
 * The gradient SVG overflows the 608 box via negative inset.
 */
.hero-image-container {
  position: relative;
  width: 667px;
  height: 608px;
  flex-shrink: 0;
}

.hero-gradient {
  position: absolute;
  top: calc(608px * -0.3595);
  left: calc(608px * -0.3595);
  width: calc(608px * 1.719);
  height: calc(608px * 1.719);
  pointer-events: none;
}

.hero-image {
  position: absolute;
  top: calc(7.92px + 573.79px / 2);
  left: calc(79.95px + 587.17px / 2);
  width: 500px;
  height: auto;
  transform: translate(-50%, -50%) rotate(11.65deg);
  pointer-events: none;
}

@media (max-width: 1200px) {
  .hero-image-container {
    width: 440px;
    height: 400px;
  }

  .hero-gradient {
    top: calc(400px * -0.3595);
    left: calc(400px * -0.3595);
    width: calc(400px * 1.719);
    height: calc(400px * 1.719);
  }

  .hero-image {
    top: 50%;
    left: 55%;
    width: 340px;
  }
}

@media (max-width: 960px) {
  .hero {
    padding: 0 24px;
  }

  .hero-content {
    flex-direction: column;
    gap: 40px;
    text-align: center;
  }

  .hero-text {
    max-width: 100%;
    align-items: center;
  }

  .hero-title {
    font-size: 40px;
    line-height: 48px;
  }

  .hero-tagline {
    font-size: 18px;
    line-height: 24px;
  }

  .hero-image-container {
    width: 320px;
    height: 320px;
  }

  .hero-gradient {
    top: calc(320px * -0.3595);
    left: calc(320px * -0.3595);
    width: calc(320px * 1.719);
    height: calc(320px * 1.719);
  }

  .hero-image {
    top: 50%;
    left: 55%;
    width: 280px;
  }
}

/* ============ Section Container ============ */

.section-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 80px 41px;
}

@media (max-width: 960px) {
  .section-container {
    padding: 0 24px 24px;
  }
}

/* ============ Icon Box ============ */

.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  box-shadow:
    -13px -13px 21px 0 #fff,
    13px 13px 21px 0 #d1d9e6;
}

.dark .icon-box {
  box-shadow:
    -13px -13px 21px 0 rgba(255, 255, 255, 0.05),
    13px 13px 21px 0 rgba(0, 0, 0, 0.4);
}

.icon-img {
  width: 36px;
  height: 36px;
}

/* ============ Protocol Cards ============ */

.protocol-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-bottom: 52px;
}

@media (min-width: 768px) {
  .protocol-cards {
    grid-template-columns: 1fr 1fr;
  }
}

.protocol-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 40px;
  min-height: 321px;
  border-radius: 32px;
  border: 1px solid #fff;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition:
    box-shadow 0.3s,
    border-color 0.3s;
}

.dark .protocol-card {
  border-color: var(--vp-c-border);
}

.protocol-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-1);
}

.protocol-card-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.protocol-card-titles {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.protocol-card-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--vp-c-text-1);
  margin: 0;
}

.protocol-card-subtitle {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--vp-c-text-1);
}

.protocol-card-desc {
  font-size: 18px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  margin: 0;
}

@media (max-width: 767px) {
  .protocol-card {
    padding: 24px;
  }

  .protocol-card-title {
    font-size: 24px;
  }

  .protocol-card-subtitle {
    font-size: 16px;
  }

  .protocol-card-desc {
    font-size: 15px;
  }
}

/* ============ Feature Sections ============ */

.feature-section {
  margin-bottom: 52px;
}

.feature-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 64px;
  letter-spacing: 0.064px;
  color: var(--vp-c-text-1);
  margin-bottom: 20px;
  border: none;
  padding: 0;
}

@media (max-width: 767px) {
  .section-title {
    font-size: 22px;
    line-height: 1.3;
  }
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .feature-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 40px;
  min-height: 281px;
  border-radius: 32px;
  border: 1px solid #fff;
  background: rgba(247, 249, 253, 0.45);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition:
    box-shadow 0.3s,
    border-color 0.3s;
}

.dark .feature-card {
  background: rgba(23, 23, 30, 0.45);
  border-color: var(--vp-c-border);
}

.feature-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-1);
}

.feature-card-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.feature-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--vp-c-text-1);
  margin: 0;
}

.feature-desc {
  font-size: 18px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  margin: 0;
}

@media (max-width: 767px) {
  .feature-card {
    padding: 24px;
  }

  .feature-title {
    font-size: 16px;
  }

  .feature-desc {
    font-size: 15px;
  }
}

/* ============ Footer ============ */

.home-footer {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 80px;
  text-align: center;
}

.footer-text {
  font-family: 'Mulish', sans-serif;
  font-size: 14px;
  color: var(--vp-c-text-1);
  margin: 0;
}

@media (max-width: 960px) {
  .home-footer {
    padding: 24px;
  }
}
</style>
