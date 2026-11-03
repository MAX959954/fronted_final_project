<script setup>
import { useI18n } from '@/i18n'

const { t } = useI18n()
</script>

<template>
  <div class="page wrap lost">
    <p class="code" aria-hidden="true">404</p>
    <h1 class="page-title">{{ t('notFound.title') }}</h1>
    <p class="muted">{{ t('notFound.text') }}</p>
    <RouterLink to="/" class="btn">{{ t('notFound.home') }}</RouterLink>
  </div>
</template>

<style scoped>
.lost {
  display: grid;
  justify-items: start;
  align-content: center;
  gap: 16px;
}

.code {
  font-size: clamp(6rem, 26vw, 22rem);
  font-weight: 600;
  letter-spacing: -0.07em;
  line-height: 0.8;
  color: var(--accent);
  animation: flicker 2.4s steps(1) 1;
}

@keyframes flicker {
  0%, 12%, 16%, 30% { opacity: 1; }
  10%, 14%, 28% { opacity: 0.25; }
}

.page-title {
  margin-bottom: 0;
}
</style>
