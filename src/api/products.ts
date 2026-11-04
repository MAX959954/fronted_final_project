import type { Descriptions, Locale, ProductDto } from '@/types'

// The catalogue comes over HTTP like it would from a real backend. By default it is the static JSON
// shipped in public/api; set VITE_API_URL (for example to a Spring Boot service) to switch the source.
const REMOTE = import.meta.env.VITE_API_URL
const BASE = withoutTrailingSlash(REMOTE || `${import.meta.env.BASE_URL}api`)
// Static hosting needs real file names; a real API serves clean paths.
const EXT = REMOTE ? '' : '.json'

function withoutTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

export class ApiError extends Error {
  readonly status: number | undefined

  constructor(message: string, status?: number, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE}/${path}${EXT}`, { signal, headers: { Accept: 'application/json' } })
  } catch (cause) {
    throw new ApiError(`Network error while loading ${path}`, undefined, { cause })
  }
  if (!response.ok) throw new ApiError(`Loading ${path} failed with HTTP ${response.status}`, response.status)
  return (await response.json()) as T
}

/** Every product, language-neutral. */
export const getProducts = (signal?: AbortSignal) => request<ProductDto[]>('products', signal)

/** Product descriptions in one language, keyed by product id. */
export const getDescriptions = (locale: Locale, signal?: AbortSignal) =>
  request<Descriptions>(`descriptions/${locale}`, signal)
