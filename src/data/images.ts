import type { Photo } from '@/types'

// Every photo in src/assets/img is resized and re-encoded to WebP at build time (vite-imagetools),
// so the browser picks the smallest file that is sharp enough for the slot it fills.
// Sources stay as the original JPGs; `withoutEnlargement` keeps narrow originals from being upscaled.
const srcsets = import.meta.glob<string>('../assets/img/*.jpg', {
  eager: true,
  import: 'default',
  query: '?w=480;960;1400&format=webp&withoutEnlargement&as=srcset',
})

const fallbacks = import.meta.glob<string>('../assets/img/*.jpg', {
  eager: true,
  import: 'default',
  query: '?w=960&format=webp&withoutEnlargement',
})

const keyOf = (name: string) => `../assets/img/${name}.jpg`

export const hasPhoto = (name: string): boolean => keyOf(name) in fallbacks

export function photo(name: string): Photo {
  const key = keyOf(name)
  const src = fallbacks[key]
  const srcset = srcsets[key]
  if (!src || !srcset) throw new Error(`Unknown photo: ${name}`)
  return { src, srcset }
}
