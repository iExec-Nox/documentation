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
      <p class="text-text2 mb-4 text-sm">{{ description }}</p>

      <!-- Footer pinned to the bottom so tags + actions align across cards -->
      <div class="mt-auto">
        <!-- Feature tags -->
        <div v-if="features?.length" class="mb-5 flex flex-wrap gap-1.5">
          <span
            v-for="feature in features"
            :key="feature"
            class="bg-bg text-text2 border-border rounded-full border px-2 py-0.5 text-[11px] font-medium"
          >
            {{ feature }}
          </span>
        </div>

        <!-- Actions: yellow demo button on top, text links below -->
        <div
          v-if="demoUrl || to || githubUrl"
          class="flex flex-col items-start gap-3"
        >
          <a
            v-if="demoUrl"
            :href="demoUrl"
            target="_blank"
            rel="noopener noreferrer"
            :class="primaryBtn"
          >
            {{ demoLabel }}
            <Icon icon="lucide:arrow-up-right" :height="14" />
          </a>

          <div
            v-if="to || githubUrl"
            class="flex flex-wrap items-center gap-x-4 gap-y-1"
          >
            <a v-if="to" :href="withBase(to)" :class="secondaryBtn">
              {{ toLabel }}
              <Icon icon="lucide:arrow-right" :height="14" />
            </a>

            <a
              v-if="githubUrl"
              :href="githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              :class="secondaryBtn"
            >
              <Icon icon="mdi:github" :height="14" />
              {{ githubLabel }}
            </a>
          </div>
        </div>
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
  /** Internal route for the "Learn more" text link */
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
  'inline-flex items-center gap-1 rounded-md bg-[var(--vp-button-brand-bg)] px-3 py-1.5 text-[13px] font-medium text-[var(--vp-button-brand-text)]! no-underline! transition-colors duration-200 hover:bg-[var(--vp-button-brand-hover-bg)]';

const secondaryBtn =
  'inline-flex items-center gap-1 text-[13px] font-medium text-[var(--vp-c-text-2)]! no-underline! transition-colors duration-200 hover:text-[var(--vp-c-brand-1)]!';
</script>
