<script setup>
import { computed } from 'vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const year = new Date().getFullYear()

const columns = computed(() => [
  {
    title: t('footer.shop'),
    links: [
      { to: '/catalog?cat=guitars', label: t('nav.guitars') },
      { to: '/catalog?cat=drums', label: t('nav.drums') },
      { to: '/catalog?cat=accessories', label: t('nav.accessories') },
      { to: '/catalog', label: t('nav.catalog') },
    ],
  },
  {
    title: t('footer.help'),
    links: [
      { to: '/#service-h', label: t('footer.delivery') },
      { to: '/#service-h', label: t('footer.returns') },
      { to: '/#service-h', label: t('footer.warranty') },
      { to: '/#faq-h', label: t('footer.faq') },
    ],
  },
  {
    title: t('footer.mine'),
    links: [
      { to: '/cart', label: t('nav.cart') },
      { to: '/favorites', label: t('nav.favorites') },
    ],
  },
])
</script>

<template>
  <footer class="foot">
    <ul class="promises wrap">
      <li v-for="p in t('footer.promises')" :key="p">{{ p }}</li>
    </ul>

    <div class="main wrap">
      <div class="brand">
        <RouterLink to="/" class="mark">Backline</RouterLink>
        <p>{{ t('footer.tagline') }}</p>
      </div>

      <nav v-for="col in columns" :key="col.title" class="col" :aria-label="col.title">
        <h2>{{ col.title }}</h2>
        <ul>
          <li v-for="l in col.links" :key="l.label">
            <RouterLink :to="l.to" class="link">{{ l.label }}</RouterLink>
          </li>
        </ul>
      </nav>
    </div>

    <p class="giant wrap" aria-hidden="true">Backline</p>

    <div class="bottom wrap">
      <p>© {{ year }} Backline. {{ t('footer.rights') }}</p>
      <RouterLink to="/credits" class="link">{{ t('footer.credits') }}</RouterLink>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  background: var(--surface);
  overflow: hidden;
}

.promises {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px 32px;
  padding-block: 20px;
  background: var(--surface-2);
  font-weight: 500;
}

.promises li {
  display: flex;
  align-items: center;
  gap: 12px;
}

.promises li::before {
  content: '';
  width: 8px;
  height: 8px;
  background: var(--accent);
}

.main {
  display: grid;
  grid-template-columns: minmax(0, 5fr) repeat(3, minmax(0, 2fr));
  gap: 40px var(--gutter);
  padding-top: clamp(56px, 7vw, 112px);
}

.mark {
  display: inline-block;
  font-size: var(--step-lead);
  font-weight: 600;
  letter-spacing: -0.04em;
  margin-bottom: 16px;
  transition: color var(--dur-fast) ease;
}

.mark:hover {
  color: var(--accent);
}

.brand p {
  max-width: 34ch;
  color: var(--muted);
}

.col h2 {
  font-size: var(--step-small);
  font-weight: 500;
  letter-spacing: 0;
  color: var(--muted);
  margin-bottom: 18px;
}

.col ul {
  display: grid;
  gap: 10px;
}

.giant {
  margin-top: clamp(56px, 8vw, 128px);
  /* "Backline" set at this face and tracking is ~3.3em wide: fill the content width edge to edge. */
  font-size: calc((100vw - 2 * var(--gutter)) / 3.32);
  font-weight: 600;
  letter-spacing: -0.065em;
  line-height: 0.78;
  white-space: nowrap;
  user-select: none;
}

.bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px 24px;
  padding-block: 28px;
  font-size: var(--step-small);
  color: var(--muted);
}

.bottom .link:hover {
  color: var(--ink);
}

@media (max-width: 900px) {
  .main {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .main {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .promises {
    flex-direction: column;
  }
}
</style>
