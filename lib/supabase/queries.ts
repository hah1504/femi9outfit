import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types/database'

// Fetch all products
export async function getProducts(filters?: {
  category?: string
  subcategory?: string
  featured?: boolean
  limit?: number
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (filters?.category) {
    query = query.eq('category_id', filters.category)
  }

  if (filters?.subcategory) {
    query = query.eq('subcategory', filters.subcategory)
  }

  if (filters?.featured) {
    query = query.eq('featured', true)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as Product[]
}

// Fetch single product by slug
export async function getProductBySlug(slug: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data as Product
}

// Fetch featured products
export async function getFeaturedProducts(limit = 4) {
  return getProducts({ featured: true, limit })
}

// Fetch products by category
export async function getProductsByCategory(category: string, limit?: number) {
  return getProducts({ category, limit })
}

// Fetch products by subcategory
export async function getProductsBySubcategory(subcategory: string, limit?: number) {
  return getProducts({ subcategory, limit })
}

// Create order
export async function createOrder(orderData: {
  customer_name: string
  customer_email?: string
  customer_phone: string
  shipping_address: string
  city: string
  province: string
  postal_code?: string
  notes?: string
  items: Array<{
    product_id: string
    quantity: number
    price: number
    size?: string
    color?: string
  }>
  total_amount: number
  payment_method: string
  status?: string
}) {
  const supabase = createClient()

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      shipping_address: orderData.shipping_address,
      city: orderData.city,
      province: orderData.province,
      postal_code: orderData.postal_code,
      notes: orderData.notes,
      total_amount: orderData.total_amount,
      payment_method: orderData.payment_method,
      status: orderData.status || 'pending',
    })
    .select()
    .single()

  if (orderError) {
    console.error('Error creating order:', orderError)
    throw new Error('Failed to create order')
  }

  // Insert order items
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
    size: item.size,
    color: item.color,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error('Error creating order items:', itemsError)
    throw new Error('Failed to create order items')
  }

  return order
}

// Search products
export async function searchProducts(searchTerm: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .limit(20)

  if (error) {
    console.error('Error searching products:', error)
    return []
  }

  return data as Product[]
}
