// v-reveal on a section: its [data-r] children rise into place one after another, once, as it enters the viewport.
// The hiding class is only added here, so without script (or with reduced motion) everything is simply visible.
const io =
  typeof IntersectionObserver === 'undefined'
    ? null
    : new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
      )

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default {
  mounted(el) {
    if (!io || reducedMotion()) return
    const parts = el.querySelectorAll('[data-r]')
    if (parts.length) parts.forEach((part, i) => part.style.setProperty('--i', Math.min(i, 10)))
    else el.setAttribute('data-r-self', '')
    el.classList.add('reveal')
    io.observe(el)
  },
  unmounted(el) {
    io?.unobserve(el)
  },
}
