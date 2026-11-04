import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

// Every scroll-linked piece on a page shares one passive listener and at most one
// requestAnimationFrame per frame, however many components subscribe.
type Subscriber = (viewportHeight: number) => void

const subscribers = new Set<Subscriber>()
let frame = 0

function run() {
  frame = 0
  const vh = window.innerHeight
  for (const fn of subscribers) fn(vh)
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(run)
}

export const clamp = (v: number, lo = 0, hi = 1): number => Math.min(hi, Math.max(lo, v))

/** Calls `fn(viewportHeight)` once on mount and then on every animation frame that follows a scroll or resize. */
export function useScrollFrame(fn: Subscriber): void {
  onMounted(() => {
    if (!subscribers.size) {
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule)
    }
    subscribers.add(fn)
    fn(window.innerHeight)
  })

  onBeforeUnmount(() => {
    subscribers.delete(fn)
    if (subscribers.size) return
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    cancelAnimationFrame(frame)
    frame = 0
  })
}

/**
 * How far a tall, pinned section has been scrolled through: 0 when its top reaches the top
 * of the viewport, 1 when its bottom reaches the bottom.
 */
export function useScrollProgress(elRef: Ref<HTMLElement | null>): Ref<number> {
  const progress = ref(0)
  useScrollFrame((vh) => {
    const el = elRef.value
    if (!el) return
    const r = el.getBoundingClientRect()
    progress.value = clamp(-r.top / Math.max(1, r.height - vh))
  })
  return progress
}
