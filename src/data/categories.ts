// Top-level departments and the sub-categories inside each. Labels live in the locale files under `cats`.
export const CATEGORIES = {
  guitars: ['electric', 'acoustic'],
  drums: ['kits', 'snares', 'cymbals'],
  accessories: ['amps', 'pedals', 'strings', 'picks', 'sticks', 'cables', 'headphones'],
} as const

export type Department = keyof typeof CATEGORIES
export type SubCategory = (typeof CATEGORIES)[Department][number]

export const isDepartment = (value: unknown): value is Department =>
  typeof value === 'string' && Object.hasOwn(CATEGORIES, value)

export const isSubCategoryOf = (dept: Department, value: unknown): value is SubCategory =>
  (CATEGORIES[dept] as readonly unknown[]).includes(value)
