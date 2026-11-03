<script setup>
import { useI18n } from '@/i18n'
import { useSoundcheck } from '@/composables/useSoundcheck'

const props = defineProps({ sound: { type: String, required: true } })
const { t } = useI18n()
const { playing, trigger, supported } = useSoundcheck()
</script>

<template>
  <button
    v-if="supported"
    type="button"
    class="soundcheck"
    :class="{ 'is-playing': playing }"
    :aria-pressed="playing"
    :title="t('product.soundHint')"
    @click="trigger(props.sound)"
  >
    <span class="meter" aria-hidden="true">
      <i v-for="n in 5" :key="n" :style="{ '--n': n }" />
    </span>
    {{ playing ? t('product.playing') : t('product.soundcheck') }}
  </button>
</template>

<style scoped>
.soundcheck {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 0 20px 0 16px;
  background: var(--surface-2);
  font-weight: 500;
  transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease, transform var(--dur-fast) var(--ease-out);
}

.soundcheck:hover {
  background: var(--ink);
  color: var(--bg);
}

.soundcheck:active {
  transform: scale(0.97);
}

.meter {
  display: inline-flex;
  align-items: flex-end;
  gap: 3px;
  height: 20px;
}

.meter i {
  width: 3px;
  height: calc(var(--n) * 3px + 3px);
  background: var(--accent);
  transform-origin: bottom;
}

.is-playing .meter i {
  animation: level 520ms ease-in-out infinite alternate;
  animation-delay: calc(var(--n) * -110ms);
}

@keyframes level {
  from { transform: scaleY(0.25); }
  to { transform: scaleY(1.25); }
}
</style>
