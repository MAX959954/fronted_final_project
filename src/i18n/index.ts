import { ref, shallowReactive, watchEffect } from 'vue'
import { load, save } from '@/stores/persist'
import type { Locale } from '@/types'
import en, { type Messages } from './locales/en'

// `tag` feeds Intl formatters; `label` is shown in the language menu in its own script.
export const LOCALES: readonly { code: Locale; tag: string; label: string; short: string }[] = [
  { code: 'ru', tag: 'ru-RU', label: 'Русский', short: 'RU' },
  { code: 'en', tag: 'en-GB', label: 'English', short: 'EN' },
  { code: 'de', tag: 'de-DE', label: 'Deutsch', short: 'DE' },
  { code: 'fr', tag: 'fr-FR', label: 'Français', short: 'FR' },
  { code: 'zh', tag: 'zh-CN', label: '中文', short: '中' },
  { code: 'ja', tag: 'ja-JP', label: '日本語', short: '日' },
]

// English ships in the main bundle as the fallback; every other dictionary is its own chunk,
// downloaded only when a visitor actually picks that language.
const loaders: Record<Locale, () => Promise<Messages>> = {
  en: async () => en,
  ru: () => import('./locales/ru').then((m) => m.default),
  de: () => import('./locales/de').then((m) => m.default),
  fr: () => import('./locales/fr').then((m) => m.default),
  zh: () => import('./locales/zh').then((m) => m.default),
  ja: () => import('./locales/ja').then((m) => m.default),
}

const messages = shallowReactive<Partial<Record<Locale, Messages>>>({ en })

export const isLocale = (code: unknown): code is Locale => LOCALES.some((l) => l.code === code)

function detect(): Locale {
  const saved = load('locale', null)
  if (isLocale(saved)) return saved
  const nav = (typeof navigator !== 'undefined' && navigator.language) || 'en'
  const code = nav.slice(0, 2).toLowerCase()
  return isLocale(code) ? code : 'en'
}

// Read the saved choice before anything below can write over it.
const initial = detect()

export const locale = ref<Locale>('en')

/** Downloads the dictionary first and only then switches, so the page never shows a half-translated frame. */
export async function setLocale(code: string): Promise<void> {
  if (!isLocale(code)) return
  try {
    messages[code] ??= await loaders[code]()
  } catch {
    return // the chunk could not be fetched (offline?): stay in the current language
  }
  locale.value = code
}

/** Resolves when the visitor's language is ready; main.ts mounts the app after it. */
export const i18nReady: Promise<void> = setLocale(initial)

type Params = Record<string, string | number>

function lookup(dict: unknown, key: string): unknown {
  return key
    .split('.')
    .reduce<unknown>((node, part) => (node == null ? undefined : (node as Record<string, unknown>)[part]), dict)
}

// Reads `locale.value` and the reactive dictionary map, so templates re-render when the language changes.
function resolve(key: string): unknown {
  const value = lookup(messages[locale.value], key)
  return value === undefined ? lookup(en, key) : value
}

/** A translated string, with {placeholders} filled from `params`. Unknown keys come back as the key itself. */
export function t(key: string, params?: Params): string {
  const value = resolve(key)
  if (typeof value !== 'string') {
    // A list or group read through t() renders as its key; in development, say which call to fix.
    if (import.meta.env.DEV && value !== undefined) console.warn(`[i18n] "${key}" is not a string; read it with tm()`)
    return key
  }
  if (!params) return value
  return value.replace(/[{]([A-Za-z0-9_]+)[}]/g, (match, name: string) =>
    params[name] === undefined ? match : String(params[name]),
  )
}

/** A structured entry such as a list of FAQ items or gallery captions. */
export function tm<T>(key: string): T {
  return resolve(key) as T
}

const tagOf = (code: Locale): string => LOCALES.find((l) => l.code === code)?.tag ?? 'en-GB'

export function price(amount: number): string {
  return new Intl.NumberFormat(tagOf(locale.value), {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}

export function date(iso: string): string {
  return new Intl.DateTimeFormat(tagOf(locale.value), { dateStyle: 'long', timeStyle: 'short' }).format(new Date(iso))
}

watchEffect(() => {
  save('locale', locale.value)
  document.documentElement.lang = locale.value
  document.title = t('meta.title')
})

export function useI18n() {
  return { locale, t, tm, price, date, setLocale, LOCALES }
}
