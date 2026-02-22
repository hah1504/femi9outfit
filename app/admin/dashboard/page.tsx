'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut,
  DollarSign,
  ShoppingBag,
  Eye
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isCurrentUserAdmin, signOutAdminSession } from '@/lib/supabase/admin'

interface DashboardOrder {
  id: string
  customer_name: string
  total_amount: number
  status: string
  created_at: string
  customer_phone: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
  })
  const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminAndLoad = async () => {
      const { isAdmin } = await isCurrentUserAdmin()
      if (!isAdmin) {
        router.push('/admin')
        return
      }
      fetchDashboardData()
    }

    checkAdminAndLoad()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const supabase = createClient()

      // Fetch statistics
      const { data: orders } = await supabase.from('orders').select('*')
      const { data: products } = await supabase.from('products').select('*')
      
      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0
      const uniqueCustomers = new Set(orders?.map(o => o.customer_phone)).size

      setStats({
        totalOrders: orders?.length || 0,
        totalRevenue,
        totalProducts: products?.length || 0,
        totalCustomers: uniqueCustomers,
      })

      // Fetch recent orders
      const { data: recent } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      setRecentOrders(recent || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOutAdminSession()
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Femi9outfit Admin</h1>
                <p className="text-xs md:text-sm text-gray-600">Management Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 md:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className="lg:hidden bg-white border-b overflow-x-auto">
        <nav className="px-2 py-2 inline-flex min-w-full gap-2">
          <Link href="/admin/dashboard" className="px-3 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium whitespace-nowrap">Dashboard</Link>
          <Link href="/admin/products" className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm whitespace-nowrap">Products</Link>
          <Link href="/admin/orders" className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm whitespace-nowrap">Orders</Link>
          <Link href="/admin/customers" className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm whitespace-nowrap">Customers</Link>
          <Link href="/" target="_blank" className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm whitespace-nowrap">View Store</Link>
        </nav>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-white min-h-screen shadow-sm">
          <nav className="p-4 space-y-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-600 rounded-lg font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Package className="w-5 h-5" />
              Products
            </Link>
            
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Orders
            </Link>
            
            <Link
              href="/admin/customers"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Users className="w-5 h-5" />
              Customers
            </Link>
            
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Eye className="w-5 h-5" />
              View Store
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs text-green-600 font-semibold">+12.5%</span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">Rs.{stats.totalRevenue.toLocaleString()}</p>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs text-blue-600 font-semibold">+8.2%</span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Total Orders</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>

            {/* Total Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <Link href="/admin/products" className="text-xs text-purple-600 font-semibold hover:underline">
                  Manage
                </Link>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Total Products</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>

            {/* Total Customers */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-rose-600" />
                </div>
                <span className="text-xs text-rose-600 font-semibold">+15.3%</span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Total Customers</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 md:p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                <Link
                  href="/admin/orders"
                  className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                >
                  View All →
                </Link>
              </div>
            </div>
            
            {/* Mobile Cards */}
            <div className="md:hidden divide-y">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">#{order.id.slice(0, 8)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{order.customer_name}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">Rs.{Number(order.total_amount).toLocaleString()}</p>
                      <p className="text-xs text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">No orders yet</div>
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{order.customer_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                          Rs.{Number(order.total_amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
