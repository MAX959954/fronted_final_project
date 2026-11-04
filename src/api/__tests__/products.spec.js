import { describe, it, expect, afterEach, vi } from 'vitest'
import { ApiError, getDescriptions, getProducts } from '@/api/products'

afterEach(() => vi.unstubAllGlobals())

const json = (body, status = 200) => new Response(JSON.stringify(body), { status })

describe('products API', () => {
  it('requests the static catalogue under the site base path and asks for JSON', async () => {
    const fetch = vi.fn().mockResolvedValue(json([]))
    vi.stubGlobal('fetch', fetch)

    await getProducts()

    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe(`${import.meta.env.BASE_URL}api/products.json`)
    expect(init.headers).toEqual({ Accept: 'application/json' })
  })

  it('requests descriptions for one language', async () => {
    const fetch = vi.fn().mockResolvedValue(json({ 'ember-lp': 'Text' }))
    vi.stubGlobal('fetch', fetch)

    await expect(getDescriptions('de')).resolves.toEqual({ 'ember-lp': 'Text' })
    expect(fetch.mock.calls[0][0]).toBe(`${import.meta.env.BASE_URL}api/descriptions/de.json`)
  })

  it('turns a non-2xx response into an ApiError with the status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({}, 404)))

    const error = await getProducts().catch((e) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(404)
  })

  it('wraps a network failure in an ApiError and keeps the cause', async () => {
    const cause = new TypeError('Failed to fetch')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(cause))

    const error = await getProducts().catch((e) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBeUndefined()
    expect(error.cause).toBe(cause)
  })

  it('passes an abort signal through', async () => {
    const fetch = vi.fn().mockResolvedValue(json([]))
    vi.stubGlobal('fetch', fetch)
    const controller = new AbortController()

    await getProducts(controller.signal)
    expect(fetch.mock.calls[0][1].signal).toBe(controller.signal)
  })
})
