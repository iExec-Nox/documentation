<template>
  <div
    class="group bg-soft-bg border-border hover:border-primary flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <!-- Icon header (gradient placeholder until real screenshots are added) -->
    <div
      class="relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--vp-c-brand-soft)] to-[var(--vp-c-bg-soft)]"
    >
      <Icon
        :icon="icon"
        :height="56"
        class="text-primary2 opacity-90 transition-transform duration-300 group-hover:scale-110"
      />
    </div>

    <!-- Content -->
    <div class="flex flex-1 flex-col p-6">
      <h3 class="text-text1 mt-0! mb-2">{{ title }}</h3>
      <p class="text-text2 mb-4 flex-1 text-sm">{{ description }}</p>

      <!-- Feature tags -->
      <div v-if="features?.length" class="mb-5 flex flex-wrap gap-2">
        <span
          v-for="feature in features"
          :key="feature"
          class="bg-bg text-text2 border-border rounded-full border px-2.5 py-0.5 text-xs font-medium"
        >
          {{ feature }}
        </span>
      </div>

      <!-- Actions -->
      <div
        v-if="demoUrl || to || githubUrl"
        class="mt-auto flex flex-wrap gap-3"
      >
        <a
          v-if="demoUrl"
          :href="demoUrl"
          target="_blank"
          rel="noreferrer"
          :class="primaryBtn"
        >
          {{ demoLabel }}
          <Icon icon="lucide:arrow-up-right" :height="16" />
        </a>

        <a
          v-if="to"
          :href="withBase(to)"
          :class="demoUrl ? secondaryBtn : primaryBtn"
        >
          {{ toLabel }}
          <Icon icon="lucide:arrow-right" :height="16" />
        </a>

        <a
          v-if="githubUrl"
          :href="githubUrl"
          target="_blank"
          rel="noreferrer"
          :class="secondaryBtn"
        >
          <Icon icon="mdi:github" :height="16" />
          {{ githubLabel }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { withBase } from 'vitepress';

interface Props {
  title: string;
  description: string;
  icon: string;
  features?: string[];
  /** Internal route for the primary "Learn more" / "Read the guide" link */
  to?: string;
  toLabel?: string;
  /** External live-demo URL */
  demoUrl?: string;
  demoLabel?: string;
  /** External source-code URL */
  githubUrl?: string;
  githubLabel?: string;
}

withDefaults(defineProps<Props>(), {
  features: () => [],
  toLabel: 'Learn more',
  demoLabel: 'Try the demo',
  githubLabel: 'View code',
});

const primaryBtn =
  'inline-flex items-center gap-1.5 rounded-lg bg-[var(--vp-button-brand-bg)] px-4 py-2 text-sm font-semibold text-[var(--vp-button-brand-text)]! no-underline! transition-all duration-200 hover:-translate-y-px hover:bg-[var(--vp-button-brand-hover-bg)]';

const secondaryBtn =
  'inline-flex items-center gap-1.5 rounded-lg border border-[var(--vp-c-border)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--vp-c-text-1)]! no-underline! transition-all duration-200 hover:-translate-y-px hover:border-[var(--vp-c-brand-1)] hover:text-[var(--vp-c-brand-1)]!';
</script>
