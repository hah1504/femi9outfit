import Link from 'next/link'
import Image from 'next/image'
import { ProductCard } from '@/components/products/product-card'
import { Star } from 'lucide-react'
import { getProducts, getFeaturedProducts, getProductsByCategory } from '@/lib/supabase/queries'

// Fetch data from Supabase
// Fetch data from Supabase

export default async function Home() {
  // Fetch products from Supabase
  const newArrivalProducts = await getFeaturedProducts(5)
  const winterCollection = await getProductsByCategory('women', 8).then(products => 
    products.filter(p => ['marina', 'velvet', 'khaddar'].includes(p.subcategory || ''))
  )
  const partyWearProducts = await getProductsByCategory('party', 4)

  // Show message if no products found
  const hasProducts = newArrivalProducts.length > 0 || winterCollection.length > 0 || partyWearProducts.length > 0

  if (!hasProducts) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">⚠️ Database Not Set Up Yet</h1>
              <p className="text-lg text-gray-700 mb-6">
                Your Supabase database needs to be initialized with the schema.
              </p>
              
              <div className="bg-white rounded-lg p-6 text-left max-w-2xl mx-auto">
                <h2 className="text-xl font-bold mb-4">Quick Setup (5 minutes):</h2>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex gap-3">
                    <span className="font-bold text-rose-600">1.</span>
                    <span>Go to: <a href="https://kxvtjoeipzsgfonvntxf.supabase.co" target="_blank" className="text-blue-600 underline">Supabase Dashboard</a></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-rose-600">2.</span>
                    <span>Click <strong>SQL Editor</strong> → <strong>New Query</strong></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-rose-600">3.</span>
                    <span>Open file: <code className="bg-gray-100 px-2 py-1 rounded">supabase/schema.sql</code></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-rose-600">4.</span>
                    <span>Copy all SQL code and paste into SQL Editor</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-rose-600">5.</span>
                    <span>Click <strong>RUN</strong></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-rose-600">6.</span>
                    <span>Refresh this page</span>
                  </li>
                </ol>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  ✅ This will create all tables and add 12 sample products automatically!
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>Need help? Check the file: <code className="bg-gray-100 px-2 py-1 rounded">SUPABASE_SETUP.md</code></p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner with Categories */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Winter */}
          <Link href="/products?season=winter" className="group relative h-64 md:h-80 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
              alt="Winter Collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Winter</h3>
              <button className="bg-white text-rose-600 px-4 py-2 rounded font-semibold text-sm hover:bg-rose-600 hover:text-white transition">
                SHOP NOW
              </button>
            </div>
          </Link>

          {/* Summer */}
          <Link href="/products?season=summer" className="group relative h-64 md:h-80 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600"
              alt="Summer Collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Summer</h3>
              <button className="bg-white text-rose-600 px-4 py-2 rounded font-semibold text-sm hover:bg-rose-600 hover:text-white transition">
                SHOP NOW
              </button>
            </div>
          </Link>

          {/* Bedsheets */}
          <Link href="/products?category=bedding" className="group relative h-64 md:h-80 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600"
              alt="Bedsheets"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Bedsheets</h3>
              <button className="bg-white text-rose-600 px-4 py-2 rounded font-semibold text-sm hover:bg-rose-600 hover:text-white transition">
                Shop Now
              </button>
            </div>
          </Link>

          {/* Embroidered Shawls */}
          <Link href="/products?category=shawls" className="group relative h-64 md:h-80 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600"
              alt="Embroidered Shawls"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">embroidered shawls</h3>
              <button className="bg-white text-rose-600 px-4 py-2 rounded font-semibold text-sm hover:bg-rose-600 hover:text-white transition">
                Shop Now
              </button>
            </div>
          </Link>
        </div>
      </section>

      {/* NEW IN Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">NEW IN</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {newArrivalProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Winter Collection Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Winter</h2>
            <Link href="/products?season=winter" className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {winterCollection.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Party Wear Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">PARTY WEAR</h2>
            <Link href="/products?category=party" className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {partyWearProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Let customers speak for us</h2>
            <p className="text-gray-600 text-lg">from 2207 reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Review 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h3 className="font-semibold mb-2">2 pc marina winter collection</h3>
              <p className="text-gray-600 text-sm mb-3">I ordered from femi9outfit every time... This is my first order of winter dress and I'm very satisfied with the quality...</p>
              <p className="text-sm text-gray-500">- Shumail Ayub</p>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h3 className="font-semibold mb-2">Best fabric best quality</h3>
              <p className="text-gray-600 text-sm mb-3">Super quality fabric ....embroidery is so elegant thanks i like it</p>
              <p className="text-sm text-gray-500">- Z.S.</p>
            </div>

            {/* Review 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h3 className="font-semibold mb-2">Excellent service</h3>
              <p className="text-gray-600 text-sm mb-3">Very nice. Excellent service. Keep it up. Definitely order again ❤️</p>
              <p className="text-sm text-gray-500">- Samra Adnan</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/reviews" className="inline-block bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition">
              View All Reviews
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
