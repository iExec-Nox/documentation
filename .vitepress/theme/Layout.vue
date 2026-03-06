<script setup>
import DefaultTheme from 'vitepress/theme';
import AskIaButton from '@/components/AskIaButton.vue';
import DevBanner from './DevBanner.vue';

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #layout-top>
      <DevBanner />
    </template>
    <template #aside-outline-before>
      <AskIaButton />
    </template>
  </Layout>
</template>
