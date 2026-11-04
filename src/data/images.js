// Every photo in src/assets/img is resized and re-encoded to WebP at build time (vite-imagetools),
// so the browser picks the smallest file that is sharp enough for the slot it fills.
// Sources stay as the original JPGs; `withoutEnlargement` keeps narrow originals from being upscaled.
const srcsets = import.meta.glob('../assets/img/*.jpg', {
  eager: true,
  import: 'default',
  query: '?w=480;960;1400&format=webp&withoutEnlargement&as=srcset',
})

const fallbacks = import.meta.glob('../assets/img/*.jpg', {
  eager: true,
  import: 'default',
  query: '?w=960&format=webp&withoutEnlargement',
})

/** @returns {{ src: string, srcset: string }} */
export function photo(name) {
  const key = `../assets/img/${name}.jpg`
  if (!(key in fallbacks)) throw new Error(`Unknown photo: ${name}`)
  return { src: fallbacks[key], srcset: srcsets[key] }
}
