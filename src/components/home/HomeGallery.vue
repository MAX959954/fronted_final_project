<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n'
import { photo } from '@/data/images'
import { clamp, useScrollFrame } from '@/composables/useScroll'

const { t, tm } = useI18n()

const galleryImages = [photo('s-stage'), photo('s-studio'), photo('s-drummer')]
const galleryFocus = ['50% 50%', '50% 8%', '50% 40%']
const galleryEls = ref([])
const captions = computed(() => tm('gallery.captions'))

// Each photo zooms out slightly as it travels through the viewport; only visible ones are touched.
useScrollFrame((vh) => {
  for (const el of galleryEls.value) {
    const r = el.getBoundingClientRect()
    if (r.bottom < 0 || r.top > vh) continue
    el.style.setProperty('--p', clamp((vh - r.top) / (vh + r.height)).toFixed(3))
  }
})
</script>

<template>
  <section class="gallery" :aria-label="captions[0]">
    <div class="wrap gallery-lead">
      <p v-reveal>{{ t('gallery.text') }}</p>
    </div>
    <figure v-for="(img, i) in galleryImages" :key="img.src" ref="galleryEls" class="shot">
      <img
        :src="img.src"
        :srcset="img.srcset"
        sizes="100vw"
        :alt="captions[i]"
        :style="{ objectPosition: galleryFocus[i] }"
        width="1600"
        height="1000"
        loading="lazy"
      />
      <figcaption>{{ captions[i] }}</figcaption>
    </figure>
  </section>
</template>

<style scoped>
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

@media (max-width: 900px) {
  .gallery-lead p {
    margin-left: 0;
    max-width: 60%;
    margin-bottom: -4.5em;
  }

  .shot {
    height: 88svh;
  }
}
</style>
