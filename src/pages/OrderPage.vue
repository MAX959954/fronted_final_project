<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/i18n'
import { productById } from '@/data/products'
import { useCartStore } from '@/stores/cart'

const { t, price, date } = useI18n()
const route = useRoute()
const cart = useCartStore()

const order = computed(() => cart.findOrder(route.params.id))
const lines = computed(() =>
  (order.value?.items || []).map((i) => ({ ...i, product: productById(i.id) })).filter((l) => l.product),
)
</script>

<template>
  <div class="page wrap order">
    <template v-if="order">
      <div v-reveal class="head">
        <svg class="tick" data-r width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
          <circle cx="36" cy="36" r="33" fill="var(--accent)" />
          <path d="m22 37 9 9 19-20" fill="none" stroke="var(--accent-ink)" stroke-width="5" />
        </svg>
        <h1 class="page-title" data-r>{{ t('order.title') }}</h1>
        <p class="lead" data-r>{{ t('order.text', { email: order.customer.email }) }}</p>
      </div>

      <div v-reveal class="body">
        <dl class="meta" data-r>
          <div>
            <dt>{{ t('order.number') }}</dt>
            <dd>{{ order.id }}</dd>
          </div>
          <div>
            <dt>{{ t('order.date') }}</dt>
            <dd>{{ date(order.date) }}</dd>
          </div>
          <div>
            <dt>{{ t('cart.delivery') }}</dt>
            <dd>{{ t(order.delivery === 'pickup' ? 'checkout.pickup' : 'checkout.courier') }}</dd>
          </div>
          <div>
            <dt>{{ t('checkout.payment') }}</dt>
            <dd>{{ t(order.payment === 'transfer' ? 'checkout.transfer' : 'checkout.cod') }}</dd>
          </div>
        </dl>

        <section data-r aria-labelledby="items-h">
          <h2 id="items-h">{{ t('order.items') }}</h2>
          <ul class="items">
            <li v-for="l in lines" :key="l.id">
              <img :src="l.product.image" alt="" width="64" height="80" />
              <span
                >{{ l.product.name }} <span class="muted">× {{ l.qty }}</span></span
              >
              <span>{{ price(l.price * l.qty) }}</span>
            </li>
          </ul>
          <p class="total">
            <span>{{ t('cart.total') }}</span>
            <span>{{ price(order.total) }}</span>
          </p>
        </section>
      </div>

      <RouterLink to="/catalog" class="btn">{{ t('order.back') }}</RouterLink>
    </template>

    <template v-else>
      <h1 class="page-title">{{ t('order.missing') }}</h1>
      <RouterLink to="/catalog" class="btn">{{ t('order.back') }}</RouterLink>
    </template>
  </div>
</template>

<style scoped>
.order {
  display: grid;
  justify-items: start;
  gap: 48px;
}

.head {
  display: grid;
  gap: 16px;
}

.tick {
  animation: pop 700ms var(--ease-out) both;
}

.tick path {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: draw 600ms 300ms var(--ease-out) forwards;
}

@keyframes pop {
  from {
    transform: scale(0.4);
    opacity: 0;
  }
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

.page-title {
  margin-bottom: 0;
}

.lead {
  font-size: var(--step-lead);
  max-width: 36ch;
}

.body {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  gap: clamp(32px, 5vw, 80px);
}

.meta {
  display: grid;
  gap: 16px;
  align-content: start;
}

.meta dt {
  color: var(--muted);
  font-size: var(--step-small);
}

.meta dd {
  font-weight: 500;
}

h2 {
  font-size: var(--step-lead);
  margin-bottom: 16px;
}

.items {
  display: grid;
  gap: 8px;
}

.items li {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 8px;
  background: var(--surface);
}

.items img {
  width: 64px;
  height: 80px;
  object-fit: cover;
}

.total {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: var(--step-lead);
  font-weight: 500;
}

@media (max-width: 760px) {
  .body {
    grid-template-columns: 1fr;
  }
}
</style>
