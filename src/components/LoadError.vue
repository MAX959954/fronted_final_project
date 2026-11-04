<script setup lang="ts">
import { useI18n } from '@/i18n'

defineEmits<{ retry: [] }>()

const { t } = useI18n()
</script>

<template>
  <div class="load-error" role="alert">
    <p>{{ t('state.error') }}</p>
    <button type="button" class="btn" @click="$emit('retry')">{{ t('state.retry') }}</button>
  </div>
</template>

<style scoped>
.load-error {
  display: grid;
  justify-items: start;
  gap: 24px;
  max-width: 48ch;
  font-size: var(--step-lead);
}
</style>
