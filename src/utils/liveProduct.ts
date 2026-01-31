import type { Clue, Product } from '../types'
import type { ProductApiResult } from '../api/product'

const FALLBACK_IMAGE = '/images/kitchen.svg'

export function buildLiveProduct(asin: string): Product {
  return {
    id: `live:${asin}`,
    asin,
    price: 0,
    image: FALLBACK_IMAGE,
    clues: [{ type: 'image' }],
    title: 'Mystery Amazon item',
    category: '',
    brand: '',
  }
}

export function buildLiveClues(live: ProductApiResult): Clue[] {
  const title = live.title?.trim() ?? ''
  const brand = live.brand?.trim() ?? ''
  const category = live.category?.trim() ?? ''
  const wordCount = title ? title.split(/\s+/).length : 0

  const clues: Clue[] = [{ type: 'image' }]

  if (category) {
    clues.push({ type: 'text', value: `Category: ${category}.` })
  }

  if (brand) {
    clues.push({ type: 'text', value: `Brand starts with '${brand[0]}'.` })
  }

  if (wordCount > 0) {
    clues.push({ type: 'text', value: `Title has ${wordCount} words.` })
  }

  if (title) {
    clues.push({ type: 'text', value: `Title: ${title}` })
  }

  return clues.slice(0, 5)
}
