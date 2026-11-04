<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n'
import { photo } from '@/data/images'
import { useScrollProgress } from '@/composables/useScroll'

const { t } = useI18n()

// One frame, three distances: the photo moves closer in steps as the section is scrolled through.
const setupEl = ref(null)
const progress = useScrollProgress(setupEl)
const setupStage = computed(() => (progress.value < 0.3 ? 0 : progress.value < 0.65 ? 1 : 2))
const setupPhoto = photo('g-brass')
const distances = [
  { scale: 1, origin: '50% 50%' },
  { scale: 1.8, origin: '58% 62%' },
  { scale: 3.2, origin: '46% 30%' },
]
</script>

<template>
  <section ref="setupEl" class="setup" aria-labelledby="setup-h">
    <div class="setup-stage wrap">
      <h2 id="setup-h" class="setup-head">
        <span class="setup-a">{{ t('setup.a') }}</span>
        <span class="setup-b" :class="{ shown: setupStage >= 1 }">{{ t('setup.b') }}</span>
      </h2>
      <div class="setup-frame">
        <img
          :src="setupPhoto.src"
          :srcset="setupPhoto.srcset"
          sizes="(max-width: 720px) 100vw, 30vw"
          alt="Brass T-Line"
          width="800"
          height="1000"
          loading="lazy"
          :style="{
            transform: `scale(${distances[setupStage].scale})`,
            transformOrigin: distances[setupStage].origin,
          }"
        />
      </div>
      <p class="setup-caption" :class="{ shown: setupStage >= 2 }">{{ t('setup.caption') }}</p>
    </div>
  </section>
</template>

<style scoped>
/* ---------- setup ---------- */
.setup {
  height: 200svh;
  margin-top: var(--section-gap);
}

.setup-stage {
  position: sticky;
  top: var(--header-h);
  height: calc(100svh - var(--header-h));
  display: grid;
  grid-template-columns: 1fr minmax(0, 30vw) 1fr;
  grid-template-rows: auto 1fr;
  align-items: center;
  column-gap: 32px;
}

.setup-head {
  grid-column: 1 / -1;
  grid-row: 1;
  display: grid;
  justify-items: center;
  font-size: var(--step-head);
  text-align: center;
  padding-top: 3vh;
}

.setup-b {
  color: var(--accent);
  opacity: 0;
  transform: translateY(0.4em);
  transition:
    opacity 500ms ease,
    transform 700ms var(--ease-out);
}

.setup-b.shown {
  opacity: 1;
  transform: none;
}

.setup-frame {
  grid-column: 2;
  grid-row: 2;
  justify-self: center;
  width: min(30vw, 100%);
  max-height: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--surface);
}

.setup-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 900ms var(--ease-in-out),
    transform-origin 900ms var(--ease-in-out);
}

.setup-caption {
  grid-column: 3;
  grid-row: 2;
  align-self: start;
  max-width: 30ch;
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 500ms ease,
    transform 700ms var(--ease-out);
}

.setup-caption.shown {
  opacity: 1;
  transform: none;
}

@media (max-width: 900px) {
  .setup-stage {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    align-content: center;
    row-gap: 20px;
  }

  .setup-head,
  .setup-frame,
  .setup-caption {
    grid-column: 1;
  }

  .setup-head {
    grid-row: 1;
  }

  .setup-frame {
    grid-row: 2;
    width: 70vw;
    max-height: 52svh;
  }

  .setup-caption {
    grid-row: 3;
    justify-self: center;
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .setup-b,
  .setup-caption {
    opacity: 1;
    transform: none;
  }
}
</style>
