import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCatalogStore } from '@/stores/catalog'
import { ApiError } from '@/api/products'
import { servePublicApi } from '@/test-utils/serve-public-api'
import products from '../../../public/api/products.json'
import english from '../../../public/api/descriptions/en.json'

describe('catalog store', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => vi.unstubAllGlobals())

  it('starts idle, goes through loading and ends ready with every product', async () => {
    vi.stubGlobal('fetch', servePublicApi())
    const catalog = useCatalogStore()
    expect(catalog.status).toBe('idle')

    const loading = catalog.load()
    expect(catalog.status).toBe('loading')
    await loading

    expect(catalog.status).toBe('ready')
    expect(catalog.products).toHaveLength(products.length)
  })

  it('turns the photo key from the API into real responsive URLs', async () => {
    vi.stubGlobal('fetch', servePublicApi())
    const catalog = useCatalogStore()
    await catalog.load()

    const guitar = catalog.productById('ember-lp')
    expect(guitar.image.src).toEqual(expect.any(String))
    expect(guitar.image.srcset).toContain('480w')
  })

  it('sends one request however many callers ask at once', async () => {
    const fetch = servePublicApi()
    vi.stubGlobal('fetch', fetch)
    const catalog = useCatalogStore()

    await Promise.all([catalog.load(), catalog.load(), catalog.load()])
    await catalog.load() // already loaded: no new request either

    const productCalls = fetch.mock.calls.filter(([url]) => String(url).endsWith('/products.json'))
    expect(productCalls).toHaveLength(1)
  })

  it('reports an HTTP failure as an error and recovers on retry', async () => {
    vi.stubGlobal('fetch', servePublicApi({ 'api/products.json': 500 }))
    const catalog = useCatalogStore()
    await catalog.load()

    expect(catalog.status).toBe('error')
    expect(catalog.error).toBeInstanceOf(ApiError)
    expect(catalog.error.status).toBe(500)
    expect(catalog.products).toEqual([])

    vi.stubGlobal('fetch', servePublicApi())
    await catalog.load()
    expect(catalog.status).toBe('ready')
    expect(catalog.error).toBeNull()
  })

  it('reports a network failure as an error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const catalog = useCatalogStore()
    await catalog.load()

    expect(catalog.status).toBe('error')
    expect(catalog.error).toBeInstanceOf(ApiError)
    expect(catalog.error.cause).toBeInstanceOf(TypeError)
  })

  it('knows the top price and the lowest price per sub-category', async () => {
    vi.stubGlobal('fetch', servePublicApi())
    const catalog = useCatalogStore()
    await catalog.load()

    expect(catalog.topPrice).toBe(Math.max(...products.map((p) => p.price)))
    const picks = products.filter((p) => p.sub === 'picks').map((p) => p.price)
    expect(catalog.fromPrice('picks')).toBe(Math.min(...picks))
    expect(catalog.fromPrice('no-such-sub')).toBe(0)
  })

  it('describes products in the current language', async () => {
    vi.stubGlobal('fetch', servePublicApi())
    const catalog = useCatalogStore()
    await catalog.load()
    await catalog.loadDescriptions('en')

    expect(catalog.describe(catalog.productById('ember-lp'))).toBe(english['ember-lp'])
  })
})
