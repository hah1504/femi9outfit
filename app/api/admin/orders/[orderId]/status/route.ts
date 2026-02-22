import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendOrderConfirmedByAdminEmail } from '@/lib/email/order-confirmation'

const ALLOWED_STATUSES = new Set(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])

export async function PATCH(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params
    const { status } = (await request.json()) as { status?: string }

    if (!status || !ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
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

    const { data: existingOrder, error: existingError } = await supabase
      .from('orders')
      .select('id, customer_name, customer_email, total_amount, status')
      .eq('id', orderId)
      .single()

    if (existingError || !existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select('*')
      .single()

    if (updateError || !updatedOrder) {
      console.error('Error updating order status:', updateError)
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
    }

    if (status === 'confirmed' && existingOrder.status !== 'confirmed' && existingOrder.customer_email) {
      const { data: items } = await supabase
        .from('order_items')
        .select('product_id, quantity, price')
        .eq('order_id', orderId)

      const productIds = [...new Set((items || []).map((item) => item.product_id))]
      const { data: products } = productIds.length
        ? await supabase.from('products').select('id, name').in('id', productIds)
        : { data: [], error: null }

      const productMap = new Map((products || []).map((product) => [product.id, product.name]))

      try {
        await sendOrderConfirmedByAdminEmail({
          to: existingOrder.customer_email,
          orderId: existingOrder.id,
          customerName: existingOrder.customer_name,
          totalAmount: Number(existingOrder.total_amount),
          items: (items || []).map((item) => ({
            name: productMap.get(item.product_id) || 'Product',
            quantity: item.quantity,
            price: Number(item.price),
          })),
        })
      } catch (emailError) {
        console.error('Order confirmed but email failed:', emailError)
      }
    }

    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    console.error('Error in PATCH /api/admin/orders/[orderId]/status:', error)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
