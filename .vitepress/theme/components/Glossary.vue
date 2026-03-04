<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import glossaryData from '@/data/glossary.json';

const categories = [
  'All',
  'General',
  'Architecture',
  'Technical',
  'Security',
  'Market',
] as const;

type Category = (typeof categories)[number];

const searchTerm = ref('');
const selectedCategory = ref<Category>('All');
const showScrollTop = ref(false);

function handleScroll() {
  showScrollTop.value =
    (window.scrollY || document.documentElement.scrollTop) > 300;
}

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const filteredTerms = computed(() => {
  const searchLower = searchTerm.value.toLowerCase();
  return glossaryData.terms
    .filter((item) => {
      const matchesSearch =
        item.term.toLowerCase().includes(searchLower) ||
        item.definition.toLowerCase().includes(searchLower);
      const matchesCategory =
        selectedCategory.value === 'All' ||
        item.category === selectedCategory.value;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (searchTerm.value) {
        const aTermStarts = a.term.toLowerCase().startsWith(searchLower);
        const bTermStarts = b.term.toLowerCase().startsWith(searchLower);
        const aTermMatch = a.term.toLowerCase().includes(searchLower);
        const bTermMatch = b.term.toLowerCase().includes(searchLower);
        if (aTermStarts && !bTermStarts) return -1;
        if (!aTermStarts && bTermStarts) return 1;
        if (aTermMatch && !bTermMatch) return -1;
        if (!aTermMatch && bTermMatch) return 1;
      }
      return a.term.localeCompare(b.term, 'en');
    });
});

const termsCount = computed(() => filteredTerms.value.length);
const totalCount = glossaryData.terms.length;
</script>

<template>
  <div class="glossary-root">
    <p class="glossary-subtitle">
      {{ totalCount }} {{ totalCount === 1 ? 'term' : 'terms' }} in the Nox
      Protocol glossary
    </p>

    <!-- Search + Filters -->
    <div class="glossary-controls">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search for a term or definition..."
        aria-label="Search glossary"
        class="glossary-search"
      />

      <div class="glossary-categories">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          :class="[
            'glossary-cat-btn',
            selectedCategory === category && 'active',
          ]"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- List -->
    <div class="glossary-list">
      <p v-if="filteredTerms.length === 0" class="glossary-empty">
        No terms match your search. Try a different query or category.
      </p>

      <div
        v-for="(item, index) in filteredTerms"
        v-else
        :key="index"
        class="glossary-card"
      >
        <div class="glossary-card-header">
          <h3 class="glossary-term">{{ item.term }}</h3>
          <span
            :class="[
              'glossary-badge',
              `cat-${item.category.toLowerCase()}`,
            ]"
          >
            {{ item.category }}
          </span>
        </div>
        <p class="glossary-def">{{ item.definition }}</p>
      </div>
    </div>

    <!-- Footer -->
    <p class="glossary-footer">
      {{ termsCount }}
      {{ termsCount === 1 ? 'term' : 'terms' }} displayed
    </p>

    <!-- Scroll to top -->
    <button
      v-show="showScrollTop"
      type="button"
      aria-label="Back to top"
      class="glossary-scroll-top"
      @click="scrollToTop"
    >
      ↑
    </button>
  </div>
</template>

<style scoped>
/*
 * Scoped styles required to override VitePress .vp-doc specificity.
 * Uses design tokens from style.css (var(--vp-c-*)).
 */

/* ── Reset VitePress defaults inside component ── */
.glossary-root h3,
.glossary-root p {
  margin: 0;
  padding: 0;
  border: none;
}

/* ── Subtitle ── */
.glossary-subtitle {
  text-align: center;
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
}

/* ── Controls ── */
.glossary-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.glossary-search {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.glossary-search:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

/* ── Category filter buttons ── */
.glossary-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.glossary-cat-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border: 2px solid var(--vp-c-border);
  border-radius: 9999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1.4;
}

.glossary-cat-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.glossary-cat-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

/* ── Glossary list ── */
.glossary-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.glossary-empty {
  text-align: center;
  padding: 3rem 0;
  color: var(--vp-c-text-2);
}

/* ── Card ── */
.glossary-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 1.25rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.glossary-card:hover {
  border-color: var(--vp-c-brand-1);
}

.glossary-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

/* ── Term ── */
.glossary-term {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

/* ── Definition ── */
.glossary-def {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

/* ── Badge base ── */
.glossary-badge {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  margin-top: 2px;
  padding: 0.15rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

/* ── Badge colors per category ── */
.cat-general {
  background: var(--vp-c-purple-soft);
  color: var(--vp-c-purple-1);
}

.cat-architecture {
  background: var(--vp-c-blue-soft);
  color: var(--vp-c-blue-1);
}

.cat-technical {
  background: var(--vp-c-yellow-soft);
  color: var(--vp-c-yellow-1);
}

.cat-security {
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
}

.cat-market {
  background: var(--vp-c-red-soft);
  color: var(--vp-c-red-1);
}

/* ── Footer ── */
.glossary-footer {
  text-align: center;
  padding-top: 2rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

/* ── Scroll to top ── */
.glossary-scroll-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 2px solid var(--vp-c-border);
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
}

.glossary-scroll-top:hover {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}
</style>
