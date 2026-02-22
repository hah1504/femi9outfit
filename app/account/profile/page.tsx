'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Package, MapPin, Settings, LogOut, Heart } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { getCurrentUser, signOut } from '@/lib/supabase/auth'
import { isCurrentUserAdmin } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/utils'

interface AccountOrder {
  id: string
  customer_name: string
  total_amount: number
  status: string
  created_at: string
  customer_email: string | null
  order_items: Array<{
    quantity: number
    price: number
    size: string | null
    color: string | null
    products: {
      name: string
      slug: string
    } | null
  }>
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState<AccountOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const run = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/account')
          return
        }
        setUser(currentUser)

        const { isAdmin } = await isCurrentUserAdmin()
        setIsAdmin(isAdmin)

        if (!isAdmin) {
          const response = await fetch('/api/account/orders')
          if (response.ok) {
            const result = await response.json()
            setOrders(result.orders || [])
          }
        }
      } catch {
        router.push('/account')
      } finally {
        setOrdersLoading(false)
        setLoading(false)
      }
    }

    run()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-rose-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user?.user_metadata?.full_name || 'Admin'}
                    </h1>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Admin Account</h2>
              <p className="text-gray-600 mb-6">
                Customer profile sections (orders, wishlist, addresses, settings) are disabled for admin users.
              </p>
              <Link
                href="/admin/dashboard"
                className="inline-block bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition"
              >
                Go to Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-rose-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user?.user_metadata?.full_name || 'User'}
                  </h1>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === 'orders'
                        ? 'bg-rose-50 text-rose-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    My Orders
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === 'wishlist'
                        ? 'bg-rose-50 text-rose-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                    Wishlist
                  </button>

                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === 'addresses'
                        ? 'bg-rose-50 text-rose-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    Addresses
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === 'settings'
                        ? 'bg-rose-50 text-rose-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'orders' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>

                  {ordersLoading ? (
                    <div className="text-center py-12">
                      <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading your orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">
                        Start shopping to see your orders here
                      </p>
                      <Link
                        href="/products"
                        className="inline-block bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                            <div>
                              <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.created_at).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-gray-700">
                                {formatPrice(Number(order.total_amount))}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                                {order.status}
                              </span>
                            </div>
                          </div>

                          <div className="border-t pt-3">
                            <p className="text-sm font-semibold text-gray-800 mb-2">Items</p>
                            <div className="space-y-2">
                              {order.order_items?.length ? (
                                order.order_items.map((item, index) => (
                                  <div key={`${order.id}-${index}`} className="text-sm text-gray-700 flex items-center justify-between gap-4">
                                    <span>
                                      {item.products?.name || 'Product'} x{item.quantity}
                                      {(item.size || item.color) && (
                                        <span className="text-gray-500">
                                          {' '}
                                          ({item.size ? `Size: ${item.size}` : ''}{item.size && item.color ? ', ' : ''}{item.color ? `Color: ${item.color}` : ''})
                                        </span>
                                      )}
                                    </span>
                                    <span className="font-medium">{formatPrice(Number(item.price) * Number(item.quantity))}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">No items found for this order.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Wishlist</h2>
                  
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-6">
                      Save your favorite items for later
                    </p>
                    <Link
                      href="/products"
                      className="inline-block bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition"
                    >
                      Browse Products
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                    <button className="bg-rose-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-700 transition">
                      Add New Address
                    </button>
                  </div>
                  
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved addresses</h3>
                    <p className="text-gray-600">
                      Add addresses for faster checkout
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.user_metadata?.full_name || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+92 3XX XXXXXXX"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent"
                      />
                    </div>

                    <div className="pt-4">
                      <button className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition">
                        Save Changes
                      </button>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                      <Link
                        href="/account/change-password"
                        className="text-rose-600 hover:text-rose-700 font-medium"
                      >
                        Update your password →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
