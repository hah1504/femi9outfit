'use client'

import Link from 'next/link'
import { ShoppingCart, Search, User, Menu, ChevronDown, Phone } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useState } from 'react'

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [winterDropdown, setWinterDropdown] = useState(false)
  const [summerDropdown, setSummerDropdown] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center py-2 text-sm font-medium">
        FREE SHIPPING WHEN YOUR ORDER IS ABOVE RS.5999
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 hover:bg-gray-100 rounded"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-rose-600">
            Femi9outfit
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm">
            <Link href="/products" className="hover:text-rose-600 transition font-medium">
              Ready to Wear
            </Link>
            <Link href="/products?featured=true" className="hover:text-rose-600 transition font-medium">
              New Arrivals
            </Link>
            
            {/* Winter Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setWinterDropdown(true)}
              onMouseLeave={() => setWinterDropdown(false)}
            >
              <button className="hover:text-rose-600 transition font-medium flex items-center gap-1">
                Winter <ChevronDown className="w-4 h-4" />
              </button>
              {winterDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[180px]">
                  <Link href="/products?subcategory=marina" className="block px-4 py-2 hover:bg-gray-50 hover:text-rose-600">Marina</Link>
                  <Link href="/products?subcategory=karandi" className="block px-4 py-2 hover:bg-gray-50 hover:text-rose-600">Karandi</Link>
                  <Link href="/products?subcategory=velvet" className="block px-4 py-2 hover:bg-gray-50 hover:text-rose-600">Velvet</Link>
                  <Link href="/products?subcategory=khaddar" className="block px-4 py-2 hover:bg-gray-50 hover:text-rose-600">Khaddar</Link>
                  <Link href="/products?subcategory=linen" className="block px-4 py-2 hover:bg-gray-50 hover:text-rose-600">Linen</Link>
                </div>
              )}
            </div>

            {/* Summer Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setSummerDropdown(true)}
              onMouseLeave={() => setSummerDropdown(false)}
            >
              <button className="hover:text-rose-600 transition font-medium flex items-center gap-1">
                Summer <ChevronDown className="w-4 h-4" />
              </button>
              {summerDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[180px]">
                  <Link href="/products?subcategory=lawn" className="block px-4 py-2 hover:bg-gray-50 hover:text-rose-600">Lawn</Link>
                  <Link href="/products?subcategory=silk" className="block px-4 py-2 hover:bg-gray-50 hover:text-rose-600">Silk</Link>
                  <Link href="/products?subcategory=organza" className="block px-4 py-2 hover:bg-gray-50 hover:text-rose-600">Organza</Link>
                </div>
              )}
            </div>

            <Link href="/products?category=party" className="hover:text-rose-600 transition font-medium">
              Party Wear
            </Link>
            <Link href="/products?category=men" className="hover:text-rose-600 transition font-medium">
              Men's Collection
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <a href="tel:+923333524209" className="hidden md:flex items-center gap-1 text-sm hover:text-rose-600">
              <Phone className="w-4 h-4" />
              <span>+92 333 3524209</span>
            </a>
            <button className="p-2 hover:text-rose-600 transition">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/account" className="p-2 hover:text-rose-600 transition">
              <User className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="relative p-2 hover:text-rose-600 transition">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t">
            <Link href="/products" className="block py-2 hover:text-rose-600 font-medium">
              Ready to Wear
            </Link>
            <Link href="/products?featured=true" className="block py-2 hover:text-rose-600 font-medium">
              New Arrivals
            </Link>
            <div className="py-2">
              <p className="font-semibold text-gray-900 mb-2">Winter</p>
              <Link href="/products?subcategory=marina" className="block py-1 pl-4 hover:text-rose-600">Marina</Link>
              <Link href="/products?subcategory=karandi" className="block py-1 pl-4 hover:text-rose-600">Karandi</Link>
              <Link href="/products?subcategory=velvet" className="block py-1 pl-4 hover:text-rose-600">Velvet</Link>
            </div>
            <div className="py-2">
              <p className="font-semibold text-gray-900 mb-2">Summer</p>
              <Link href="/products?subcategory=lawn" className="block py-1 pl-4 hover:text-rose-600">Lawn</Link>
              <Link href="/products?subcategory=silk" className="block py-1 pl-4 hover:text-rose-600">Silk</Link>
              <Link href="/products?subcategory=organza" className="block py-1 pl-4 hover:text-rose-600">Organza</Link>
            </div>
            <Link href="/products?category=party" className="block py-2 hover:text-rose-600 font-medium">
              Party Wear
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}