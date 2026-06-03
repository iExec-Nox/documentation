<template>
  <div class="piggy-demo">
    <!-- Header -->
    <div class="header">
      <span class="header-title">Nox SDK Playground</span>
      <button
        v-if="!account"
        :disabled="loading"
        class="btn-brand btn-sm"
        @click="connect"
      >
        Connect wallet
      </button>
      <div v-else class="wallet-badge">
        <span class="wallet-dot" />
        <code>{{ shortAddress(account) }}</code>
      </div>
    </div>

    <!-- Encrypt section -->
    <div class="section">
      <div class="section-header">Encrypt</div>
      <div class="section-body">
        <input
          v-model="contractAddress"
          placeholder="Contract address (0x...)"
        />
        <div class="input-row">
          <input v-model="plainValue" placeholder="Value (uint256)" />
          <button :disabled="!canEncrypt" class="btn-brand" @click="doEncrypt">
            Encrypt
          </button>
        </div>
        <div v-if="handle" class="result-card">
          <div class="result-item">
            <div class="result-label">handle</div>
            <div class="result-content">
              <code>{{ handle }}</code>
              <button
                class="btn-icon"
                title="Copy handle"
                @click="copy(handle)"
              >
                <svg
                  v-if="copied !== 'handle'"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path
                    d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                  />
                </svg>
                <svg
                  v-else
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="result-item">
            <div class="result-label">handle proof</div>
            <div class="result-content">
              <code>{{ handleProof }}</code>
              <button
                class="btn-icon"
                title="Copy proof"
                @click="copy(handleProof, 'proof')"
              >
                <svg
                  v-if="copied !== 'proof'"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path
                    d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                  />
                </svg>
                <svg
                  v-else
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Decrypt section -->
    <div class="section">
      <div class="section-header">Decrypt</div>
      <div class="section-body">
        <div class="input-row">
          <input v-model="handleToDecrypt" placeholder="Handle (0x...)" />
          <button :disabled="!canDecrypt" class="btn-brand" @click="doDecrypt">
            Decrypt
          </button>
        </div>
        <div v-if="decryptedValue !== null" class="result-card result-success">
          <span class="result-label">value</span>
          <code class="result-big">{{ decryptedValue }}</code>
        </div>
      </div>
    </div>

    <!-- Status bar -->
    <div v-if="status || error" class="status-bar">
      <div v-if="loading" class="spinner" />
      <span :class="{ 'status-error': error }">
        {{ error || status }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// TODO: migrate to Ethereum Sepolia (sepolia) once @iexec-nox/handle supports chain 11155111.
const ARBITRUM_SEPOLIA_HEX = '0x66eee';

const contractAddress = ref('');
const plainValue = ref('');
const handle = ref('');
const handleProof = ref('');
const handleToDecrypt = ref('');
const decryptedValue = ref<string | null>(null);
const account = ref<string | null>(null);
const status = ref('');
const error = ref('');
const loading = ref(false);
const copied = ref('');

let handleClient: any = null;

const shortAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;

async function copy(text: string, key = 'handle') {
  await navigator.clipboard.writeText(text);
  copied.value = key;
  setTimeout(() => {
    copied.value = '';
  }, 1500);
}

const isValidAddress = computed(() =>
  /^0x[0-9a-fA-F]{40}$/.test(contractAddress.value)
);

const canEncrypt = computed(
  () =>
    account.value && isValidAddress.value && plainValue.value && !loading.value
);

const canDecrypt = computed(
  () => account.value && handleToDecrypt.value && !loading.value
);

async function connect() {
  error.value = '';
  status.value = 'Connecting wallet...';
  loading.value = true;
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not found. Please install it.');
    }

    const { createWalletClient, custom } = await import('viem');
    const { arbitrumSepolia } = await import('viem/chains');
    const { createViemHandleClient } = await import('@iexec-nox/handle');

    const accounts: string[] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    account.value = accounts[0];

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARBITRUM_SEPOLIA_HEX }],
      });
    } catch (e: any) {
      if (e.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: ARBITRUM_SEPOLIA_HEX,
              chainName: 'Arbitrum Sepolia',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
              blockExplorerUrls: ['https://sepolia.arbiscan.io'],
            },
          ],
        });
      } else {
        throw e;
      }
    }

    const walletClient = createWalletClient({
      account: accounts[0] as `0x${string}`,
      chain: arbitrumSepolia,
      transport: custom(window.ethereum),
    });

    handleClient = await createViemHandleClient(walletClient);
    status.value = '';
  } catch (e: any) {
    error.value = e.shortMessage || e.message;
    status.value = '';
  } finally {
    loading.value = false;
  }
}

async function doEncrypt() {
  error.value = '';
  handle.value = '';
  handleProof.value = '';
  loading.value = true;
  try {
    status.value = 'Encrypting...';
    const result = await handleClient.encryptInput(
      BigInt(plainValue.value),
      'uint256',
      contractAddress.value
    );
    handle.value = result.handle;
    handleProof.value = result.handleProof;
    status.value = '';
  } catch (e: any) {
    error.value = e.shortMessage || e.message;
    status.value = '';
  } finally {
    loading.value = false;
  }
}

async function doDecrypt() {
  error.value = '';
  decryptedValue.value = null;
  loading.value = true;
  try {
    status.value = 'Sign the decryption request in your wallet...';
    const { value } = await handleClient.decrypt(handleToDecrypt.value);
    decryptedValue.value = value.toString();
    status.value = '';
  } catch (e: any) {
    error.value = e.shortMessage || e.message;
    status.value = '';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.piggy-demo {
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg);
  margin: 1.5rem 0;
  overflow: hidden;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
}

.header-title {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
}

.wallet-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;
  padding: 0.25rem 0.625rem 0.25rem 0.5rem;
}

.wallet-badge code {
  font-size: 0.75rem;
  background: none;
  padding: 0;
}

.wallet-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-green-1);
}

/* Sections */
.section {
  border-bottom: 1px solid var(--vp-c-border);
}

.section:last-of-type {
  border-bottom: none;
}

.section-header {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  padding: 0.75rem 1.25rem 0;
}

.section-body {
  padding: 0.5rem 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-body input {
  font-size: 0.8125rem;
  padding: 0.5rem 0.75rem;
}

.input-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.input-row input {
  flex: 1;
  min-width: 0;
}

/* Result cards */
.result-card {
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  overflow: hidden;
}

.result-item {
  padding: 0.5rem 0.75rem;
}

.result-item + .result-item {
  border-top: 1px solid var(--vp-c-border);
}

.result-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin-bottom: 0.25rem;
}

.result-content {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.result-content code {
  flex: 1;
  min-width: 0;
  font-size: 0.75rem;
  line-height: 1.5;
  word-break: break-all;
  background: none;
  padding: 0;
  color: var(--vp-c-text-1);
}

.result-success {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--vp-c-green-soft);
  border-color: var(--vp-c-green-2);
}

.result-success .result-label {
  margin-bottom: 0;
  color: var(--vp-c-green-1);
}

.result-big {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  background: none;
  padding: 0;
}

/* Buttons */
.btn-brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  background: var(--vp-c-brand-1);
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.btn-sm {
  padding: 0.3125rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 6px;
}

.btn-brand:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

.btn-brand:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-icon:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
}

/* Status bar */
.status-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  border-top: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
}

.status-error {
  color: var(--vp-c-danger-1);
}

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid var(--vp-c-border);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
