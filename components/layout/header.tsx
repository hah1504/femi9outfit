'use client'

import Link from 'next/link'
import { ShoppingCart, Search, User, Menu, ChevronDown, Phone, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/lib/supabase/auth'

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [winterDropdown, setWinterDropdown] = useState(false)
  const [summerDropdown, setSummerDropdown] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  useEffect(() => {
    const supabase = createClient()

    const loadAuthState = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setAuthUser(user)

      if (!user) {
        setIsAdmin(false)
        return
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      setIsAdmin(data?.role === 'admin')
    }

    loadAuthState()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadAuthState()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut()
    setAccountMenuOpen(false)
    setAuthUser(null)
    setIsAdmin(false)
  }

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
          <nav className="hidden lg:flex items-center space-x-6 text-sm text-black">
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
              Men&apos;s Collection
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 text-black">
            <a href="tel:+923333524209" className="hidden md:flex items-center gap-1 text-sm hover:text-rose-600">
              <Phone className="w-4 h-4" />
              <span>+92 333 3524209</span>
            </a>
            <button className="p-2 hover:text-rose-600 transition">
              <Search className="w-5 h-5" />
            </button>
            <div className="relative" ref={menuRef}>
              {authUser ? (
                <>
                  <button
                    onClick={() => setAccountMenuOpen((prev) => !prev)}
                    className="p-2 hover:text-rose-600 transition"
                    aria-label="Account menu"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{authUser.email}</p>
                      </div>
                      {!isAdmin && (
                        <Link
                          href="/account/profile"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          My Profile
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/account" className="p-2 hover:text-rose-600 transition" aria-label="Account login">
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
            {!isAdmin && (
              <Link href="/cart" className="relative p-2 hover:text-rose-600 transition">
                <ShoppingCart className="w-5 h-5" />
                {isMounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t text-black">
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
