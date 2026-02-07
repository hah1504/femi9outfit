import Link from 'next/link'
import Image from 'next/image'
import { ProductCard } from '@/components/products/product-card'
import type { Product } from '@/types/database'

// Mock data - will be replaced with real Supabase data
const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Elegant Summer Dress',
    slug: 'elegant-summer-dress',
    description: 'Beautiful floral summer dress',
    price: 3499,
    category_id: 'women',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'],
    colors: ['Blue', 'Pink', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 15,
    is_active: true,
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Classic Denim Jacket',
    slug: 'classic-denim-jacket',
    description: 'Timeless denim jacket for all seasons',
    price: 4999,
    category_id: 'women',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
    colors: ['Blue', 'Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 10,
    is_active: true,
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    slug: 'cotton-t-shirt',
    description: 'Comfortable cotton t-shirt',
    price: 1299,
    category_id: 'men',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
    colors: ['White', 'Black', 'Gray'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 25,
    is_active: true,
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Kids Playful Hoodie',
    slug: 'kids-playful-hoodie',
    description: 'Warm and colorful hoodie for kids',
    price: 2199,
    category_id: 'kids',
    images: ['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400'],
    colors: ['Red', 'Blue', 'Green'],
    sizes: ['4Y', '6Y', '8Y', '10Y'],
    stock: 20,
    is_active: true,
    featured: true,
    created_at: new Date().toISOString(),
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] bg-gradient-to-r from-rose-100 to-pink-100">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              New Season Collection
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Discover the latest trends in fashion. Free shipping on orders above Rs.5999
            </p>
            <Link 
              href="/products"
              className="inline-block bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Women */}
            <Link href="/products?category=women" className="group relative h-80 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
                alt="Women's Fashion"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 z-20 flex items-end p-6">
                <h3 className="text-3xl font-bold text-white">Women</h3>
              </div>
            </Link>

            {/* Men */}
            <Link href="/products?category=men" className="group relative h-80 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <Image
                src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600"
                alt="Men's Fashion"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 z-20 flex items-end p-6">
                <h3 className="text-3xl font-bold text-white">Men</h3>
              </div>
            </Link>

            {/* Kids */}
            <Link href="/products?category=kids" className="group relative h-80 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <Image
                src="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600"
                alt="Kids Fashion"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 z-20 flex items-end p-6">
                <h3 className="text-3xl font-bold text-white">Kids</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-rose-600 hover:text-rose-700 font-semibold">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders above Rs.5999</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">Premium quality products</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">7 days return policy</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
