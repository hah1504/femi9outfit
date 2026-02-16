'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Mail, Shield } from 'lucide-react'
import { signIn } from '@/lib/supabase/auth'
import { isCurrentUserAdmin, signOutAdminSession } from '@/lib/supabase/admin'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    adminId: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(formData.adminId, formData.password)
      const { isAdmin } = await isCurrentUserAdmin()

      if (!isAdmin) {
        await signOutAdminSession()
        setError('You do not have admin access.')
        return
      }

      router.push('/admin/dashboard')
    } catch {
      setError('Invalid ID or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-rose-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-300">Femi9outfit Management System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.adminId}
                  onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent"
                  placeholder="Enter your admin ID"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-right">
            <Link href="/account/forgot-password" className="text-sm text-rose-600 hover:text-rose-700">
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-300 hover:text-white text-sm">
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  )
}
