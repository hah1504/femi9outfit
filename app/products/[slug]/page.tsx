import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, Truck, Shield, Phone, RotateCcw } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { ProductCard } from '@/components/products/product-card'
import { getProductBySlug, getProducts } from '@/lib/supabase/queries'
import { AddToCartButton } from '@/components/products/add-to-cart-button'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Fetch related products from same category
  const relatedProducts = await getProducts({
    category: product.category_id || undefined,
    limit: 5
  }).then(products => products.filter(p => p.id !== product.id).slice(0, 4))

  const originalPrice = product.price * 2
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100)

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-rose-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-rose-600">Products</Link>
          {product.category_id && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/products?category=${product.category_id}`} className="hover:text-rose-600 capitalize">
                {product.category_id}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-rose-600 text-white px-3 py-1 rounded text-sm font-semibold">
                  -{discount}%
                </span>
                {product.featured && (
                  <span className="bg-amber-500 text-white px-3 py-1 rounded text-sm font-semibold">
                    NEW
                  </span>
                )}
              </div>
              {product.stock <= 0 && (
                <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 rounded text-sm font-semibold">
                  Sold Out
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div key={index} className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.subcategory && (
                <p className="text-sm text-gray-500 uppercase tracking-wide">{product.subcategory} Collection</p>
              )}
            </div>

            {/* Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(60 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-rose-600">
                {formatPrice(product.price)}
              </span>
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                Save {formatPrice(originalPrice - product.price)}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Add to Cart + Buy Now Component */}
            <AddToCartButton product={product} />

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <Truck className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-500">Orders above Rs.5999</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <Shield className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">COD Available</p>
                  <p className="text-xs text-gray-500">Cash on delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <RotateCcw className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-500">7-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <Phone className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Need Help?</p>
                  <p className="text-xs text-gray-500">+92 333 3524209</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Product Details</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-1">&#8226;</span>
                  <span>Unstitched fabric (Size 5.25-meter dress)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-1">&#8226;</span>
                  <span>Embroidered front & sleeves</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-1">&#8226;</span>
                  <span>Dyed plain back & trouser</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-1">&#8226;</span>
                  <span>Delivery in 3-4 working days across Pakistan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 mt-1">&#8226;</span>
                  <span>Payment: Cash on Delivery (COD)</span>
                </li>
              </ul>
              <p className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded p-3">
                <strong>Note:</strong> Actual product color may vary slightly from the image due to screen settings. This is a high-quality replica suit.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="border-t pt-12 mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">4.9 out of 5</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-5">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h4 className="font-semibold mb-2">Very nice I recommend everyone</h4>
              <p className="text-gray-600 text-sm mb-3">Very nice quality fabric. I recommend everyone to buy from here. Will order again!</p>
              <p className="text-xs text-gray-500 font-medium">- Sohail Jutt</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h4 className="font-semibold mb-2">Best fabric best quality</h4>
              <p className="text-gray-600 text-sm mb-3">Super quality fabric... embroidery is so elegant. Thanks, I like it very much!</p>
              <p className="text-xs text-gray-500 font-medium">- Z.S.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h4 className="font-semibold mb-2">Excellent service</h4>
              <p className="text-gray-600 text-sm mb-3">Very nice. Excellent service. Keep it up. Definitely will order again!</p>
              <p className="text-xs text-gray-500 font-medium">- Samra Adnan</p>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div className="border-t pt-12">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
