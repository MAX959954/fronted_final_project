import { defineStore } from 'pinia'
import { ref, shallowRef, computed, watch } from 'vue'
import { getDescriptions, getProducts } from '@/api/products'
import { photo } from '@/data/images'
import { locale } from '@/i18n'
import type { Descriptions, Locale, Product, ProductDto, SubCategory } from '@/types'

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

const toProduct = (dto: ProductDto): Product => ({ ...dto, image: photo(dto.image) })

export const useCatalogStore = defineStore('catalog', () => {
  // shallowRef: products are replaced as a whole, never edited in place.
  const products = shallowRef<Product[]>([])
  const status = ref<LoadStatus>('idle')
  const error = ref<Error | null>(null)

  const byId = computed(() => new Map(products.value.map((p) => [p.id, p])))
  const topPrice = computed(() => products.value.reduce((top, p) => Math.max(top, p.price), 0))

  let pending: Promise<void> | null = null

  /** Loads the catalogue once; concurrent callers share one request. Calling it after an error retries. */
  function load(): Promise<void> {
    if (status.value === 'ready') return Promise.resolve()
    if (pending) return pending
    status.value = 'loading'
    error.value = null
    pending = getProducts()
      .then((list) => {
        products.value = list.map(toProduct)
        status.value = 'ready'
      })
      .catch((e: unknown) => {
        error.value = e instanceof Error ? e : new Error(String(e))
        status.value = 'error'
      })
      .finally(() => {
        pending = null
      })
    return pending
  }

  const productById = (id: string): Product | undefined => byId.value.get(id)

  /** Lowest price in a sub-category, for the "from X" figures on the home page. */
  function fromPrice(sub: SubCategory): number {
    const prices = products.value.filter((p) => p.sub === sub).map((p) => p.price)
    return prices.length ? Math.min(...prices) : 0
  }

  /* ---------- descriptions: one request per language, and only for languages actually shown ---------- */
  const descriptions = shallowRef<Partial<Record<Locale, Descriptions>>>({})

  async function loadDescriptions(code: Locale): Promise<void> {
    if (descriptions.value[code]) return
    try {
      const texts = await getDescriptions(code)
      descriptions.value = { ...descriptions.value, [code]: texts }
    } catch {
      // A missing description is not worth an error screen: the rest of the product page still works.
    }
  }

  watch(locale, loadDescriptions, { immediate: true })

  const describe = (product: Product): string => descriptions.value[locale.value]?.[product.id] ?? ''

  return { products, status, error, topPrice, load, productById, fromPrice, describe, loadDescriptions }
})
