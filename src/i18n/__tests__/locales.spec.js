import { describe, it, expect } from 'vitest'
import { LOCALES } from '@/i18n'
import en from '@/i18n/locales/en'
import ru from '@/i18n/locales/ru'
import de from '@/i18n/locales/de'
import fr from '@/i18n/locales/fr'
import zh from '@/i18n/locales/zh'
import ja from '@/i18n/locales/ja'
import products from '../../../public/api/products.json'

const dictionaries = { ru, de, fr, zh, ja }
const descriptions = import.meta.glob('../../../public/api/descriptions/*.json', { eager: true, import: 'default' })
const descriptionsFor = (code) => descriptions[`../../../public/api/descriptions/${code}.json`]

// Flattens a dictionary into "path -> shape" pairs. Arrays keep their length in the shape,
// so a FAQ entry missing in one language is caught as well as a missing key.
// (TypeScript already checks keys; array lengths and placeholders are only checked here.)
function shape(node, path = '', out = {}) {
  if (Array.isArray(node)) {
    out[path] = `array(${node.length})`
    node.forEach((child, i) => shape(child, `${path}[${i}]`, out))
  } else if (node && typeof node === 'object') {
    for (const [key, child] of Object.entries(node)) shape(child, path ? `${path}.${key}` : key, out)
  } else {
    out[path] = typeof node
  }
  return out
}

function strings(node, path = '', out = {}) {
  if (typeof node === 'string') out[path] = node
  else if (node && typeof node === 'object')
    for (const [key, child] of Object.entries(node)) strings(child, path ? `${path}.${key}` : key, out)
  return out
}

// "{name} added" -> ["name"]
const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

describe('locale files', () => {
  const reference = shape(en)
  const referenceStrings = strings(en)

  it('every language in the menu has a dictionary', () => {
    expect(LOCALES.map((l) => l.code).sort()).toEqual(['de', 'en', 'fr', 'ja', 'ru', 'zh'])
  })

  for (const [code, dict] of Object.entries(dictionaries)) {
    it(`${code} has exactly the same keys as en`, () => {
      expect(shape(dict)).toEqual(reference)
    })

    it(`${code} uses the same {placeholders} as en`, () => {
      const own = strings(dict)
      for (const [path, text] of Object.entries(referenceStrings)) {
        expect(placeholders(own[path] ?? ''), path).toEqual(placeholders(text))
      }
    })
  }
})

describe('product descriptions (public/api/descriptions)', () => {
  for (const { code } of LOCALES) {
    it(`${code} describes every product and nothing else`, () => {
      const texts = descriptionsFor(code)
      expect(texts, `missing file for ${code}`).toBeDefined()
      expect(Object.keys(texts).sort()).toEqual(products.map((p) => p.id).sort())
      for (const [id, text] of Object.entries(texts)) expect(text.trim(), `${code} / ${id}`).not.toBe('')
    })
  }
})
