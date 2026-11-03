<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/i18n'
import { useCartStore } from '@/stores/cart'

const { t, price } = useI18n()
const cart = useCartStore()
const router = useRouter()

const form = reactive({ name: '', email: '', phone: '', country: '', city: '', street: '', zip: '', comment: '' })
const delivery = ref('courier')
const payment = ref('cod')
const errors = reactive({})
const sending = ref(false)

const needsAddress = computed(() => delivery.value === 'courier')
const shipping = computed(() => cart.shipping(delivery.value))
const required = computed(() => ['name', 'email', 'phone', ...(needsAddress.value ? ['country', 'city', 'street', 'zip'] : [])])

function validate() {
  for (const key of Object.keys(errors)) delete errors[key]
  for (const key of required.value) {
    if (!form[key].trim()) errors[key] = t('checkout.required')
  }
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = t('checkout.emailBad')
  return Object.keys(errors).length === 0
}

function submit() {
  if (!validate()) {
    const first = document.getElementById(`f-${Object.keys(errors)[0]}`)
    first?.focus()
    return
  }
  sending.value = true
  const customer = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]))
  const order = cart.placeOrder({ customer, delivery: delivery.value, payment: payment.value, comment: customer.comment })
  router.push(`/order/${order.id}`)
}

const fields = {
  contact: [
    { key: 'name', type: 'text', auto: 'name' },
    { key: 'email', type: 'email', auto: 'email' },
    { key: 'phone', type: 'tel', auto: 'tel' },
  ],
  address: [
    { key: 'country', type: 'text', auto: 'country-name' },
    { key: 'city', type: 'text', auto: 'address-level2' },
    { key: 'street', type: 'text', auto: 'street-address' },
    { key: 'zip', type: 'text', auto: 'postal-code' },
  ],
}
</script>

<template>
  <div class="page wrap checkout">
    <h1 class="page-title">{{ t('checkout.title') }}</h1>

    <div v-if="!cart.lines.length && !sending" class="empty">
      <p>{{ t('checkout.empty') }}</p>
      <RouterLink to="/catalog" class="btn">{{ t('cart.browse') }}</RouterLink>
    </div>

    <form v-else class="layout" novalidate @submit.prevent="submit">
      <div class="form">
        <fieldset v-reveal>
          <legend data-r>{{ t('checkout.contact') }}</legend>
          <div class="grid" data-r>
            <div v-for="f in fields.contact" :key="f.key" class="field" :class="{ wide: f.key === 'name' }">
              <label :for="`f-${f.key}`">{{ t(`checkout.${f.key}`) }}</label>
              <input
                :id="`f-${f.key}`"
                v-model="form[f.key]"
                :type="f.type"
                :autocomplete="f.auto"
                :aria-invalid="!!errors[f.key]"
                :aria-describedby="errors[f.key] ? `e-${f.key}` : undefined"
              />
              <p v-if="errors[f.key]" :id="`e-${f.key}`" class="error">{{ errors[f.key] }}</p>
            </div>
          </div>
        </fieldset>

        <fieldset v-reveal>
          <legend data-r>{{ t('checkout.delivery') }}</legend>
          <div class="options" data-r>
            <label class="option" :class="{ on: delivery === 'courier' }">
              <input v-model="delivery" type="radio" value="courier" />
              <span class="opt-title">{{ t('checkout.courier') }}</span>
              <span class="muted">{{ t('checkout.courierNote') }} · {{ cart.shipping('courier') ? price(cart.shipping('courier')) : t('cart.free') }}</span>
            </label>
            <label class="option" :class="{ on: delivery === 'pickup' }">
              <input v-model="delivery" type="radio" value="pickup" />
              <span class="opt-title">{{ t('checkout.pickup') }}</span>
              <span class="muted">{{ t('checkout.pickupNote') }}</span>
            </label>
          </div>
        </fieldset>

        <Transition name="fold">
          <fieldset v-if="needsAddress">
            <legend>{{ t('checkout.address') }}</legend>
            <div class="grid">
              <div v-for="f in fields.address" :key="f.key" class="field" :class="{ wide: f.key === 'street' }">
                <label :for="`f-${f.key}`">{{ t(`checkout.${f.key}`) }}</label>
                <input
                  :id="`f-${f.key}`"
                  v-model="form[f.key]"
                  :type="f.type"
                  :autocomplete="f.auto"
                  :aria-invalid="!!errors[f.key]"
                  :aria-describedby="errors[f.key] ? `e-${f.key}` : undefined"
                />
                <p v-if="errors[f.key]" :id="`e-${f.key}`" class="error">{{ errors[f.key] }}</p>
              </div>
            </div>
          </fieldset>
        </Transition>

        <fieldset v-reveal>
          <legend data-r>{{ t('checkout.payment') }}</legend>
          <div class="options" data-r>
            <label class="option" :class="{ on: payment === 'cod' }">
              <input v-model="payment" type="radio" value="cod" />
              <span class="opt-title">{{ t('checkout.cod') }}</span>
            </label>
            <label class="option" :class="{ on: payment === 'transfer' }">
              <input v-model="payment" type="radio" value="transfer" />
              <span class="opt-title">{{ t('checkout.transfer') }}</span>
            </label>
          </div>
          <p class="muted note" data-r>{{ t('checkout.payNote') }}</p>
        </fieldset>

        <div class="field">
          <label for="f-comment">{{ t('checkout.comment') }}</label>
          <textarea id="f-comment" v-model="form.comment" :placeholder="t('checkout.commentHint')" />
        </div>
      </div>

      <aside class="summary">
        <h2>{{ t('checkout.summary') }}</h2>
        <ul class="items">
          <li v-for="line in cart.lines" :key="line.id">
            <img :src="line.product.image" alt="" width="56" height="70" />
            <span class="item-name">{{ line.product.name }} <span class="muted">× {{ line.qty }}</span></span>
            <span>{{ price(line.total) }}</span>
          </li>
        </ul>
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
        <button type="submit" class="btn place" :disabled="sending">{{ t('checkout.place') }}</button>
      </aside>
    </form>
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
  grid-template-columns: minmax(0, 1fr) minmax(300px, 400px);
  gap: clamp(32px, 5vw, 80px);
  align-items: start;
}

.form {
  display: grid;
  gap: 48px;
}

fieldset {
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}

legend {
  padding: 0;
  margin-bottom: 20px;
  font-size: var(--step-lead);
  font-weight: 500;
  letter-spacing: -0.02em;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.wide {
  grid-column: 1 / -1;
}

.options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.option {
  position: relative;
  display: grid;
  gap: 4px;
  padding: 18px 18px 18px 52px;
  background: var(--surface);
  cursor: pointer;
  transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease;
}

.option:hover {
  background: var(--surface-2);
}

.option.on {
  background: var(--accent);
  color: var(--accent-ink);
}

.option.on .muted {
  color: var(--accent-ink);
}

.option.on input {
  accent-color: var(--accent-ink);
}

.option input {
  position: absolute;
  left: 18px;
  top: 20px;
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: var(--accent);
}

.opt-title {
  font-weight: 500;
}

.option .muted {
  font-size: var(--step-small);
}

.note {
  margin-top: 12px;
  font-size: var(--step-small);
}

.fold-enter-active,
.fold-leave-active {
  transition: opacity var(--dur) ease, transform var(--dur) var(--ease-out);
}

.fold-enter-from,
.fold-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.summary {
  position: sticky;
  top: calc(var(--header-h) + 24px);
  display: grid;
  gap: 20px;
  padding: 28px;
  background: var(--surface);
}

.summary h2 {
  font-size: var(--step-lead);
}

.items {
  display: grid;
  gap: 12px;
}

.items li {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 12px;
  align-items: center;
  font-size: var(--step-small);
}

.items img {
  width: 56px;
  height: 70px;
  object-fit: cover;
}

dl {
  display: grid;
  gap: 10px;
  padding-top: 8px;
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
  padding-top: 12px;
  font-size: var(--step-lead);
  font-weight: 500;
}

.total dt {
  color: var(--ink);
}

.place {
  width: 100%;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .summary {
    position: static;
  }
}

@media (max-width: 560px) {
  .grid,
  .options {
    grid-template-columns: 1fr;
  }
}
</style>
