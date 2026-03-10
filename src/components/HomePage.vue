<script setup lang="ts">
import { withBase } from 'vitepress';

const noxCards = [
  {
    title: 'Confidential Token',
    description: 'Transform any ERC-20 into a confidential asset.',
    link: '/guides/build-confidential-tokens/erc7984-token',
    icon: 'token',
  },
  {
    title: 'Confidential Smart Contracts',
    description: 'Write standard Solidity contracts using the Nox Library.',
    link: '/guides/build-confidential-smart-contracts/hardhat',
    icon: 'code',
  },
  {
    title: 'Nox Hello World',
    description: 'Learn how to build on Nox with the Hello World guide.',
    link: '/getting-started/hello-world',
    icon: 'terminal',
  },
];

const dappCards = [
  {
    title: 'Bootstrap on TEE',
    description:
      'Generate and deploy dApps that give you access to TEEs in just a few minutes with ready-to-use code.',
    link: '#',
    icon: 'layers',
  },
  {
    title: 'Governance & Ownership',
    description:
      'Choose who can access your data, with which privacy applications, and at what price.',
    link: '#',
    icon: 'shield',
  },
  {
    title: 'Privacy Hello World',
    description:
      'Learn how to build Privacy-preserving decentralized applications (dApp) with iExec in this interactive guide.',
    link: '#',
    icon: 'rocket',
    accent: true,
  },
];
</script>

<template>
  <div class="homepage">
    <!-- Hero -->
    <section class="hero-section">
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
      <div class="hero-image">
        <img
          :src="withBase('/illustration-large.webp')"
          alt="Nox Protocol"
        />
      </div>
    </section>

    <!-- Protocol Cards -->
    <section class="section-container">
      <div class="protocol-grid">
          <!-- Nox Protocol -->
          <a :href="withBase('/getting-started/welcome')" class="protocol-card">
            <div class="protocol-card-header">
              <div class="protocol-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="protocol-card-title">Nox Protocol</h3>
                <p class="protocol-card-subtitle">Confidential DeFi</p>
              </div>
            </div>
            <p class="protocol-card-desc">
              Nox is a privacy layer that empowers smart contracts with
              confidential computation. Encrypted inputs are executed inside
              Trusted Execution Environments (TEE), composable with DeFi,
              without ever exposing plaintext on-chain.
            </p>
          </a>
          <!-- iExec PoCo -->
          <a href="https://docs.iex.ec/get-started/welcome" target="_blank" rel="noopener" class="protocol-card">
            <div class="protocol-card-header">
              <div class="protocol-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="2" y="2" width="20" height="8" rx="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" />
                  <circle cx="6" cy="6" r="0.5" fill="currentColor" />
                  <circle cx="6" cy="18" r="0.5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h3 class="protocol-card-title">iExec PoCo</h3>
                <p class="protocol-card-subtitle">Off-chain Privacy</p>
              </div>
            </div>
            <p class="protocol-card-desc">
              PoCo is a trust and coordination layer that secures off-chain
              execution in Trusted Execution Environments (TEE), enforcing
              correctness, privacy, and clear economic governance.
            </p>
          </a>
        </div>
    </section>

    <!-- Build confidential and programmable financial logic -->
    <section class="section-container">
      <h2 class="section-title">
        Build confidential and programmable financial logic
      </h2>
      <div class="cards-grid">
        <a
          v-for="card in noxCards"
          :key="card.title"
          :href="withBase(card.link)"
          class="feature-card"
        >
          <div class="feature-icon filled">
            <!-- Token icon -->
            <svg
              v-if="card.icon === 'token'"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v12" />
              <path d="M15.5 9.5a3.5 3.5 0 01-7 0" />
              <path d="M8.5 14.5a3.5 3.5 0 007 0" />
            </svg>
            <!-- Code icon -->
            <svg
              v-if="card.icon === 'code'"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <!-- Terminal icon -->
            <svg
              v-if="card.icon === 'terminal'"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
          </div>
          <h3 class="feature-card-title">{{ card.title }}</h3>
          <p class="feature-card-desc">{{ card.description }}</p>
        </a>
      </div>
    </section>

    <!-- Build Privacy dApps faster -->
    <section class="section-container section-last">
      <h2 class="section-title">Build Privacy dApps faster</h2>
      <div class="cards-grid">
        <a
          v-for="card in dappCards"
          :key="card.title"
          :href="withBase(card.link)"
          class="feature-card"
        >
          <div
            class="feature-icon outlined"
            :class="{ accent: card.accent }"
          >
            <!-- Layers icon -->
            <svg
              v-if="card.icon === 'layers'"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <!-- Shield icon -->
            <svg
              v-if="card.icon === 'shield'"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <!-- Rocket icon -->
            <svg
              v-if="card.icon === 'rocket'"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"
              />
              <path
                d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"
              />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </div>
          <h3
            class="feature-card-title"
            :class="{ 'accent-text': card.accent }"
          >
            {{ card.title }}
          </h3>
          <p class="feature-card-desc">{{ card.description }}</p>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.homepage {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 960px) {
  .homepage {
    padding: 0 80px;
  }
}

/* Hero */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 48px 0 52px;
}

@media (min-width: 960px) {
  .hero-section {
    padding: 64px 0 52px;
  }
}

.hero-text {
  flex: 1;
  min-width: 0;
  max-width: 459px;
}

.hero-title {
  font-family: 'Mulish', sans-serif;
  font-size: 2.75rem;
  font-weight: 800;
  line-height: 1.14;
  color: var(--vp-c-text-1);
}

@media (min-width: 960px) {
  .hero-title {
    font-size: 56px;
    line-height: 64px;
  }
}

.hero-tagline {
  margin-top: 24px;
  max-width: 459px;
  font-family: 'Mulish', sans-serif;
  font-size: 18px;
  line-height: 26px;
  font-weight: 400;
  color: var(--vp-c-text-2);
}

@media (min-width: 960px) {
  .hero-tagline {
    font-size: 24px;
    line-height: 26px;
  }
}

.hero-image {
  flex-shrink: 0;
  display: none;
}

.hero-image img {
  width: 280px;
  height: 280px;
  object-fit: contain;
}

@media (min-width: 768px) {
  .hero-image {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (min-width: 960px) {
  .hero-image img {
    width: 400px;
    height: 400px;
  }
}

/* Sections */
.section-container {
  padding-bottom: 52px;
}

.section-last {
  padding-bottom: 52px;
}

.protocol-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 640px) {
  .protocol-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.protocol-card {
  display: block;
  text-decoration: none;
  background: var(--vp-c-bg-soft);
  border-radius: 32px;
  padding: 24px;
  transition: all 0.25s;
}

.protocol-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

@media (min-width: 960px) {
  .protocol-card {
    padding: 40px;
  }
}

.protocol-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.protocol-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  flex-shrink: 0;
}

.protocol-card-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.protocol-card-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.protocol-card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

/* Section Titles */
.section-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 24px;
  border-top: none !important;
  padding-top: 0 !important;
  margin-top: 0 !important;
}

@media (min-width: 960px) {
  .section-title {
    font-size: 32px;
    line-height: 64px;
  }
}

/* Feature Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 640px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  display: block;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 32px;
  padding: 24px;
  transition: all 0.25s;
  text-decoration: none;
  background: rgba(247, 249, 253, 0.45);
}

:global(.dark) .feature-card {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(23, 23, 30, 0.45);
}

@media (min-width: 960px) {
  .feature-card {
    padding: 40px;
  }
}

.feature-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* Feature Icons */
.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.feature-icon.filled {
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
}

.feature-icon.outlined {
  border: 1.5px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.feature-icon.outlined.accent {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.feature-card-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 10px;
}

.feature-card-title.accent-text {
  color: var(--vp-c-brand-1);
}

.feature-card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}
</style>
