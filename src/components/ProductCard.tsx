import { useEffect, useState } from 'react'
import type { Product } from '../types'
import { APP, LABELS } from '../content'

type Props = {
  product: Product
}

export function ProductCard({ product }: Props) {
  const [broken, setBroken] = useState(false)
  useEffect(() => {
    setBroken(false)
  }, [product.image])
  const fallback =
    product.category === 'Tech'
      ? '/images/tech.svg'
      : product.category === 'Home'
        ? '/images/home.svg'
        : product.category === 'Beauty'
          ? '/images/beauty.svg'
          : product.category === 'Tools'
            ? '/images/tools.svg'
            : product.category === 'Toys'
              ? '/images/toys.svg'
              : '/images/kitchen.svg'

  const src = broken ? fallback : product.image
  return (
    <div className="productCard">
      <div className="productImageWrap">
        <img
          className="productImage"
          src={src}
          alt={`${APP.name} ${LABELS.productAlt}`}
          onError={() => setBroken(true)}
        />
      </div>
    </div>
  )
}

