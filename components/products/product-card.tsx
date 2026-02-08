import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/database'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = true // Show sale badge
  const originalPrice = product.price * 2

  return (
    <Link 
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {hasDiscount && (
              <span className="absolute top-2 left-2 bg-rose-600 text-white text-xs font-semibold px-2 py-1 rounded">
                Sale
              </span>
            )}
            {!product.stock && (
              <span className="absolute top-2 right-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                Sold Out
              </span>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-rose-600 transition text-sm">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={`${color}-${index}`}
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}