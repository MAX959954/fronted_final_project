<script setup>
import { computed } from 'vue'
import { useI18n } from '@/i18n'

const { t, tm } = useI18n()

const faq = computed(() => tm('faq.items'))
</script>

<template>
  <section class="faq wrap" aria-labelledby="faq-h">
    <h2 id="faq-h" v-reveal class="faq-head">{{ t('faq.heading') }}</h2>
    <div v-reveal class="faq-list">
      <details v-for="item in faq" :key="item.q" data-r>
        <summary>
          <span>{{ item.q }}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M7 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" />
          </svg>
        </summary>
        <p>{{ item.a }}</p>
      </details>
    </div>
  </section>
</template>

<style scoped>
/* ---------- faq ---------- */
.faq {
  padding-top: var(--section-gap);
}

.faq-head {
  font-size: var(--step-head);
  max-width: 16ch;
}

.faq-list {
  margin-top: 80px;
  margin-left: calc(4 / 12 * 100%);
  display: grid;
  gap: 12px;
}

details {
  padding: 12px 24px;
  margin-inline: -24px;
  transition: background-color var(--dur) ease;
}

details[open] {
  background: var(--surface);
}

summary {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  min-height: 48px;
  font-size: var(--step-lead);
  cursor: pointer;
}

summary::-webkit-details-marker {
  display: none;
}

summary svg {
  flex: none;
  transition:
    transform var(--dur) var(--ease-out),
    color var(--dur-fast) ease;
}

summary:hover svg {
  color: var(--accent);
}

details[open] summary svg {
  transform: rotate(90deg);
}

details p {
  max-width: 52ch;
  padding: 8px 0 16px;
  animation: answer 420ms var(--ease-out);
}

@keyframes answer {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}

@media (max-width: 900px) {
  .faq-list {
    margin-left: 0;
    margin-top: 48px;
  }

  details {
    margin-inline: calc(-1 * var(--gutter));
    padding-inline: var(--gutter);
  }
}
</style>
