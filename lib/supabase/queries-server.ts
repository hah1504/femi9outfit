import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types/database'

const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function logMissingConfig() {
  console.warn(
    'Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  )
}

// Fetch all products (server-side)
export async function getProducts(filters?: {
  category?: string
  subcategory?: string
  featured?: boolean
  limit?: number
}) {
  if (!hasSupabaseConfig) {
    logMissingConfig()
    return []
  }

  const supabase = await createClient()

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

// Fetch single product by slug (server-side)
export async function getProductBySlug(slug: string) {
  if (!hasSupabaseConfig) {
    logMissingConfig()
    return null
  }

  const supabase = await createClient()

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

// Fetch featured products (server-side)
export async function getFeaturedProducts(limit = 4) {
  return getProducts({ featured: true, limit })
}

// Fetch products by category (server-side)
export async function getProductsByCategory(category: string, limit?: number) {
  return getProducts({ category, limit })
}

// Fetch products by subcategory (server-side)
export async function getProductsBySubcategory(subcategory: string, limit?: number) {
  return getProducts({ subcategory, limit })
}
