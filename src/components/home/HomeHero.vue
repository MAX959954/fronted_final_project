<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n'
import { useCatalogStore } from '@/stores/catalog'
import { useScrollProgress } from '@/composables/useScroll'

const { t, price } = useI18n()

// The name holds while the backline is rolled on one piece at a time.
// The stage colour shows straight away; the products fill in as soon as the catalogue arrives.
const PANELS = [
  { id: 'ember-lp', ground: '#0f1417' },
  { id: 'stage-five', ground: '#12130f' },
  { id: 'walnut-ga', ground: '#17100b' },
  { id: 'dark-ride', ground: '#14110c' },
]
const catalog = useCatalogStore()
const panels = computed(() =>
  PANELS.flatMap((p) => {
    const product = catalog.productById(p.id)
    return product ? [{ ...p, product }] : []
  }),
)

const heroEl = ref(null)
const progress = useScrollProgress(heroEl)
const active = computed(() => Math.min(PANELS.length - 1, Math.floor(progress.value * PANELS.length)))
const current = computed(() => panels.value[active.value])
</script>

<template>
  <section ref="heroEl" class="hero" :style="{ '--panels': PANELS.length }">
    <div class="hero-stage" :style="{ backgroundColor: PANELS[active].ground }">
      <h1 class="hero-title">
        Backline<span class="visually-hidden"> · {{ t('meta.title').split('—').pop() }}</span>
      </h1>

      <div class="hero-frame">
        <img
          v-for="(p, i) in panels"
          :key="p.product.id"
          :src="p.product.image.src"
          :srcset="p.product.image.srcset"
          sizes="(max-width: 720px) 100vw, 66vh"
          :alt="p.product.name"
          :class="{ on: i === active, past: i < active }"
          width="800"
          height="1200"
          :loading="i === 0 ? 'eager' : 'lazy'"
          :fetchpriority="i === 0 ? 'high' : 'auto'"
        />
      </div>

      <p class="hero-lead">{{ t('hero.lead') }}</p>

      <div class="hero-side">
        <Transition name="caption" mode="out-in">
          <p v-if="current" :key="current.product.id" class="hero-caption">
            <RouterLink :to="`/product/${current.product.id}`" class="link">{{ current.product.name }}</RouterLink>
            <span>{{ price(current.product.price) }}</span>
          </p>
        </Transition>
        <RouterLink to="/catalog" class="btn">{{ t('hero.cta') }}</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ---------- hero ---------- */
/* The pin holds for one and a half screens beyond the first; each panel gets its share of that run. */
.hero {
  position: relative;
  height: 250svh;
}

.hero-stage {
  position: sticky;
  top: var(--header-h);
  height: calc(100svh - var(--header-h));
  overflow: hidden;
  transition: background-color 900ms ease;
}

.hero-title {
  position: absolute;
  z-index: 2;
  top: clamp(8px, 2vw, 32px);
  left: 0;
  right: 0;
  text-align: center;
  font-size: var(--step-display);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 0.82;
  text-transform: uppercase;
  color: var(--ink);
  pointer-events: none;
  animation: title-in 1.1s var(--ease-out) both;
}

@keyframes title-in {
  from {
    opacity: 0;
    transform: translateY(0.12em);
    letter-spacing: 0.02em;
  }
}

.hero-frame {
  position: absolute;
  left: 50%;
  top: calc(var(--step-display) * 0.42);
  bottom: 0;
  aspect-ratio: 2 / 3;
  transform: translateX(-50%);
  overflow: hidden;
  background: var(--surface);
}

.hero-frame img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  clip-path: inset(100% 0 0 0);
  transform: scale(1.12);
  transition:
    clip-path 900ms var(--ease-in-out),
    transform 1600ms var(--ease-out);
}

.hero-frame img.on,
.hero-frame img.past {
  clip-path: inset(0 0 0 0);
}

.hero-frame img.on {
  z-index: 1;
  transform: scale(1);
  animation: drift 14s ease-in-out infinite alternate;
}

@keyframes drift {
  to {
    transform: scale(1.06) translateY(-1.5%);
  }
}

.hero-lead {
  position: absolute;
  left: var(--gutter);
  bottom: 32px;
  max-width: 26ch;
  font-weight: 500;
  animation: rise 900ms 250ms var(--ease-out) both;
}

.hero-side {
  position: absolute;
  right: var(--gutter);
  bottom: 32px;
  display: grid;
  justify-items: end;
  gap: 16px;
  animation: rise 900ms 400ms var(--ease-out) both;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}

.hero-caption {
  display: grid;
  justify-items: end;
}

.hero-caption span {
  color: var(--muted);
}

.caption-enter-active,
.caption-leave-active {
  transition:
    opacity 240ms ease,
    transform 360ms var(--ease-out);
}

.caption-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.caption-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 720px) {
  .hero-frame {
    left: var(--gutter);
    right: var(--gutter);
    top: calc(var(--step-display) * 0.55);
    bottom: 168px;
    aspect-ratio: auto;
    transform: none;
  }

  .hero-lead {
    bottom: 96px;
    right: var(--gutter);
    max-width: none;
  }

  .hero-side {
    left: var(--gutter);
    bottom: 20px;
    grid-template-columns: 1fr auto;
    align-items: end;
    justify-items: start;
  }

  .hero-caption {
    justify-items: start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-frame img.on {
    animation: none;
  }
}
</style>
