import type { Department, SubCategory } from '@/data/categories'

export type { Department, SubCategory }

export type Locale = 'ru' | 'en' | 'de' | 'fr' | 'zh' | 'ja'

/** Synth voice played by the soundcheck button. */
export type SoundVoice = 'acoustic' | 'electric' | 'kit' | 'snare' | 'cymbal'

/** A photo resized at build time: a fallback URL plus the srcset with every width. */
export interface Photo {
  src: string
  srcset: string
}

/** A product as the API sends it: language-neutral, with the photo referenced by key. */
export interface ProductDto {
  id: string
  cat: Department
  sub: SubCategory
  /** null when the product has no soundcheck button */
  sound: SoundVoice | null
  name: string
  /** euros */
  price: number
  image: string
  /** language-neutral values; their labels live in the locale files under `specs` */
  specs: Record<string, string>
}

/** A product as the app uses it, with the photo resolved to real URLs. */
export interface Product extends Omit<ProductDto, 'image'> {
  image: Photo
}

/** Product descriptions in one language, keyed by product id. */
export type Descriptions = Record<string, string>

export interface CartItem {
  id: string
  qty: number
}

export interface CartLine extends CartItem {
  product: Product
  total: number
}

export type DeliveryMethod = 'courier' | 'pickup'
export type PaymentMethod = 'cod' | 'transfer'

export interface Customer {
  name: string
  email: string
  phone: string
  country: string
  city: string
  street: string
  zip: string
  comment: string
}

/** Price is frozen at the moment of ordering, so a later price change does not rewrite history. */
export interface OrderItem {
  id: string
  qty: number
  price: number
}

export interface Order {
  id: string
  /** ISO 8601 */
  date: string
  items: OrderItem[]
  customer: Customer
  delivery: DeliveryMethod
  payment: PaymentMethod
  comment: string
  subtotal: number
  shipping: number
  total: number
}

export interface Notification {
  id: number
  message: string
  image?: Photo
  /** milliseconds; defaults to 2800 */
  duration?: number
}
