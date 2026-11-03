<script setup>
import { useI18n } from '@/i18n'
import { credits } from '@/data/credits'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="foot wrap">
    <div class="line">
      <p class="about">Backline · {{ t('footer.about') }}</p>
      <nav class="foot-links" aria-label="Backline">
        <RouterLink to="/catalog" class="link">{{ t('nav.catalog') }}</RouterLink>
        <RouterLink to="/cart" class="link">{{ t('nav.cart') }}</RouterLink>
        <RouterLink to="/favorites" class="link">{{ t('nav.favorites') }}</RouterLink>
      </nav>
      <p class="year muted">© {{ year }} Backline</p>
    </div>

    <details class="credits">
      <summary>{{ t('footer.credits') }}: Unsplash, Wikimedia Commons, Flickr</summary>
      <ul>
        <li v-for="c in credits" :key="c.url">
          {{ c.what }} — <a :href="c.url" class="link" target="_blank" rel="noopener">“{{ c.title }}”</a>, {{ c.author }}, {{ c.licence }}
        </li>
      </ul>
    </details>
  </footer>
</template>

<style scoped>
.foot {
  padding-top: 48px;
  padding-bottom: 28px;
  font-size: var(--step-small);
}

.line {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: baseline;
  gap: 24px;
}

.foot-links {
  display: flex;
  gap: 24px;
}

.year {
  justify-self: end;
}

.credits {
  margin-top: 20px;
  color: var(--muted);
}

.credits summary {
  cursor: pointer;
  width: fit-content;
  transition: color var(--dur-fast) ease;
}

.credits summary:hover {
  color: var(--ink);
}

.credits ul {
  margin-top: 12px;
  display: grid;
  gap: 4px;
  max-width: 90ch;
}

@media (max-width: 720px) {
  .line {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .year {
    justify-self: start;
  }
}
</style>
