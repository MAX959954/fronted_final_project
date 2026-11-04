<script setup>
import { computed } from 'vue'
import { useI18n } from '@/i18n'
import { useCartStore, FREE_SHIPPING_FROM } from '@/stores/cart'
import QtyStepper from '@/components/QtyStepper.vue'

const { t, price } = useI18n()
const cart = useCartStore()

const shipping = computed(() => cart.shipping('courier'))
const progress = computed(() => Math.min(1, cart.subtotal / FREE_SHIPPING_FROM))
</script>

<template>
  <div class="page wrap cart">
    <h1 class="page-title">{{ t('cart.title') }}</h1>

    <div v-if="!cart.lines.length" class="empty">
      <p>{{ t('cart.empty') }}</p>
      <RouterLink to="/catalog" class="btn">{{ t('cart.browse') }}</RouterLink>
    </div>

    <div v-else class="layout">
      <TransitionGroup tag="ul" name="line" class="lines">
        <li v-for="line in cart.lines" :key="line.id" class="line">
          <RouterLink :to="`/product/${line.id}`" class="thumb">
            <img :src="line.product.image" :alt="line.product.name" width="160" height="200" loading="lazy" />
          </RouterLink>
          <div class="line-info">
            <p class="muted sub">{{ t(`cats.${line.product.sub}`) }}</p>
            <RouterLink :to="`/product/${line.id}`" class="link name">{{ line.product.name }}</RouterLink>
            <p class="muted">{{ price(line.product.price) }}</p>
          </div>
          <QtyStepper
            :model-value="line.qty"
            :label="line.product.name"
            @update:model-value="cart.setQty(line.id, $event)"
          />
          <p class="line-total">{{ price(line.total) }}</p>
          <button type="button" class="remove link" @click="cart.remove(line.id)">{{ t('cart.remove') }}</button>
        </li>
      </TransitionGroup>

      <aside class="summary">
        <div class="free">
          <p>
            {{
              cart.leftForFreeShipping
                ? t('cart.freeLeft', { amount: price(cart.leftForFreeShipping) })
                : t('cart.freeDone')
            }}
          </p>
          <div
            class="meter"
            role="progressbar"
            :aria-valuenow="Math.round(progress * 100)"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span :style="{ transform: `scaleX(${progress})` }" />
          </div>
        </div>
        <dl>
          <div>
            <dt>{{ t('cart.subtotal') }}</dt>
            <dd>{{ price(cart.subtotal) }}</dd>
          </div>
          <div>
            <dt>{{ t('cart.delivery') }}</dt>
            <dd>{{ shipping ? price(shipping) : t('cart.free') }}</dd>
          </div>
          <div class="total">
            <dt>{{ t('cart.total') }}</dt>
            <dd>{{ price(cart.subtotal + shipping) }}</dd>
          </div>
        </dl>
        <RouterLink to="/checkout" class="btn checkout">{{ t('cart.checkout') }}</RouterLink>
        <div class="minor">
          <RouterLink to="/catalog" class="link">{{ t('cart.continue') }}</RouterLink>
          <button type="button" class="link muted" @click="cart.clear()">{{ t('cart.clear') }}</button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.empty {
  display: grid;
  justify-items: start;
  gap: 24px;
  font-size: var(--step-lead);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 380px);
  gap: clamp(32px, 5vw, 80px);
  align-items: start;
}

.lines {
  display: grid;
  gap: 8px;
}

.line {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) auto 110px auto;
  align-items: center;
  gap: 24px;
  padding: 12px;
  background: var(--surface);
}

.thumb {
  overflow: hidden;
}

.thumb img {
  width: 96px;
  height: 120px;
  object-fit: cover;
  transition: transform 600ms var(--ease-out);
}

.thumb:hover img {
  transform: scale(1.08);
}

.line-info {
  display: grid;
  gap: 2px;
}

.sub {
  font-size: var(--step-small);
}

.name {
  font-size: var(--step-lead);
  font-weight: 500;
  letter-spacing: -0.02em;
  width: fit-content;
}

.line-total {
  text-align: right;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.remove {
  font-size: var(--step-small);
  color: var(--muted);
}

.remove:hover {
  color: var(--danger);
}

.line-enter-active,
.line-leave-active {
  transition:
    opacity 300ms ease,
    transform 400ms var(--ease-out);
}

.line-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.line-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.line-move {
  transition: transform 400ms var(--ease-out);
}

.summary {
  position: sticky;
  top: calc(var(--header-h) + 24px);
  display: grid;
  gap: 24px;
  padding: 28px;
  background: var(--surface);
}

.free {
  display: grid;
  gap: 10px;
  font-size: var(--step-small);
}

.meter {
  height: 6px;
  background: var(--surface-2);
  overflow: hidden;
}

.meter span {
  display: block;
  height: 100%;
  background: var(--accent);
  transform-origin: left;
  transition: transform 700ms var(--ease-out);
}

dl {
  display: grid;
  gap: 10px;
}

dl div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

dt {
  color: var(--muted);
}

dd {
  font-variant-numeric: tabular-nums;
}

.total {
  padding-top: 14px;
  font-size: var(--step-lead);
  font-weight: 500;
}

.total dt {
  color: var(--ink);
}

.checkout {
  width: 100%;
}

.minor {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  font-size: var(--step-small);
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .line {
    grid-template-columns: 80px minmax(0, 1fr) auto;
    grid-template-areas:
      'thumb info info'
      'thumb qty total'
      'thumb remove remove';
    gap: 8px 16px;
  }

  .thumb {
    grid-area: thumb;
  }
  .line-info {
    grid-area: info;
  }
  .stepper {
    grid-area: qty;
  }
  .line-total {
    grid-area: total;
  }
  .remove {
    grid-area: remove;
    justify-self: start;
  }

  .thumb img {
    width: 80px;
    height: 100px;
  }
}
</style>
