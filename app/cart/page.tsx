'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()

  const subtotal = getTotal()
  const freeShippingThreshold = 5999
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 0 // Always free or based on threshold
  const total = subtotal + shippingCost

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
            <p className="text-lg text-gray-600 mb-8">There are no items in your cart.</p>
            <Link 
              href="/products"
              className="inline-block bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">SHOPPING CART</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 border rounded-lg p-4 bg-white shadow-sm">
                {/* Product Image */}
                <div className="relative w-24 h-32 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 pr-4">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-rose-600 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    {item.size && <p>Size: {item.size}</p>}
                    {item.color && <p>Color: {item.color}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 bg-gray-50 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                
                {subtotal < freeShippingThreshold && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                    <p className="text-yellow-800">
                      Add {formatPrice(freeShippingThreshold - subtotal)} more to get FREE shipping!
                    </p>
                  </div>
                )}

                {subtotal >= freeShippingThreshold && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                    <p className="text-green-800 font-medium">
                      🎉 You qualify for FREE shipping!
                    </p>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  Taxes and shipping calculated at checkout
                </p>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Orders will be processed in PKR.</p>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-gray-900 text-white text-center py-4 rounded-lg font-semibold hover:bg-gray-800 transition mb-3"
              >
                🔒 CHECKOUT
              </Link>

              <Link
                href="/products"
                className="block w-full text-center py-3 text-gray-700 font-medium hover:text-rose-600 transition"
              >
                CONTINUE SHOPPING
              </Link>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-semibold text-gray-900 mb-3">Payment Method:</p>
                <div className="bg-white border border-gray-200 rounded p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-lg">💵</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-600">Pay when you receive</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saving Info */}
        {items.length > 0 && (
          <div className="mt-8 p-4 bg-rose-50 border border-rose-200 rounded-lg">
            <p className="text-rose-800 font-medium text-center">
              Total Savings: {formatPrice(items.reduce((acc, item) => acc + (item.price * 0.5 * item.quantity), 0))}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
