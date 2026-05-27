<script setup>
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import { computed } from 'vue';
import AskIaButton from '@/components/AskIaButton.vue';
import DevBanner from './DevBanner.vue';

const { Layout } = DefaultTheme;
const { frontmatter } = useData();
const isHome = computed(() => frontmatter.value.layout === 'home');
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
    <template #aside-outline-before>
      <AskIaButton />
    </template>
  </Layout>
</template>
