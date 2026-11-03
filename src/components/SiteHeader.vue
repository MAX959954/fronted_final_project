<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/i18n'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'

const { t, locale, setLocale, LOCALES } = useI18n()
const cart = useCartStore()
const favs = useFavoritesStore()
const route = useRoute()

const menuOpen = ref(false)
const langOpen = ref(false)
const langRoot = ref(null)
const bump = ref(false)

const links = [
  { to: '/catalog', key: 'nav.catalog' },
  { to: '/catalog?cat=guitars', key: 'nav.guitars' },
  { to: '/catalog?cat=drums', key: 'nav.drums' },
  { to: '/catalog?cat=accessories', key: 'nav.accessories' },
]

function chooseLocale(code) {
  setLocale(code)
  langOpen.value = false
}

function onDocClick(e) {
  if (langRoot.value && !langRoot.value.contains(e.target)) langOpen.value = false
}

function onKey(e) {
  if (e.key === 'Escape') {
    langOpen.value = false
    menuOpen.value = false
  }
}

// The cart count jumps when something is added, so the visitor sees where it went.
watch(() => cart.totalItems, (now, before) => {
  if (now > before) {
    bump.value = false
    requestAnimationFrame(() => (bump.value = true))
  }
})

watch(() => route.fullPath, () => (menuOpen.value = false))
watch(menuOpen, (open) => document.body.style.setProperty('overflow', open ? 'hidden' : ''))

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header class="bar">
    <RouterLink to="/" class="wordmark">Backline</RouterLink>

    <nav class="links" :aria-label="t('nav.menu')">
      <RouterLink v-for="l in links" :key="l.to" :to="l.to" class="link nav-link" exact-active-class="is-current">
        {{ t(l.key) }}
      </RouterLink>
    </nav>

    <div class="tools">
      <div ref="langRoot" class="lang">
        <button
          class="lang-btn"
          type="button"
          :aria-expanded="langOpen"
          aria-haspopup="true"
          :aria-label="t('nav.language')"
          @click="langOpen = !langOpen"
        >
          {{ LOCALES.find((l) => l.code === locale).short }}
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" /></svg>
        </button>
        <Transition name="drop">
          <ul v-if="langOpen" class="lang-menu" role="menu">
            <li v-for="l in LOCALES" :key="l.code" role="none">
              <button
                type="button"
                role="menuitemradio"
                :aria-checked="l.code === locale"
                :lang="l.code"
                @click="chooseLocale(l.code)"
              >
                <span>{{ l.label }}</span>
                <span class="lang-code">{{ l.short }}</span>
              </button>
            </li>
          </ul>
        </Transition>
      </div>

      <RouterLink to="/favorites" class="icon-btn fav-link" :aria-label="`${t('nav.favorites')}: ${favs.count}`">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" /></svg>
        <span v-if="favs.count" class="count">{{ favs.count }}</span>
      </RouterLink>

      <RouterLink to="/cart" class="btn btn--small cart-link" :class="{ bump }" @animationend="bump = false">
        {{ t('nav.cart') }}
        <span class="cart-count">{{ cart.totalItems }}</span>
      </RouterLink>

      <button class="menu-btn" type="button" :aria-expanded="menuOpen" aria-controls="mobile-menu" @click="menuOpen = !menuOpen">
        {{ menuOpen ? t('nav.close') : t('nav.menu') }}
      </button>
    </div>
  </header>

  <Transition name="sheet">
    <nav v-if="menuOpen" id="mobile-menu" class="sheet" :aria-label="t('nav.menu')">
      <RouterLink v-for="(l, i) in links" :key="l.to" :to="l.to" class="sheet-link" :style="{ '--i': i }">
        {{ t(l.key) }}
      </RouterLink>
      <RouterLink to="/favorites" class="sheet-link" :style="{ '--i': 4 }">{{ t('nav.favorites') }}</RouterLink>
      <div class="sheet-langs" :aria-label="t('nav.language')" role="group">
        <button
          v-for="l in LOCALES"
          :key="l.code"
          type="button"
          :lang="l.code"
          :aria-pressed="l.code === locale"
          @click="setLocale(l.code)"
        >
          {{ l.label }}
        </button>
      </div>
    </nav>
  </Transition>
</template>

<style scoped>
.bar {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--header-h);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
  padding-inline: var(--gutter);
  background: var(--bg);
}

.wordmark {
  font-weight: 600;
  font-size: 1.25rem;
  letter-spacing: -0.04em;
  justify-self: start;
  transition: color var(--dur-fast) ease;
}

.wordmark:hover {
  color: var(--accent);
}

.links {
  display: flex;
  gap: clamp(16px, 2.2vw, 36px);
}

.nav-link {
  font-size: var(--step-small);
  font-weight: 500;
}

.nav-link.is-current {
  text-decoration-color: currentColor;
}

.tools {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 8px;
}

.lang {
  position: relative;
}

.lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 44px;
  padding: 0 12px;
  font-size: var(--step-small);
  font-weight: 500;
  background: var(--surface-2);
  transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease;
}

.lang-btn:hover {
  background: var(--ink);
  color: var(--bg);
}

.lang-btn svg {
  transition: transform var(--dur) var(--ease-out);
}

.lang-btn[aria-expanded='true'] svg {
  transform: rotate(180deg);
}

.lang-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 200px;
  padding: 6px;
  background: var(--surface-2);
  box-shadow: 0 18px 40px rgb(0 0 0 / 0.5); /* taste-skill-ignore: floating menu */
  transform-origin: top right;
}

.lang-menu button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 12px;
  text-align: left;
  font-size: var(--step-small);
  transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease;
}

.lang-menu button:hover {
  background: var(--surface);
}

.lang-menu button[aria-checked='true'] {
  color: var(--accent);
}

.lang-code {
  color: var(--muted);
}

.fav-link {
  position: relative;
}

.count {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  display: grid;
  place-items: center;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1;
  background: var(--accent);
  color: var(--accent-ink);
}

.cart-link {
  min-height: 44px;
}

.cart-count {
  min-width: 1.5ch;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.cart-link.bump {
  animation: bump 480ms var(--ease-out);
}

@keyframes bump {
  0% { transform: scale(1); }
  30% { transform: scale(1.12); }
  60% { transform: scale(0.96); }
  100% { transform: scale(1); }
}

.menu-btn {
  display: none;
  height: 44px;
  padding: 0 12px;
  font-size: var(--step-small);
  font-weight: 500;
}

.drop-enter-active,
.drop-leave-active {
  transition: opacity var(--dur-fast) ease, transform var(--dur) var(--ease-out);
}

.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/* ---------- phone sheet ---------- */
.sheet {
  position: fixed;
  inset: var(--header-h) 0 0 0;
  z-index: 49;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px var(--gutter);
  background: var(--bg);
  overflow-y: auto;
}

.sheet-link {
  font-size: clamp(2rem, 10vw, 3rem);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.15;
  transition: color var(--dur-fast) ease;
}

.sheet-link:hover {
  color: var(--accent);
}

.sheet-langs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 32px;
}

.sheet-langs button {
  min-height: 44px;
  padding: 0 14px;
  background: var(--surface-2);
}

.sheet-langs button[aria-pressed='true'] {
  background: var(--accent);
  color: var(--accent-ink);
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity var(--dur) ease;
}

.sheet-enter-active .sheet-link {
  transition: transform var(--dur-slow) var(--ease-out), opacity var(--dur-slow) ease;
  transition-delay: calc(var(--i) * 50ms);
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .sheet-link {
  opacity: 0;
  transform: translateY(24px);
}

@media (max-width: 900px) {
  .bar {
    grid-template-columns: auto 1fr;
  }

  .links {
    display: none;
  }

  .menu-btn {
    display: inline-flex;
    align-items: center;
  }

  .lang {
    display: none;
  }
}

@media (max-width: 420px) {
  .fav-link {
    display: none;
  }
}
</style>
