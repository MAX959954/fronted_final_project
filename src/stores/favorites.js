import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { products } from '@/data/products'
import { load, save } from './persist'

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref(load('favs', []).filter((id) => products.some((p) => p.id === id)))

  watch(ids, (value) => save('favs', value), { deep: true })

  const items = computed(() => ids.value.map((id) => products.find((p) => p.id === id)).filter(Boolean))
  const count = computed(() => ids.value.length)

  const has = (id) => ids.value.includes(id)

  // Returns true when the product ends up in favourites.
  function toggle(id) {
    if (has(id)) {
      ids.value = ids.value.filter((x) => x !== id)
      return false
    }
    ids.value = [...ids.value, id]
    return true
  }

  return { ids, items, count, has, toggle }
})
