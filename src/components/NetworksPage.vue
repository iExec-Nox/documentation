<template>
  <div class="networks-grid">
    <article v-for="chain in chains" :key="chain.id" class="network-card">
      <header class="network-card__header">
        <img
          v-if="chain.icon"
          :src="chain.icon"
          :alt="`${chain.name} logo`"
          class="network-card__logo"
        />
        <div class="network-card__title">
          <h3>{{ chain.name }}</h3>
          <code class="network-card__chain-id">Chain ID: {{ chain.id }}</code>
        </div>
      </header>

      <dl class="network-card__fields">
        <div class="network-card__row">
          <dt>NoxCompute</dt>
          <dd>
            <a
              :href="`${chain.blockExplorers.default.url}/address/${chain.noxComputeAddress}`"
              target="_blank"
              rel="noopener noreferrer"
              class="network-card__link"
            >
              <code>{{ chain.noxComputeAddress }}</code>
            </a>
          </dd>
        </div>

        <div class="network-card__row">
          <dt>Native currency</dt>
          <dd>
            {{ chain.nativeCurrency.name }} ({{ chain.nativeCurrency.symbol }})
          </dd>
        </div>

        <div class="network-card__row">
          <dt>RPC URL</dt>
          <dd>
            <code class="network-card__rpc">{{
              chain.rpcUrls.default.http[0]
            }}</code>
          </dd>
        </div>

        <div class="network-card__row">
          <dt>Block explorer</dt>
          <dd>
            <a
              :href="chain.blockExplorers.default.url"
              target="_blank"
              rel="noopener noreferrer"
              class="network-card__link"
            >
              {{ chain.blockExplorers.default.url }}
            </a>
          </dd>
        </div>

        <div class="network-card__row">
          <dt>Faucets</dt>
          <dd>
            <ul
              v-if="faucetsFor(chain.id).length"
              class="network-card__faucets"
            >
              <li
                v-for="faucet in faucetsFor(chain.id)"
                :key="faucet.url"
                class="network-card__faucet"
              >
                <a
                  :href="faucet.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="network-card__link"
                >
                  {{ faucet.label }}
                </a>
                <span v-if="faucet.note" class="network-card__faucet-note">
                  — {{ faucet.note }}
                </span>
              </li>
            </ul>
            <span v-else class="network-card__muted">No faucets listed</span>
          </dd>
        </div>
      </dl>

      <footer class="network-card__footer">
        <button
          class="network-card__add-btn"
          :disabled="!hasWallet || statusFor(chain.id) === 'pending'"
          @click="addToWallet(chain)"
        >
          {{ buttonLabel(chain.id) }}
        </button>
        <p v-if="!hasWallet" class="network-card__hint">
          No EIP-1193 wallet detected in this browser. Install MetaMask (or
          another injected wallet) to enable "Add to wallet".
        </p>
        <p
          v-else-if="statusFor(chain.id) === 'rejected'"
          class="network-card__hint network-card__hint--warn"
        >
          You rejected the request in your wallet. Click again to retry.
        </p>
        <p
          v-else-if="statusFor(chain.id) === 'error'"
          class="network-card__hint network-card__hint--warn"
        >
          {{ errorFor(chain.id) || 'Unable to switch chain.' }}
        </p>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { getSupportedChains, type Chain } from '@/utils/chain.utils';
import { useChainSwitch } from '@/hooks/useChainSwitch';
import { useAccount } from '@wagmi/vue';

declare global {
  interface Window {
    ethereum?: any;
  }
}

type AddStatus = 'idle' | 'pending' | 'added' | 'rejected' | 'error';

interface FaucetLink {
  label: string;
  url: string;
  note?: string;
}

// Per-chain faucet data. `chain.utils.ts` does not expose a `faucetUrls` field,
// so we keep this map here for now — when that field is added, swap this map
// for `chain.faucetUrls`.
const FAUCETS: Record<number, FaucetLink[]> = {
  // Arbitrum Sepolia (421614)
  421614: [
    {
      label: 'Alchemy Arbitrum Sepolia faucet',
      url: 'https://www.alchemy.com/faucets/arbitrum-sepolia',
      note: 'drops Arbitrum Sepolia ETH directly on L2.',
    },
    {
      label: 'Bridge from Ethereum Sepolia',
      url: 'https://bridge.arbitrum.io/?destinationChain=arbitrum-sepolia&sourceChain=sepolia',
      note: 'bridge from Ethereum Sepolia if the L2 faucet is dry.',
    },
  ],
  // Ethereum Sepolia (11155111)
  11155111: [
    {
      label: 'Google Cloud Web3 Sepolia faucet',
      url: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
      note: 'hands out Ethereum Sepolia ETH — only relevant for this card.',
    },
    {
      label: 'Alchemy Sepolia faucet',
      url: 'https://www.alchemy.com/faucets/ethereum-sepolia',
    },
  ],
};

const chains: Chain[] = getSupportedChains();
const { requestChainChange } = useChainSwitch();
const { isConnected } = useAccount();

const hasWallet = ref(false);
const statuses = reactive<Record<number, AddStatus>>({});
const errors = reactive<Record<number, string>>({});

onMounted(() => {
  hasWallet.value = typeof window !== 'undefined' && Boolean(window.ethereum);
});

function faucetsFor(chainId: number): FaucetLink[] {
  return FAUCETS[chainId] ?? [];
}

function statusFor(chainId: number): AddStatus {
  return statuses[chainId] ?? 'idle';
}

function errorFor(chainId: number): string {
  return errors[chainId] ?? '';
}

function buttonLabel(chainId: number): string {
  switch (statusFor(chainId)) {
    case 'pending':
      return 'Waiting for wallet…';
    case 'added':
      return 'Added / switched ✓';
    case 'rejected':
      return 'Retry: add to wallet';
    case 'error':
      return 'Retry: add to wallet';
    default:
      return 'Add to wallet';
  }
}

async function addToWallet(chain: Chain) {
  if (!hasWallet.value || !window.ethereum) {
    return;
  }

  statuses[chain.id] = 'pending';
  errors[chain.id] = '';

  const chainIdHex = `0x${chain.id.toString(16)}`;

  // Sync the doc-side store after a successful wallet operation. When the
  // wallet is connected through wagmi, wagmi itself listens for `chainChanged`
  // and updates its state, so calling `requestChainChange` (which delegates to
  // wagmi's `switchChain`) would dispatch a redundant EIP-1193 prompt. Only
  // call it on the disconnected path, where it writes the chain to the Pinia
  // store without touching the wallet.
  async function syncStoreAfterWallet(chainId: number) {
    if (!isConnected.value) {
      await requestChainChange(chainId);
    }
  }

  try {
    // Try a plain switch first — works if the wallet already knows the chain.
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
    await syncStoreAfterWallet(chain.id);
    statuses[chain.id] = 'added';
  } catch (switchErr: any) {
    // EIP-1193 4902: chain not added yet — add then switch.
    if (switchErr?.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainIdHex,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [...chain.rpcUrls.default.http],
              blockExplorerUrls: [chain.blockExplorers.default.url],
            },
          ],
        });
        await syncStoreAfterWallet(chain.id);
        statuses[chain.id] = 'added';
      } catch (addErr: any) {
        if (addErr?.code === 4001) {
          statuses[chain.id] = 'rejected';
        } else {
          statuses[chain.id] = 'error';
          errors[chain.id] =
            addErr?.shortMessage || addErr?.message || 'Unknown error';
        }
      }
    } else if (switchErr?.code === 4001) {
      statuses[chain.id] = 'rejected';
    } else {
      statuses[chain.id] = 'error';
      errors[chain.id] =
        switchErr?.shortMessage || switchErr?.message || 'Unknown error';
    }
  }
}
</script>

<style scoped>
.networks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.network-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.network-card__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.network-card__logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  padding: 4px;
  box-sizing: border-box;
}

.network-card__title h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.network-card__chain-id {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  background: none;
  padding: 0;
}

.network-card__fields {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.network-card__row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.network-card__row dt {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin: 0;
}

.network-card__row dd {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--vp-c-text-1);
  word-break: break-all;
}

.network-card__row dd code {
  font-size: 0.75rem;
  background: var(--vp-c-bg-soft);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.network-card__rpc {
  display: inline-block;
  max-width: 100%;
  word-break: break-all;
}

.network-card__link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.network-card__link:hover {
  text-decoration: underline;
}

.network-card__faucets {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.network-card__faucet {
  font-size: 0.8125rem;
  line-height: 1.4;
}

.network-card__faucet-note {
  color: var(--vp-c-text-2);
}

.network-card__muted {
  color: var(--vp-c-text-3);
  font-style: italic;
}

.network-card__footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.network-card__add-btn {
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
}

.network-card__add-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

.network-card__add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.network-card__hint {
  margin: 0;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

.network-card__hint--warn {
  color: var(--vp-c-warning-1);
}
</style>
