<template>
  <div class="remix-embed">
    <!-- Header with Open in Remix button -->
    <div class="remix-header">
      <span class="remix-title">
        <svg
          class="remix-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.8 16.2C21.8 17.9 20.4 19.3 18.7 19.3H13.6V17.9H18.7C19.6 17.9 20.4 17.1 20.4 16.2C20.4 15.3 19.6 14.5 18.7 14.5H13.6V13.1H18.7C20.4 13.1 21.8 14.5 21.8 16.2Z"
            fill="currentColor"
          />
          <path
            d="M10.4 19.3H5.3C3.6 19.3 2.2 17.9 2.2 16.2C2.2 14.5 3.6 13.1 5.3 13.1H10.4V14.5H5.3C4.4 14.5 3.6 15.3 3.6 16.2C3.6 17.1 4.4 17.9 5.3 17.9H10.4V19.3Z"
            fill="currentColor"
          />
          <path
            d="M13.6 10.9H18.7C20.4 10.9 21.8 9.5 21.8 7.8C21.8 6.1 20.4 4.7 18.7 4.7H13.6V6.1H18.7C19.6 6.1 20.4 6.9 20.4 7.8C20.4 8.7 19.6 9.5 18.7 9.5H13.6V10.9Z"
            fill="currentColor"
          />
          <path
            d="M5.3 10.9H10.4V9.5H5.3C4.4 9.5 3.6 8.7 3.6 7.8C3.6 6.9 4.4 6.1 5.3 6.1H10.4V4.7H5.3C3.6 4.7 2.2 6.1 2.2 7.8C2.2 9.5 3.6 10.9 5.3 10.9Z"
            fill="currentColor"
          />
          <path d="M10.4 4.7H13.6V19.3H10.4V4.7Z" fill="currentColor" />
        </svg>
        {{ title || 'Remix IDE' }}
      </span>
      <a
        :href="remixUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="open-remix-btn"
      >
        <span>Open in Remix</span>
        <svg
          class="external-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
    </div>

    <!-- Embedded iframe -->
    <div v-if="showEmbed" class="remix-iframe-container">
      <iframe
        :src="remixUrl"
        class="remix-iframe"
        frameborder="0"
        allow="clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  code: string;
  title?: string;
  showEmbed?: boolean;
  height?: string;
  optimize?: boolean;
  runs?: number;
  evmVersion?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Remix IDE',
  showEmbed: true,
  height: '600px',
  optimize: false,
  runs: 200,
  evmVersion: 'paris',
});

// Encode the Solidity code to base64 for Remix URL
const encodedCode = computed(() => {
  if (typeof window === 'undefined') {
    // SSR: return empty string, will be computed on client
    return '';
  }
  // Handle UTF-8 encoding properly for base64
  const utf8Bytes = new TextEncoder().encode(props.code);
  const binaryString = Array.from(utf8Bytes, (byte) =>
    String.fromCharCode(byte)
  ).join('');
  return btoa(binaryString);
});

// Build the Remix URL with all parameters
const remixUrl = computed(() => {
  const params = new URLSearchParams();

  // Build the URL with code parameter
  const baseUrl = 'https://remix.ethereum.org/';
  const hashParams = [
    `code=${encodedCode.value}`,
    'language=solidity',
    `optimize=${props.optimize}`,
    `runs=${props.runs}`,
    `evmVersion=${props.evmVersion}`,
  ];

  return `${baseUrl}#${hashParams.join('&')}`;
});
</script>

<style scoped>
.remix-embed {
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.remix-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-border);
}

.remix-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.remix-icon {
  width: 20px;
  height: 20px;
  color: var(--vp-c-brand-1);
}

.open-remix-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.open-remix-btn:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.external-icon {
  width: 14px;
  height: 14px;
}

.remix-iframe-container {
  position: relative;
  width: 100%;
  height: v-bind(height);
  background: #1e1e1e;
}

.remix-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Dark mode adjustments */
.dark .remix-embed {
  border-color: var(--vp-c-border);
}

.dark .remix-header {
  background: var(--vp-c-bg-soft);
}
</style>
