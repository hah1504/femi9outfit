'use client'

import Link from 'next/link'
import { ShoppingCart, Search, User, Menu } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useState } from 'react'

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center py-2 text-sm">
        FREE SHIPPING WHEN YOUR ORDER IS ABOVE RS.5999
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-rose-600">
            Femi9outfit
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/products?category=women" className="hover:text-rose-600 transition">
              Women
            </Link>
            <Link href="/products?category=men" className="hover:text-rose-600 transition">
              Men
            </Link>
            <Link href="/products?category=kids" className="hover:text-rose-600 transition">
              Kids
            </Link>
            <Link href="/products?featured=true" className="hover:text-rose-600 transition">
              New Arrivals
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:text-rose-600 transition">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/account" className="p-2 hover:text-rose-600 transition">
              <User className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="relative p-2 hover:text-rose-600 transition">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t">
            <Link href="/products?category=women" className="block py-2 hover:text-rose-600">
              Women
            </Link>
            <Link href="/products?category=men" className="block py-2 hover:text-rose-600">
              Men
            </Link>
            <Link href="/products?category=kids" className="block py-2 hover:text-rose-600">
              Kids
            </Link>
            <Link href="/products?featured=true" className="block py-2 hover:text-rose-600">
              New Arrivals
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}