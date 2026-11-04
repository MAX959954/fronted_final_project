import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { load, save } from './persist'
import { useCatalogStore } from './catalog'
import type { Product } from '@/types'

function loadIds(): string[] {
  const saved = load('favs', [])
  return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : []
}

export const useFavoritesStore = defineStore('favorites', () => {
  const catalog = useCatalogStore()
  const ids = ref<string[]>(loadIds())

  watch(ids, (value) => save('favs', value), { deep: true })

  // Once the catalogue has arrived, forget products it no longer has.
  watch(
    () => catalog.status,
    (status) => {
      if (status === 'ready') ids.value = ids.value.filter((id) => catalog.productById(id))
    },
    { immediate: true },
  )

  const items = computed<Product[]>(() =>
    ids.value.flatMap((id) => {
      const product = catalog.productById(id)
      return product ? [product] : []
    }),
  )
  const count = computed(() => ids.value.length)

  const has = (id: string): boolean => ids.value.includes(id)

  /** Returns true when the product ends up in favourites. */
  function toggle(id: string): boolean {
    if (has(id)) {
      ids.value = ids.value.filter((x) => x !== id)
      return false
    }
    ids.value = [...ids.value, id]
    return true
  }

  return { ids, items, count, has, toggle }
})
