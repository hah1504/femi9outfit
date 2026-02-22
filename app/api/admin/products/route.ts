import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface CreateProductRequest {
  name?: string
  slug?: string
  description?: string
  price?: number
  category_id?: string
  subcategory?: string
  images?: string[]
  colors?: string[]
  sizes?: string[]
  stock?: number
  featured?: boolean
  is_active?: boolean
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function sanitizeList(values?: string[]) {
  if (!Array.isArray(values)) return []
  return values.map((v) => v.trim()).filter(Boolean)
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CreateProductRequest

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roleError || roleData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const name = payload.name?.trim()
    const categoryId = payload.category_id?.trim()
    const price = Number(payload.price)
    const stock = Number(payload.stock ?? 0)
    const rawSlug = (payload.slug || name || '').trim()
    const slug = slugify(rawSlug)

    if (!name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 })
    }

    if (!categoryId) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: 'Price must be a valid non-negative number' }, { status: 400 })
    }

    if (!Number.isFinite(stock) || stock < 0) {
      return NextResponse.json({ error: 'Stock must be a valid non-negative number' }, { status: 400 })
    }

    const images = sanitizeList(payload.images)
    const colors = sanitizeList(payload.colors)
    const sizes = sanitizeList(payload.sizes)

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        description: payload.description?.trim() || null,
        price,
        category_id: categoryId,
        subcategory: payload.subcategory?.trim() || null,
        images,
        colors,
        sizes,
        stock: Math.trunc(stock),
        featured: Boolean(payload.featured),
        is_active: payload.is_active !== false,
      })
      .select('*')
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Slug already exists. Please choose a unique slug.' }, { status: 409 })
      }

      console.error('Error creating product:', error)
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error in POST /api/admin/products:', error)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
