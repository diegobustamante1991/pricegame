import type { Product } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? ''
const AMAZON_DOMAIN = import.meta.env.VITE_AMAZON_DOMAIN ?? ''

export type ProductApiResult = Pick<Product, 'id' | 'price' | 'title' | 'image' | 'category' | 'brand'>

/**
 * Fetches live price and product info from Amazon via our secure API.
 * Falls back to static data if API is unavailable or product has no ASIN.
 */
export async function fetchProductByAsin(asin: string): Promise<ProductApiResult | null> {
  if (!API_BASE) return null

  try {
    const domainParam = AMAZON_DOMAIN ? `&amazon_domain=${encodeURIComponent(AMAZON_DOMAIN)}` : ''
    const url = `${API_BASE.replace(/\/$/, '')}/api/product?asin=${encodeURIComponent(asin)}${domainParam}`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const data = await res.json()
    return {
      id: data.id ?? asin,
      price: typeof data.price === 'number' ? data.price : 0,
      title: data.title ?? '',
      image: data.image ?? '',
      category: data.category ?? '',
      brand: data.brand ?? '',
    }
  } catch {
    return null
  }
}
