<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useNetwork } from '../composables/useNetwork';

const { selectedNetwork, networks, setNetwork } = useNetwork();

const open = ref(false);
const root = ref<HTMLElement | null>(null);

function toggle() {
  open.value = !open.value;
}

function select(id: string) {
  setNetwork(id);
  open.value = false;
}

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    open.value = false;
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false;
}

onMounted(() => {
  document.addEventListener('click', onClickOutside);
  document.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <div ref="root" class="nox-switcher" :class="{ open }">
    <button
      class="nox-switcher-trigger"
      type="button"
      :aria-expanded="open"
      aria-haspopup="listbox"
      aria-label="Select network"
      @click="toggle"
    >
      <img
        class="nox-switcher-logo"
        :src="selectedNetwork.logo"
        alt=""
        aria-hidden="true"
        width="18"
        height="18"
      />
      <span class="nox-switcher-label">{{ selectedNetwork.name }}</span>
      <svg
        class="nox-switcher-chevron"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <Transition name="nox-switcher-fade">
      <div v-if="open" class="nox-switcher-menu" role="listbox">
        <div class="nox-switcher-menu-title">Network</div>
        <button
          v-for="network in networks"
          :key="network.id"
          class="nox-switcher-item"
          type="button"
          role="option"
          :class="{ active: network.id === selectedNetwork.id }"
          :aria-selected="network.id === selectedNetwork.id"
          @click="select(network.id)"
        >
          <img
            class="nox-switcher-item-logo"
            :src="network.logo"
            alt=""
            aria-hidden="true"
            width="20"
            height="20"
          />
          <span class="nox-switcher-item-name">{{ network.name }}</span>
          <span class="nox-switcher-check" aria-hidden="true">
            <svg
              v-if="network.id === selectedNetwork.id"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.nox-switcher {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.nox-switcher-trigger {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition:
    border-color 0.25s,
    background-color 0.25s,
    color 0.25s;
  white-space: nowrap;
}

.nox-switcher-trigger:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.nox-switcher.open .nox-switcher-trigger {
  border-color: var(--vp-c-brand-1);
}

.nox-switcher-logo {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  display: block;
}

.nox-switcher-label {
  line-height: 1;
}

.nox-switcher-chevron {
  color: var(--vp-c-text-3);
  transition: transform 0.25s;
}

.nox-switcher.open .nox-switcher-chevron {
  transform: rotate(180deg);
}

.nox-switcher-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 100;
  min-width: 224px;
  padding: 6px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.08);
}

.nox-switcher-menu-title {
  padding: 6px 10px 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
}

.nox-switcher-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 38px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition:
    background-color 0.25s,
    color 0.25s;
}

.nox-switcher-item:hover {
  background: var(--vp-c-default-soft);
}

.nox-switcher-item.active {
  color: var(--vp-c-brand-1);
}

.nox-switcher-item-logo {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: block;
}

.nox-switcher-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  flex-shrink: 0;
  color: var(--vp-c-brand-1);
}

.nox-switcher-item-name {
  flex: 1;
}

.nox-switcher-fade-enter-active,
.nox-switcher-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.nox-switcher-fade-enter-from,
.nox-switcher-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* On narrow screens the navbar links collapse into the hamburger menu, but the
   switcher stays in the bar. Keep it compact so it doesn't crowd the title. */
@media (max-width: 768px) {
  .nox-switcher-trigger {
    height: 32px;
    padding: 0 8px;
  }
}
</style>
