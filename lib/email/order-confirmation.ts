import { formatPrice } from '@/lib/utils'
import { sendSmtpMail } from '@/lib/email/smtp'

interface OrderConfirmationItem {
  name: string
  quantity: number
  price: number
}

interface OrderConfirmationPayload {
  to: string
  orderId: string
  customerName: string
  totalAmount: number
  items: OrderConfirmationItem[]
}

export interface OrderStatusEmailPayload {
  to: string
  orderId: string
  customerName: string
  totalAmount: number
  items: OrderConfirmationItem[]
}

export interface AdminNewOrderEmailPayload {
  to: string
  orderId: string
  customerName: string
  customerEmail?: string | null
  customerPhone: string
  totalAmount: number
  shippingAddress: {
    address: string
    city: string
    province: string
    postalCode?: string | null
  }
  items: OrderConfirmationItem[]
}

export async function sendOrderConfirmationEmail(payload: OrderConfirmationPayload) {
  const itemsSummary = payload.items
    .map((item) => `- ${item.name} x${item.quantity} (${formatPrice(item.price)})`)
    .join('\n')

  const text = [
    `Assalam o Alaikum ${payload.customerName},`,
    '',
    'Thank you for your order at Femi9outfit.',
    '',
    `Order ID: ${payload.orderId}`,
    `Total: ${formatPrice(payload.totalAmount)}`,
    '',
    'Items:',
    itemsSummary || '- (No items found)',
    '',
    'We will contact you shortly to confirm your Cash on Delivery order.',
    '',
    'Regards,',
    'Femi9outfit Team',
  ].join('\n')

  return sendSmtpMail({
    to: payload.to,
    subject: `Order Confirmation - ${payload.orderId}`,
    text,
  })
}

export async function sendOrderConfirmedByAdminEmail(payload: OrderStatusEmailPayload) {
  const itemsSummary = payload.items
    .map((item) => `- ${item.name} x${item.quantity} (${formatPrice(item.price)})`)
    .join('\n')

  const text = [
    `Assalam o Alaikum ${payload.customerName},`,
    '',
    'Good news. Your order has been confirmed by our team.',
    '',
    `Order ID: ${payload.orderId}`,
    `Total: ${formatPrice(payload.totalAmount)}`,
    '',
    'Items:',
    itemsSummary || '- (No items found)',
    '',
    'We will dispatch your order soon and share the delivery update.',
    '',
    'Regards,',
    'Femi9outfit Team',
  ].join('\n')

  return sendSmtpMail({
    to: payload.to,
    subject: `Order Confirmed - ${payload.orderId}`,
    text,
  })
}

export async function sendNewOrderAdminEmail(payload: AdminNewOrderEmailPayload) {
  const itemsSummary = payload.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} | Price: ${formatPrice(item.price)} | Qty: ${item.quantity}`
    )
    .join('\n')

  const shippingLines = [
    payload.shippingAddress.address,
    `${payload.shippingAddress.city}, ${payload.shippingAddress.province}`,
    payload.shippingAddress.postalCode ? `Postal Code: ${payload.shippingAddress.postalCode}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const text = [
    'New order received on Femi9outfit.',
    '',
    `Order ID: ${payload.orderId}`,
    `Customer: ${payload.customerName}`,
    `Email: ${payload.customerEmail || 'N/A'}`,
    `Phone: ${payload.customerPhone}`,
    `Total: ${formatPrice(payload.totalAmount)}`,
    '',
    'Shipping Address:',
    shippingLines,
    '',
    'Items:',
    itemsSummary || '- (No items found)',
  ].join('\n')

  return sendSmtpMail({
    to: payload.to,
    subject: `New Order Alert - ${payload.orderId}`,
    text,
  })
}
