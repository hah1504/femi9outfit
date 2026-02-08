import { ProductCard } from '@/components/products/product-card'
import { getProducts } from '@/lib/supabase/queries'
import Link from 'next/link'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subcategory?: string; featured?: string; season?: string }>
}) {
  const params = await searchParams
  const category = params.category
  const subcategory = params.subcategory
  const featured = params.featured === 'true'
  const season = params.season

  // Build filters
  const filters: { category?: string; subcategory?: string; featured?: boolean } = {}
  if (category) filters.category = category
  if (subcategory) filters.subcategory = subcategory
  if (featured) filters.featured = true

  // Fetch products
  let products = await getProducts(filters)

  // Filter by season if provided
  if (season === 'winter') {
    products = products.filter(p =>
      ['marina', 'velvet', 'khaddar', 'karandi', 'linen'].includes(p.subcategory || '')
    )
  } else if (season === 'summer') {
    products = products.filter(p =>
      ['lawn', 'silk', 'organza', 'chiffon'].includes(p.subcategory || '')
    )
  }

  // Page title
  const getTitle = () => {
    if (category === 'party') return 'Party Wear'
    if (category === 'men') return "Men's Collection"
    if (category === 'kids') return "Kids Collection"
    if (category === 'bedding') return 'Bedsheets & Bedding'
    if (category === 'shawls') return 'Embroidered Shawls'
    if (category === 'women') return "Women's Collection"
    if (subcategory) return subcategory.charAt(0).toUpperCase() + subcategory.slice(1) + ' Collection'
    if (season === 'winter') return 'Winter Collection'
    if (season === 'summer') return 'Summer Collection'
    if (featured) return 'New Arrivals'
    return 'All Products'
  }

  // Category filter tabs
  const categories = [
    { label: 'All', href: '/products' },
    { label: 'New Arrivals', href: '/products?featured=true' },
    { label: 'Winter', href: '/products?season=winter' },
    { label: 'Summer', href: '/products?season=summer' },
    { label: 'Party Wear', href: '/products?category=party' },
    { label: 'Bedsheets', href: '/products?category=bedding' },
    { label: 'Shawls', href: '/products?category=shawls' },
  ]

  const subcategories = [
    { label: 'Marina', href: '/products?subcategory=marina' },
    { label: 'Velvet', href: '/products?subcategory=velvet' },
    { label: 'Khaddar', href: '/products?subcategory=khaddar' },
    { label: 'Lawn', href: '/products?subcategory=lawn' },
    { label: 'Silk', href: '/products?subcategory=silk' },
    { label: 'Chiffon', href: '/products?subcategory=chiffon' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-rose-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{getTitle()}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{getTitle()}</h1>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => {
            const isActive =
              (cat.label === 'All' && !category && !subcategory && !featured && !season) ||
              (cat.label === 'New Arrivals' && featured) ||
              (cat.label === 'Winter' && season === 'winter') ||
              (cat.label === 'Summer' && season === 'summer') ||
              (cat.label === 'Party Wear' && category === 'party') ||
              (cat.label === 'Bedsheets' && category === 'bedding') ||
              (cat.label === 'Shawls' && category === 'shawls')

            return (
              <Link
                key={cat.label}
                href={cat.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  isActive
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </Link>
            )
          })}
        </div>

        {/* Subcategory Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {subcategories.map((sub) => {
            const isActive = subcategory === sub.label.toLowerCase()
            return (
              <Link
                key={sub.label}
                href={sub.href}
                className={`px-3 py-1 rounded-full text-xs font-medium transition border ${
                  isActive
                    ? 'border-rose-600 bg-rose-50 text-rose-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {sub.label}
              </Link>
            )
          })}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-600 mb-6">{products.length} products found</p>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">No products found</p>
            <Link
              href="/products"
              className="inline-block bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
