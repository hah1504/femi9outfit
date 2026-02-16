'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { resetPassword } from '@/lib/supabase/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await resetPassword(email)
      setSuccess('Password reset link sent. Please check your email inbox.')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset link.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your account email and we will send you a password reset link.
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm">
          <Link href="/account" className="text-rose-600 hover:text-rose-700">
            Back to Account
          </Link>
          <Link href="/admin" className="text-rose-600 hover:text-rose-700">
            Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  )
}
