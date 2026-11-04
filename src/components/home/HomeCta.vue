<script setup>
import { computed } from 'vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()

// One word is the button, sized so it always fills the width on one line.
const verb = computed(() => t('cta.verb'))
const verbSize = computed(() => {
  // CJK glyphs are roughly square, so they need almost twice the width of Latin letters.
  const wide = /[\u3000-\u9fff]/.test(verb.value) ? 1.02 : 0.6
  return `min(30vw, calc((100vw - 2 * var(--gutter)) / ${(verb.value.length * wide).toFixed(2)}))`
})
</script>

<template>
  <RouterLink to="/catalog" class="cta">
    <span class="cta-text">{{ t('cta.text') }}</span>
    <svg class="cta-arrow" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M12 36 36 12M16 12h20v20" fill="none" stroke="currentColor" stroke-width="3" />
    </svg>
    <span class="cta-verb" :style="{ fontSize: verbSize }">{{ verb }}</span>
  </RouterLink>
</template>

<style scoped>
/* ---------- cta ---------- */
.cta {
  position: relative;
  display: block;
  height: 60svh;
  min-height: 360px;
  margin-top: var(--section-gap);
  background: var(--accent);
  color: var(--accent-ink);
  overflow: hidden;
  transition:
    background-color 120ms linear,
    color 120ms linear;
}

.cta:hover,
.cta:focus-visible {
  background: var(--ink);
  color: var(--bg);
}

.cta:focus-visible {
  outline-offset: -6px;
}

.cta-text {
  position: absolute;
  top: 24px;
  left: var(--gutter);
  max-width: 32ch;
  font-size: var(--step-lead);
  font-weight: 500;
}

.cta-arrow {
  position: absolute;
  top: 24px;
  right: var(--gutter);
  transition: transform var(--dur) var(--ease-out);
}

.cta:hover .cta-arrow {
  transform: translate(6px, -6px);
}

.cta-verb {
  position: absolute;
  left: var(--gutter);
  bottom: 0.06em;
  font-weight: 600;
  letter-spacing: -0.06em;
  line-height: 0.8;
  white-space: nowrap;
  transition: transform 700ms var(--ease-out);
}

.cta:hover .cta-verb {
  transform: translateX(1.5vw);
}

@media (max-width: 900px) {
  .cta {
    height: 46svh;
    min-height: 300px;
  }

  .cta-text {
    max-width: 22ch;
  }

  .cta-arrow {
    width: 32px;
    height: 32px;
  }
}
</style>
