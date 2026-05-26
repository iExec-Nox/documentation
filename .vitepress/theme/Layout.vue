<script setup>
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import { computed, onMounted } from 'vue';
import AskIaButton from '@/components/AskIaButton.vue';
import DevBanner from './DevBanner.vue';
import NetworkSwitcher from './components/NetworkSwitcher.vue';

const { Layout } = DefaultTheme;
const { frontmatter } = useData();
const isHome = computed(() => frontmatter.value.layout === 'home');

onMounted(() => {
  document.addEventListener('click', (e) => {
    const link = e.target?.closest?.('a[href="/nox-protocol/"]');
    if (link) {
      e.preventDefault();
      window.location.href = '/';
    }
  });
});
</script>

<template>
  <Layout>
    <template #layout-top>
      <DevBanner />
    </template>
    <template #nav-bar-title-after>
      <template v-if="isHome">iExec Documentation</template>
      <template v-else>Nox documentation</template>
    </template>
    <template #nav-bar-content-after>
      <NetworkSwitcher />
    </template>
    <template #aside-outline-before>
      <AskIaButton />
    </template>
  </Layout>
</template>
