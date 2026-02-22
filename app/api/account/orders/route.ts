import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, customer_name, total_amount, status, created_at, customer_email')
      .eq('customer_email', user.email || '')
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('Error fetching account orders:', ordersError)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    const safeOrders = orders || []
    if (safeOrders.length === 0) {
      return NextResponse.json({ orders: [] })
    }

    const orderIds = safeOrders.map((order) => order.id)
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('order_id, product_id, quantity, price, size, color')
      .in('order_id', orderIds)

    if (orderItemsError) {
      console.error('Error fetching order items:', orderItemsError)
      return NextResponse.json({ error: 'Failed to fetch order items' }, { status: 500 })
    }

    const productIds = [...new Set((orderItems || []).map((item) => item.product_id))]
    let productsById = new Map<string, { id: string; name: string; slug: string }>()

    if (productIds.length > 0) {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, slug')
        .in('id', productIds)

      if (productsError) {
        console.error('Error fetching products for order items:', productsError)
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
      }

      productsById = new Map((products || []).map((product) => [product.id, product]))
    }
    const itemsByOrderId = new Map<string, Array<{
      quantity: number
      price: number
      size: string | null
      color: string | null
      products: { name: string; slug: string } | null
    }>>()

    for (const item of orderItems || []) {
      const list = itemsByOrderId.get(item.order_id) || []
      const product = productsById.get(item.product_id)
      list.push({
        quantity: item.quantity,
        price: Number(item.price),
        size: item.size,
        color: item.color,
        products: product ? { name: product.name, slug: product.slug } : null,
      })
      itemsByOrderId.set(item.order_id, list)
    }

    const hydratedOrders = safeOrders.map((order) => ({
      ...order,
      order_items: itemsByOrderId.get(order.id) || [],
    }))

    return NextResponse.json({ orders: hydratedOrders })
  } catch (error) {
    console.error('Error in GET /api/account/orders:', error)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
