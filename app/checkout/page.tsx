'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'
import { getCurrentUser } from '@/lib/supabase/auth'
import { isCurrentUserAdmin } from '@/lib/supabase/admin'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAccountEmail, setIsAccountEmail] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingRole, setCheckingRole] = useState(true)

  const subtotal = getTotal()
  const freeShippingThreshold = 5999
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 0
  const total = subtotal + shippingCost

  useEffect(() => {
    const loadAccountEmail = async () => {
      try {
        const user = await getCurrentUser()
        if (user?.email) {
          setFormData((prev) => ({ ...prev, email: user.email || '' }))
          setIsAccountEmail(true)
        }
      } catch {
        setIsAccountEmail(false)
      } finally {
        const { isAdmin } = await isCurrentUserAdmin()
        setIsAdmin(isAdmin)
        setCheckingRole(false)
      }
    }

    loadAccountEmail()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.province.trim()) newErrors.province = 'Province is required'

    // Phone validation (Pakistani format)
    if (formData.phone && !/^(\+92|0)?3[0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Pakistani phone number'
    }

    if (!isAccountEmail && !formData.email.trim()) {
      newErrors.email = 'Email is required for order confirmation'
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email || undefined,
        customer_phone: formData.phone,
        shipping_address: formData.address,
        city: formData.city,
        province: formData.province,
        postal_code: formData.postalCode || undefined,
        notes: formData.notes || undefined,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
        total_amount: total,
        payment_method: 'COD',
        status: 'pending',
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.order) {
        throw new Error(result.error || 'Failed to place order')
      }

      const order = result.order

      console.log('Order created:', order)

      // Clear cart
      clearCart()

      // Show success message
      alert(`Order placed successfully! Your order ID is ${order.id}. We will contact you shortly to confirm.`)
      
      // Redirect to homepage
      router.push('/')
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to place order. Please try again or contact support.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">Add items to your cart before checkout.</p>
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

  if (checkingRole) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout Disabled For Admin</h1>
            <p className="text-lg text-gray-600 mb-8">
              Admin accounts cannot place customer orders.
            </p>
            <Link
              href="/admin/orders"
              className="inline-block bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition"
            >
              Go to Admin Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent ${
                        errors.firstName ? 'border-rose-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && <p className="text-rose-600 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent ${
                        errors.lastName ? 'border-rose-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && <p className="text-rose-600 text-sm mt-1">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="03XX XXXXXXX"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent ${
                        errors.phone ? 'border-rose-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && <p className="text-rose-600 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={isAccountEmail}
                      placeholder={isAccountEmail ? 'Using your account email' : 'you@example.com'}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent ${
                        errors.email ? 'border-rose-500' : 'border-gray-300'
                      }`}
                    />
                    {isAccountEmail && (
                      <p className="text-gray-500 text-sm mt-1">Order confirmation will be sent to your registered email.</p>
                    )}
                    {errors.email && <p className="text-rose-600 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House no, Street, Area"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent ${
                        errors.address ? 'border-rose-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.address && <p className="text-rose-600 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent ${
                          errors.city ? 'border-rose-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.city && <p className="text-rose-600 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Province <span className="text-rose-600">*</span>
                      </label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent ${
                          errors.province ? 'border-rose-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Province</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="KPK">Khyber Pakhtunkhwa</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Azad Kashmir">Azad Kashmir</option>
                        <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                      </select>
                      {errors.province && <p className="text-rose-600 text-sm mt-1">{errors.province}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Any special instructions for your order"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                
                <div className="border-2 border-rose-600 rounded-lg p-4 bg-rose-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-2xl">💵</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Cash on Delivery (COD)</h3>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-rose-600 bg-rose-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Please keep exact change ready when receiving your order. Our delivery person will collect payment at your doorstep.
                  </p>
                </div>

                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Contact Us:</strong> For any queries about your order, reach us at{' '}
                    <a href="mailto:minhaj_khan@hotmail.com" className="text-rose-600 hover:underline">minhaj_khan@hotmail.com</a>
                    {' '}or call{' '}
                    <a href="tel:+923333524209" className="text-rose-600 hover:underline">+92 333 3524209</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-3">
                      <div className="relative w-16 h-20 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-600">Size: {item.size}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">
                      {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {subtotal >= freeShippingThreshold && (
                    <div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-800">
                      🎉 You got free shipping!
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">COD charges included</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-rose-600 text-white py-4 rounded-lg font-semibold hover:bg-rose-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>

                <Link
                  href="/cart"
                  className="block w-full text-center py-3 text-gray-700 font-medium hover:text-rose-600 transition mt-3"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
