'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingCart, Zap } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import type { Product } from '@/types/database'
import { isCurrentUserAdmin } from '@/lib/supabase/admin'

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const loadRole = async () => {
      const { isAdmin } = await isCurrentUserAdmin()
      setIsAdmin(isAdmin)
    }

    loadRole()
  }, [])

  const handleAddToCart = () => {
    if (isAdmin) {
      alert('Shopping is disabled for admin accounts.')
      return
    }

    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('Please select a size')
      return
    }

    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize || 'Free Size',
      color: selectedColor || '',
      quantity: quantity,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    if (isAdmin) {
      alert('Shopping is disabled for admin accounts.')
      return
    }

    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('Please select a size')
      return
    }

    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize || 'Free Size',
      color: selectedColor || '',
      quantity: quantity,
    })

    router.push('/checkout')
  }

  const isOutOfStock = product.stock <= 0

  return (
    <div className="space-y-5">
      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Size: <span className="font-normal text-gray-500">{selectedSize || 'Select a size'}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-5 py-2.5 border rounded-lg font-medium text-sm transition ${
                  selectedSize === size
                    ? 'border-rose-600 bg-rose-600 text-white'
                    : 'border-gray-300 text-gray-700 hover:border-rose-400 hover:text-rose-600'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Color: <span className="font-normal text-gray-500">{selectedColor}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                  selectedColor === color
                    ? 'border-rose-600 bg-rose-50 text-rose-600'
                    : 'border-gray-300 text-gray-700 hover:border-rose-400'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Quantity:
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdmin}
          className={`w-full py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 ${
            isOutOfStock || isAdmin
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : added
              ? 'bg-green-600 text-white'
              : 'bg-rose-600 text-white hover:bg-rose-700'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {isAdmin ? 'Admin Shopping Disabled' : isOutOfStock ? 'Out of Stock' : added ? 'Added to Cart!' : 'ADD TO CART'}
        </button>

        {/* Buy It Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock || isAdmin}
          className={`w-full py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 ${
            isOutOfStock || isAdmin
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          <Zap className="w-5 h-5" />
          {isAdmin ? 'Admin Shopping Disabled' : 'BUY IT NOW'}
        </button>
      </div>
    </div>
  )
}
