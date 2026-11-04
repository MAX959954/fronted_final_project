<script setup lang="ts">
// Renders its content once the catalogue is in. Until then it shows the `loading` slot
// (a skeleton shaped like the page), and if the request failed, an error with a retry button.
import { useI18n } from '@/i18n'
import { useCatalogStore } from '@/stores/catalog'
import LoadError from './LoadError.vue'

defineProps<{
  /** Give the error message the usual page margins, for pages whose own wrapper sits inside the gate. */
  framed?: boolean
}>()

const { t } = useI18n()
const catalog = useCatalogStore()
</script>

<template>
  <slot v-if="catalog.status === 'ready'" />
  <div v-else-if="catalog.status === 'error'" :class="{ 'page wrap': framed }">
    <LoadError @retry="catalog.load()" />
  </div>
  <div v-else aria-busy="true">
    <p class="visually-hidden" role="status">{{ t('state.loading') }}</p>
    <slot name="loading" />
  </div>
</template>
