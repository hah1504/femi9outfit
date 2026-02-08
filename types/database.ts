export interface Product {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    category_id: string
    subcategory: string | null
    images: string[]
    sizes: string[]
    colors: string[]
    stock: number
    is_active: boolean
    featured: boolean
    created_at: string
    updated_at?: string
    category?: Category
  }
  
  export interface Category {
    id: string
    name: string
    slug: string
    image_url: string | null
    created_at: string
  }
  
  export interface Order {
    id: string
    user_id: string | null
    order_number: string
    total: number
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    payment_method: string
    shipping_address: {
      name: string
      phone: string
      address: string
      city: string
      province: string
      postalCode?: string
    }
    phone: string
    created_at: string
  }
  
  export interface OrderItem {
    id: string
    order_id: string
    product_id: string
    quantity: number
    price: number
    size: string | null
    color: string | null
    product_name: string
  }