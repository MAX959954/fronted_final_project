<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from '@/i18n'
import { productById, fromPrice } from '@/data/products'

import surfImg from '@/assets/img/g-surf.jpg'
import canaryImg from '@/assets/img/g-canary.jpg'
import electronicImg from '@/assets/img/d-electronic.jpg'
import snareImg from '@/assets/img/d-snare.jpg'
import hihatImg from '@/assets/img/c-hihat.jpg'
import comboImg from '@/assets/img/a-stagecombo.jpg'
import boardImg from '@/assets/img/a-pedalboard.jpg'
import picksImg from '@/assets/img/a-picks.jpg'
import brassImg from '@/assets/img/g-brass.jpg'
import fretboardImg from '@/assets/img/s-fretboard.jpg'
import roomImg from '@/assets/img/s-room.jpg'
import acousticImg from '@/assets/img/s-acoustic.jpg'
import playerImg from '@/assets/img/s-player.jpg'
import stageImg from '@/assets/img/s-stage.jpg'
import studioImg from '@/assets/img/s-studio.jpg'
import drummerImg from '@/assets/img/s-drummer.jpg'

const { t, price } = useI18n()

/* ---------- hero: the name holds, the backline is rolled on one piece at a time ---------- */
const panels = [
  { product: productById('ember-lp'), ground: '#0f1417' },
  { product: productById('stage-five'), ground: '#12130f' },
  { product: productById('walnut-ga'), ground: '#17100b' },
  { product: productById('dark-ride'), ground: '#14110c' },
]
const heroEl = ref(null)
const active = ref(0)
const current = computed(() => panels[active.value])

/* ---------- choose your sound ---------- */
const rows = [
  { sub: 'electric', image: surfImg, to: '/catalog?cat=guitars&sub=electric' },
  { sub: 'acoustic', image: canaryImg, to: '/catalog?cat=guitars&sub=acoustic' },
  { sub: 'kits', image: electronicImg, to: '/catalog?cat=drums&sub=kits' },
  { sub: 'snares', image: snareImg, to: '/catalog?cat=drums&sub=snares' },
  { sub: 'cymbals', image: hihatImg, to: '/catalog?cat=drums&sub=cymbals' },
  { sub: 'amps', image: comboImg, to: '/catalog?cat=accessories&sub=amps' },
  { sub: 'pedals', image: boardImg, to: '/catalog?cat=accessories&sub=pedals' },
  {
    sub: 'extras',
    image: picksImg,
    to: '/catalog?cat=accessories',
    from: Math.min(fromPrice('picks'), fromPrice('strings')),
  },
]
const activeRow = ref(0)
const rowEls = ref([])
const rowName = (row) => (row.sub === 'extras' ? t('sound.extrasName') : t(`cats.${row.sub}`))
const rowFrom = (row) => price(row.from ?? fromPrice(row.sub))

/* ---------- setup: one frame, three distances ---------- */
const setupEl = ref(null)
const setupStage = ref(0)
const distances = [
  { scale: 1, origin: '50% 50%' },
  { scale: 1.8, origin: '58% 62%' },
  { scale: 3.2, origin: '46% 30%' },
]

/* ---------- service ---------- */
const serviceImages = [fretboardImg, roomImg, acousticImg, playerImg]
const blocks = computed(() => t('service.blocks'))

/* ---------- gallery ---------- */
const galleryImages = [stageImg, studioImg, drummerImg]
const galleryFocus = ['50% 50%', '50% 8%', '50% 40%']
const galleryEls = ref([])

/* ---------- faq / cta ---------- */
const faq = computed(() => t('faq.items'))
const verb = computed(() => t('cta.verb'))
const verbSize = computed(() => {
  const wide = /[　-鿿]/.test(verb.value) ? 1.02 : 0.6
  return `min(30vw, calc((100vw - 2 * var(--gutter)) / ${(verb.value.length * wide).toFixed(2)}))`
})

/* ---------- one scroll loop drives every scroll-linked piece ---------- */
const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v))
let frame = 0

function update() {
  frame = 0
  const vh = window.innerHeight

  if (heroEl.value) {
    const r = heroEl.value.getBoundingClientRect()
    const p = clamp(-r.top / Math.max(1, r.height - vh))
    active.value = Math.min(panels.length - 1, Math.floor(p * panels.length))
  }

  if (setupEl.value) {
    const r = setupEl.value.getBoundingClientRect()
    const p = clamp(-r.top / Math.max(1, r.height - vh))
    setupStage.value = p < 0.3 ? 0 : p < 0.65 ? 1 : 2
  }

  // The row nearest the middle of the screen is the one being read.
  if (rowEls.value.length && !hovering) {
    const mid = vh * 0.5
    let best = activeRow.value
    let bestDist = Infinity
    rowEls.value.forEach((el, i) => {
      const r = el.getBoundingClientRect()
      const d = Math.abs(r.top + 29 - mid)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    const list = rowEls.value[0].parentElement.getBoundingClientRect()
    if (list.top < mid && list.bottom > mid) activeRow.value = best
  }

  for (const el of galleryEls.value) {
    const r = el.getBoundingClientRect()
    if (r.bottom < 0 || r.top > vh) continue
    el.style.setProperty('--p', clamp((vh - r.top) / (vh + r.height)).toFixed(3))
  }
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(update)
}

let hovering = false
function hoverRow(i) {
  hovering = true
  activeRow.value = i
}
function leaveRows() {
  hovering = false
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div class="home">
    <!-- HERO -->
    <section ref="heroEl" class="hero" :style="{ '--panels': panels.length }">
      <div class="hero-stage" :style="{ backgroundColor: current.ground }">
        <h1 class="hero-title">
          Backline<span class="visually-hidden"> · {{ t('meta.title').split('—').pop() }}</span>
        </h1>

        <div class="hero-frame">
          <img
            v-for="(p, i) in panels"
            :key="p.product.id"
            :src="p.product.image"
            :alt="p.product.name"
            :class="{ on: i === active, past: i < active }"
            width="800"
            height="1200"
            :loading="i === 0 ? 'eager' : 'lazy'"
            :fetchpriority="i === 0 ? 'high' : 'auto'"
          />
        </div>

        <p class="hero-lead">{{ t('hero.lead') }}</p>

        <div class="hero-side">
          <Transition name="caption" mode="out-in">
            <p :key="current.product.id" class="hero-caption">
              <RouterLink :to="`/product/${current.product.id}`" class="link">{{ current.product.name }}</RouterLink>
              <span>{{ price(current.product.price) }}</span>
            </p>
          </Transition>
          <RouterLink to="/catalog" class="btn">{{ t('hero.cta') }}</RouterLink>
        </div>
      </div>
    </section>

    <!-- CHOOSE YOUR SOUND -->
    <section v-reveal class="sound wrap" aria-labelledby="sound-h">
      <h2 id="sound-h" class="sound-h" data-r>{{ t('sound.heading') }}</h2>
      <div class="sound-photo" aria-hidden="true">
        <img
          v-for="(row, i) in rows"
          :key="row.sub"
          :src="row.image"
          alt=""
          :class="{ on: i === activeRow }"
          width="800"
          height="1000"
          loading="lazy"
        />
      </div>

      <div class="sound-list">
        <ul data-r @mouseleave="leaveRows">
          <li
            v-for="(row, i) in rows"
            :key="row.sub"
            ref="rowEls"
            :class="{ active: i === activeRow }"
            @mouseenter="hoverRow(i)"
            @focusin="hoverRow(i)"
          >
            <RouterLink :to="row.to" class="row-link">
              <span class="row-name">{{ rowName(row) }}</span>
              <span class="row-from">{{ t('sound.from', { price: rowFrom(row) }) }}</span>
            </RouterLink>
            <div class="row-desc">
              <div>
                <p>{{ t(`sound.rows.${row.sub}`) }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- SETUP: ONE FRAME, THREE DISTANCES -->
    <section ref="setupEl" class="setup" aria-labelledby="setup-h">
      <div class="setup-stage wrap">
        <h2 id="setup-h" class="setup-head">
          <span class="setup-a">{{ t('setup.a') }}</span>
          <span class="setup-b" :class="{ shown: setupStage >= 1 }">{{ t('setup.b') }}</span>
        </h2>
        <div class="setup-frame">
          <img
            :src="brassImg"
            alt="Brass T-Line"
            width="800"
            height="1000"
            loading="lazy"
            :style="{
              transform: `scale(${distances[setupStage].scale})`,
              transformOrigin: distances[setupStage].origin,
            }"
          />
        </div>
        <p class="setup-caption" :class="{ shown: setupStage >= 2 }">{{ t('setup.caption') }}</p>
      </div>
    </section>

    <!-- HOW WE WORK -->
    <section class="service" aria-labelledby="service-h">
      <div class="service-grid wrap">
        <h2 id="service-h" class="service-head">{{ t('service.heading') }}</h2>
        <div class="service-blocks">
          <article v-for="(b, i) in blocks" :key="b.title" v-reveal class="block" :class="{ flip: i % 2 }">
            <h3 data-r>{{ b.title }}</h3>
            <div class="block-row">
              <img :src="serviceImages[i]" alt="" width="420" height="560" loading="lazy" data-r />
              <ul data-r>
                <li v-for="line in b.lines" :key="line">{{ line }}</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- GALLERY -->
    <section class="gallery" :aria-label="t('gallery.captions')[0]">
      <div class="wrap gallery-lead">
        <p v-reveal>{{ t('gallery.text') }}</p>
      </div>
      <figure v-for="(img, i) in galleryImages" :key="img" ref="galleryEls" class="shot">
        <img
          :src="img"
          :alt="t('gallery.captions')[i]"
          :style="{ objectPosition: galleryFocus[i] }"
          width="1600"
          height="1000"
          loading="lazy"
        />
        <figcaption>{{ t('gallery.captions')[i] }}</figcaption>
      </figure>
    </section>

    <!-- FAQ -->
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

    <!-- CTA: ONE WORD IS THE BUTTON -->
    <RouterLink to="/catalog" class="cta">
      <span class="cta-text">{{ t('cta.text') }}</span>
      <svg class="cta-arrow" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M12 36 36 12M16 12h20v20" fill="none" stroke="currentColor" stroke-width="3" />
      </svg>
      <span class="cta-verb" :style="{ fontSize: verbSize }">{{ verb }}</span>
    </RouterLink>
  </div>
</template>

<style scoped>
/* ---------- hero ---------- */
/* The pin holds for one and a half screens beyond the first; each panel gets its share of that run. */
.hero {
  position: relative;
  height: 250svh;
}

.hero-stage {
  position: sticky;
  top: var(--header-h);
  height: calc(100svh - var(--header-h));
  overflow: hidden;
  transition: background-color 900ms ease;
}

.hero-title {
  position: absolute;
  z-index: 2;
  top: clamp(8px, 2vw, 32px);
  left: 0;
  right: 0;
  text-align: center;
  font-size: var(--step-display);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 0.82;
  text-transform: uppercase;
  color: var(--ink);
  pointer-events: none;
  animation: title-in 1.1s var(--ease-out) both;
}

@keyframes title-in {
  from {
    opacity: 0;
    transform: translateY(0.12em);
    letter-spacing: 0.02em;
  }
}

.hero-frame {
  position: absolute;
  left: 50%;
  top: calc(var(--step-display) * 0.42);
  bottom: 0;
  aspect-ratio: 2 / 3;
  transform: translateX(-50%);
  overflow: hidden;
  background: var(--surface);
}

.hero-frame img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  clip-path: inset(100% 0 0 0);
  transform: scale(1.12);
  transition:
    clip-path 900ms var(--ease-in-out),
    transform 1600ms var(--ease-out);
}

.hero-frame img.on,
.hero-frame img.past {
  clip-path: inset(0 0 0 0);
}

.hero-frame img.on {
  z-index: 1;
  transform: scale(1);
  animation: drift 14s ease-in-out infinite alternate;
}

@keyframes drift {
  to {
    transform: scale(1.06) translateY(-1.5%);
  }
}

.hero-lead {
  position: absolute;
  left: var(--gutter);
  bottom: 32px;
  max-width: 26ch;
  font-weight: 500;
  animation: rise 900ms 250ms var(--ease-out) both;
}

.hero-side {
  position: absolute;
  right: var(--gutter);
  bottom: 32px;
  display: grid;
  justify-items: end;
  gap: 16px;
  animation: rise 900ms 400ms var(--ease-out) both;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}

.hero-caption {
  display: grid;
  justify-items: end;
}

.hero-caption span {
  color: var(--muted);
}

.caption-enter-active,
.caption-leave-active {
  transition:
    opacity 240ms ease,
    transform 360ms var(--ease-out);
}

.caption-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.caption-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ---------- choose your sound ---------- */
.sound {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
  padding-top: var(--section-gap);
}

.sound-h {
  grid-column: 7 / span 6;
  grid-row: 1;
  font-size: var(--step-head);
  padding-top: 4vh;
  margin-bottom: 48px;
}

.sound-photo {
  grid-column: 1 / span 5;
  grid-row: 1 / span 2;
  position: sticky;
  top: calc(var(--header-h) + 6vh);
  align-self: start;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--surface);
}

.sound-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.05);
  transition:
    opacity 420ms ease,
    transform 1200ms var(--ease-out);
}

.sound-photo img.on {
  opacity: 1;
  transform: scale(1);
}

.sound-list {
  grid-column: 7 / span 6;
  grid-row: 2;
  padding-bottom: 12vh;
}

.sound-list li {
  color: var(--muted);
  transition: color var(--dur) ease;
}

.sound-list li.active {
  color: var(--ink);
}

.row-link {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  min-height: 58px;
  padding-block: 14px;
}

.row-name {
  font-size: var(--step-lead);
  font-weight: 500;
  letter-spacing: -0.02em;
  transition: transform var(--dur) var(--ease-out);
}

.active .row-name {
  transform: translateX(10px);
}

.row-from {
  font-size: var(--step-small);
  white-space: nowrap;
}

.active .row-from {
  color: var(--accent);
}

.row-desc {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 420ms var(--ease-out);
}

.row-desc > div {
  overflow: hidden;
}

.row-desc p {
  max-width: 40ch;
  padding: 0 0 18px 10px;
  color: var(--ink);
}

.active .row-desc {
  grid-template-rows: 1fr;
}

/* ---------- setup ---------- */
.setup {
  height: 200svh;
  margin-top: var(--section-gap);
}

.setup-stage {
  position: sticky;
  top: var(--header-h);
  height: calc(100svh - var(--header-h));
  display: grid;
  grid-template-columns: 1fr minmax(0, 30vw) 1fr;
  grid-template-rows: auto 1fr;
  align-items: center;
  column-gap: 32px;
}

.setup-head {
  grid-column: 1 / -1;
  grid-row: 1;
  display: grid;
  justify-items: center;
  font-size: var(--step-head);
  text-align: center;
  padding-top: 3vh;
}

.setup-b {
  color: var(--accent);
  opacity: 0;
  transform: translateY(0.4em);
  transition:
    opacity 500ms ease,
    transform 700ms var(--ease-out);
}

.setup-b.shown {
  opacity: 1;
  transform: none;
}

.setup-frame {
  grid-column: 2;
  grid-row: 2;
  justify-self: center;
  width: min(30vw, 100%);
  max-height: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--surface);
}

.setup-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 900ms var(--ease-in-out),
    transform-origin 900ms var(--ease-in-out);
}

.setup-caption {
  grid-column: 3;
  grid-row: 2;
  align-self: start;
  max-width: 30ch;
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 500ms ease,
    transform 700ms var(--ease-out);
}

.setup-caption.shown {
  opacity: 1;
  transform: none;
}

/* ---------- service ---------- */
.service {
  background: var(--curtain);
  margin-top: var(--section-gap);
  padding-block: clamp(80px, 10vw, 160px);
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
}

.service-head {
  grid-column: 1 / span 5;
  align-self: start;
  position: sticky;
  top: calc(var(--header-h) + 32px);
  font-size: var(--step-head);
  font-weight: 600;
}

.service-blocks {
  grid-column: 7 / span 6;
  display: grid;
  gap: 88px;
}

.block h3 {
  font-size: var(--step-lead);
  letter-spacing: -0.025em;
  margin-bottom: 24px;
}

.block-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 32px;
  align-items: start;
}

.block.flip .block-row {
  grid-template-columns: 1fr 200px;
}

.block.flip img {
  order: 2;
}

.block img {
  width: 200px;
  aspect-ratio: 3 / 4;
  object-fit: cover;
}

.block ul {
  display: grid;
  gap: 14px;
}

/* ---------- gallery ---------- */
.gallery {
  margin-top: var(--section-gap);
}

.gallery-lead p {
  position: relative;
  z-index: 2;
  margin-left: 58%;
  max-width: 30ch;
  margin-bottom: -5.5em;
  font-weight: 500;
  color: var(--ink);
}

.shot {
  position: relative;
  height: 100svh;
  overflow: hidden;
}

.shot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(calc(1.14 - var(--p, 0.5) * 0.14));
  will-change: transform;
}

.shot::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 140px;
  background: linear-gradient(
    to top,
    rgb(0 0 0 / 0.65),
    rgb(0 0 0 / 0)
  ); /* taste-skill-ignore: neutral scrim under a caption */
}

.shot figcaption {
  position: absolute;
  z-index: 1;
  left: var(--gutter);
  bottom: 24px;
  font-size: var(--step-small);
  color: #fff;
}

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

/* ---------- tablet & phone ---------- */
@media (max-width: 900px) {
  .sound {
    display: block;
  }

  .sound-photo {
    position: sticky;
    top: var(--header-h);
    z-index: 2;
    aspect-ratio: auto;
    height: 38svh;
    margin-inline: calc(-1 * var(--gutter));
  }

  .sound-h {
    padding-top: 0;
    margin-bottom: 24px;
  }

  .sound-list {
    padding-top: 32px;
  }

  .row-link {
    min-height: 56px;
  }

  .setup-stage {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    align-content: center;
    row-gap: 20px;
  }

  .setup-head,
  .setup-frame,
  .setup-caption {
    grid-column: 1;
  }

  .setup-head {
    grid-row: 1;
  }

  .setup-frame {
    grid-row: 2;
    width: 70vw;
    max-height: 52svh;
  }

  .setup-caption {
    grid-row: 3;
    justify-self: center;
    text-align: center;
  }

  .service-grid {
    display: block;
  }

  .service-head {
    top: var(--header-h);
    z-index: 2;
    background: var(--curtain);
    padding-block: 12px;
    font-size: 9vw;
    margin-bottom: 32px;
  }

  .service-blocks {
    gap: 72px;
  }

  .block-row,
  .block.flip .block-row {
    grid-template-columns: 1fr;
  }

  .block.flip img {
    order: 0;
  }

  .block img {
    width: 100%;
    aspect-ratio: 4 / 3;
  }

  .gallery-lead p {
    margin-left: 0;
    max-width: 60%;
    margin-bottom: -4.5em;
  }

  .shot {
    height: 88svh;
  }

  .faq-list {
    margin-left: 0;
    margin-top: 48px;
  }

  details {
    margin-inline: calc(-1 * var(--gutter));
    padding-inline: var(--gutter);
  }

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

@media (max-width: 720px) {
  .hero-frame {
    left: var(--gutter);
    right: var(--gutter);
    top: calc(var(--step-display) * 0.55);
    bottom: 168px;
    aspect-ratio: auto;
    transform: none;
  }

  .hero-lead {
    bottom: 96px;
    right: var(--gutter);
    max-width: none;
  }

  .hero-side {
    left: var(--gutter);
    bottom: 20px;
    grid-template-columns: 1fr auto;
    align-items: end;
    justify-items: start;
  }

  .hero-caption {
    justify-items: start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .setup-b,
  .setup-caption {
    opacity: 1;
    transform: none;
  }

  .hero-frame img.on {
    animation: none;
  }
}
</style>
