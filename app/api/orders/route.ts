import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendNewOrderAdminEmail, sendOrderConfirmationEmail } from '@/lib/email/order-confirmation'

interface CreateOrderRequest {
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
}

function isValidPayload(payload: CreateOrderRequest) {
  return (
    payload.customer_name &&
    payload.customer_phone &&
    payload.shipping_address &&
    payload.city &&
    payload.province &&
    payload.payment_method &&
    Number.isFinite(payload.total_amount) &&
    Array.isArray(payload.items) &&
    payload.items.length > 0 &&
    payload.items.every(
      (item) =>
        item.product_id &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0 &&
        Number.isFinite(item.price)
    )
  )
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CreateOrderRequest

    if (!isValidPayload(payload)) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (roleData?.role === 'admin') {
        return NextResponse.json(
          { error: 'Admin accounts cannot place customer orders.' },
          { status: 403 }
        )
      }
    }

    const customerEmail = user?.email ?? payload.customer_email
    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Email is required to send order confirmation' },
        { status: 400 }
      )
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: payload.customer_name,
        customer_email: customerEmail,
        customer_phone: payload.customer_phone,
        shipping_address: payload.shipping_address,
        city: payload.city,
        province: payload.province,
        postal_code: payload.postal_code,
        notes: payload.notes,
        total_amount: payload.total_amount,
        payment_method: payload.payment_method,
        status: payload.status || 'pending',
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Error creating order:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    const orderItems = payload.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      color: item.color,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 })
    }

    const productIds = [...new Set(payload.items.map((item) => item.product_id))]
    const { data: products } = await supabase.from('products').select('id, name').in('id', productIds)
    const productMap = new Map((products || []).map((product) => [product.id, product.name]))

    try {
      await sendOrderConfirmationEmail({
        to: customerEmail,
        orderId: order.id,
        customerName: payload.customer_name,
        totalAmount: payload.total_amount,
        items: payload.items.map((item) => ({
          name: productMap.get(item.product_id) || 'Product',
          quantity: item.quantity,
          price: item.price,
        })),
      })
    } catch (emailError) {
      // Order creation should succeed even if SMTP is temporarily unavailable.
      console.error('Order created but email failed:', emailError)
    }

    const adminNotificationEmail =
      process.env.ADMIN_NOTIFICATION_EMAIL || 'minhaj_khan@hotmail.com'

    try {
      await sendNewOrderAdminEmail({
        to: adminNotificationEmail,
        orderId: order.id,
        customerName: payload.customer_name,
        customerEmail,
        customerPhone: payload.customer_phone,
        totalAmount: payload.total_amount,
        shippingAddress: {
          address: payload.shipping_address,
          city: payload.city,
          province: payload.province,
          postalCode: payload.postal_code || null,
        },
        items: payload.items.map((item) => ({
          name: productMap.get(item.product_id) || 'Product',
          quantity: item.quantity,
          price: item.price,
        })),
      })
    } catch (adminEmailError) {
      // Do not fail order creation if admin notification email fails.
      console.error('Order created but admin notification email failed:', adminEmailError)
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error in POST /api/orders:', error)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
