<script setup>
import { useI18n } from '@/i18n'

const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 20 },
  label: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()

function set(value) {
  emit('update:modelValue', Math.min(props.max, Math.max(props.min, value)))
}
</script>

<template>
  <div class="stepper" role="group" :aria-label="label || t('product.qty')">
    <button type="button" :aria-label="t('cart.minus')" :disabled="modelValue <= min" @click="set(modelValue - 1)">
      −
    </button>
    <output aria-live="polite">{{ modelValue }}</output>
    <button type="button" :aria-label="t('cart.plus')" :disabled="modelValue >= max" @click="set(modelValue + 1)">
      +
    </button>
  </div>
</template>

<style scoped>
.stepper {
  display: inline-grid;
  grid-template-columns: 44px 3ch 44px;
  align-items: center;
  background: var(--surface-2);
}

.stepper button {
  height: 44px;
  font-size: 1.25rem;
  transition:
    background-color var(--dur-fast) ease,
    color var(--dur-fast) ease,
    transform var(--dur-fast) var(--ease-out);
}

.stepper button:hover:not([disabled]) {
  background: var(--ink);
  color: var(--bg);
}

.stepper button:active:not([disabled]) {
  transform: scale(0.9);
}

.stepper button[disabled] {
  opacity: 0.35;
  cursor: not-allowed;
}

output {
  text-align: center;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}
</style>
