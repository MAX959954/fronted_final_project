import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { vi } from 'vitest'

/**
 * A fetch stand-in that answers from the real files in public/, the same ones GitHub Pages serves,
 * so store tests run against the actual catalogue rather than a hand-written fixture.
 * `overrides` maps a path such as 'api/products.json' to a status code, to simulate a failing endpoint.
 */
export function servePublicApi(overrides = {}) {
  const base = import.meta.env.BASE_URL
  return vi.fn(async (url) => {
    const path = new URL(String(url), 'http://localhost').pathname
    const file = path.startsWith(base) ? path.slice(base.length) : path.slice(1)
    if (overrides[file]) return new Response('failure', { status: overrides[file] })
    try {
      const body = await readFile(resolve('public', file), 'utf8')
      return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } })
    } catch {
      return new Response('Not found', { status: 404 })
    }
  })
}
