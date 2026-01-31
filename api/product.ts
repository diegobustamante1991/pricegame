import type { VercelRequest, VercelResponse } from '@vercel/node'

const RAINFOREST_URL = 'https://api.rainforestapi.com/request'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const asin = typeof req.query.asin === 'string' ? req.query.asin.trim() : null
  if (!asin) {
    return res.status(400).json({ error: 'Missing required query: asin' })
  }
  const domain =
    (typeof req.query.amazon_domain === 'string' ? req.query.amazon_domain.trim() : '') ||
    process.env.RAINFOREST_AMAZON_DOMAIN ||
    'amazon.com'

  const apiKey = process.env.RAINFOREST_API_KEY
  if (!apiKey) {
    console.error('RAINFOREST_API_KEY is not set')
    return res.status(500).json({ error: 'API not configured' })
  }

  const origin = req.headers.origin
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.VITE_APP_URL,
  ].filter(Boolean)

  if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development')) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      type: 'product',
      amazon_domain: domain,
      asin,
    })

    const response = await fetch(`${RAINFOREST_URL}?${params}`, {
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('Rainforest API error:', response.status, text)
      return res.status(502).json({
        error: 'Failed to fetch product',
        details: response.status === 401 ? 'Invalid API key' : undefined,
      })
    }

    const data = await response.json()

    if (data.request_info?.success === false) {
      return res.status(404).json({ error: 'Product not found', details: data.request_info?.message })
    }

    const product = data.product
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const buybox = product.buybox_winner
    const priceObj = buybox?.price
    const priceValue =
      typeof priceObj?.value === 'number'
        ? priceObj.value
        : typeof priceObj?.raw === 'string'
          ? parseFloat(priceObj.raw.replace(/[^0-9.]/g, '')) || 0
          : 0

    const image = product.main_image?.link ?? product.images?.[0]?.link ?? null
    const category =
      product.categories?.[0]?.name ??
      product.browse_node_info?.browse_nodes?.[0]?.context_free_name ??
      ''

    return res.status(200).json({
      id: product.asin,
      asin: product.asin,
      title: product.title ?? '',
      price: priceValue,
      image: image ?? '',
      category,
      brand: product.brand ?? product.author ?? '',
    })
  } catch (err) {
    console.error('Product API error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
