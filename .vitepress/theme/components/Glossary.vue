<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import glossaryData from '@/data/glossary.json';

const categories = [
  'All',
  'General',
  'Architecture',
  'Technical',
  'Security',
  'Market',
];

const searchTerm = ref('');
const selectedCategory = ref('All');
const showScrollTop = ref(false);

function handleScroll() {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  showScrollTop.value = scrollY > 300;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

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
  <div class="glossary-wrapper">
    <p class="glossary-subtitle">
      {{ totalCount }} {{ totalCount === 1 ? 'term' : 'terms' }} in the Nox
      Protocol glossary
    </p>

    <div class="glossary-filters">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search for a term or definition..."
        class="glossary-search"
        aria-label="Search glossary"
      />

      <div class="category-filters">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          :class="['category-btn', { active: selectedCategory === category }]"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <div class="glossary-list">
      <p v-if="filteredTerms.length === 0" class="no-results">
        No terms match your search. Try a different query or category.
      </p>
      <div
        v-else
        v-for="(item, index) in filteredTerms"
        :key="index"
        class="glossary-item"
      >
        <div class="glossary-item-header">
          <h3 class="glossary-term">{{ item.term }}</h3>
          <span
            :class="[
              'glossary-category',
              `cat-${item.category.toLowerCase()}`,
            ]"
          >
            {{ item.category }}
          </span>
        </div>
        <p class="glossary-definition">{{ item.definition }}</p>
      </div>
    </div>

    <div class="glossary-footer">
      <p>
        {{ termsCount }}
        {{ termsCount === 1 ? 'term' : 'terms' }} displayed
      </p>
    </div>

    <button
      v-show="showScrollTop"
      type="button"
      class="scroll-to-top"
      aria-label="Back to top"
      @click="scrollToTop"
    >
      ↑
    </button>
  </div>
</template>

<style scoped>
.glossary-wrapper {
  padding: 1rem 0 2rem;
}

.glossary-subtitle {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
}

.glossary-filters {
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
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background: var(--vp-c-bg-soft);
}

.glossary-search:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-btn {
  padding: 0.4rem 0.9rem;
  border: 2px solid var(--vp-c-border);
  border-radius: 9999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.category-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.glossary-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.glossary-item {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-border);
}

.glossary-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.glossary-term {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.glossary-category {
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

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
  background: rgba(236, 72, 153, 0.15);
  color: #be185d;
}

.glossary-definition {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}

.glossary-footer {
  text-align: center;
  padding: 2rem 0 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-2);
}

.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.scroll-to-top:hover {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}
</style>
