import { ref, watchEffect } from 'vue'
import { load, save } from '@/stores/persist'
import ru from './locales/ru'
import en from './locales/en'
import de from './locales/de'
import fr from './locales/fr'
import zh from './locales/zh'
import ja from './locales/ja'

const messages = { ru, en, de, fr, zh, ja }

// `tag` feeds Intl formatters; `label` is shown in the language menu in its own script.
export const LOCALES = [
  { code: 'ru', tag: 'ru-RU', label: 'Русский', short: 'RU' },
  { code: 'en', tag: 'en-GB', label: 'English', short: 'EN' },
  { code: 'de', tag: 'de-DE', label: 'Deutsch', short: 'DE' },
  { code: 'fr', tag: 'fr-FR', label: 'Français', short: 'FR' },
  { code: 'zh', tag: 'zh-CN', label: '中文', short: '中' },
  { code: 'ja', tag: 'ja-JP', label: '日本語', short: '日' },
]

function detect() {
  const saved = load('locale', null)
  if (saved && messages[saved]) return saved
  const nav = (typeof navigator !== 'undefined' && navigator.language) || 'en'
  const code = nav.slice(0, 2).toLowerCase()
  return messages[code] ? code : 'en'
}

export const locale = ref(detect())

watchEffect(() => {
  save('locale', locale.value)
  document.documentElement.lang = locale.value
  document.title = t('meta.title')
})

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict)
}

// Reads `locale.value`, so templates re-render when the language changes.
export function t(key, params) {
  let value = lookup(messages[locale.value], key)
  if (value === undefined) value = lookup(messages.en, key)
  if (value === undefined) return key
  if (typeof value !== 'string' || !params) return value
  return value.replace(/\{(\w+)\}/g, (_, name) => (params[name] ?? `{${name}}`))
}

const tagOf = (code) => LOCALES.find((l) => l.code === code)?.tag || 'en-GB'

export function price(amount) {
  return new Intl.NumberFormat(tagOf(locale.value), {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}

export function date(iso) {
  return new Intl.DateTimeFormat(tagOf(locale.value), { dateStyle: 'long', timeStyle: 'short' }).format(new Date(iso))
}

// Product copy lives on the product itself, one string per locale.
export const productText = (product) => product.text[locale.value] || product.text.en

export function setLocale(code) {
  if (messages[code]) locale.value = code
}

export function useI18n() {
  return { locale, t, price, date, productText, setLocale, LOCALES }
}
