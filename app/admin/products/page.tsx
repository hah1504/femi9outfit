'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Upload,
  X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types/database'
import { isCurrentUserAdmin, signOutAdminSession } from '@/lib/supabase/admin'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [isUploadingEditImages, setIsUploadingEditImages] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [editUploadedImages, setEditUploadedImages] = useState<string[]>([])
  const [createError, setCreateError] = useState('')
  const [editError, setEditError] = useState('')
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [createForm, setCreateForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category_id: 'women',
    subcategory: '',
    stock: '0',
    featured: false,
    is_active: true,
    colors: '',
    sizes: '',
  })
  const [editForm, setEditForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category_id: 'women',
    subcategory: '',
    stock: '0',
    featured: false,
    is_active: true,
    colors: '',
    sizes: '',
  })

  useEffect(() => {
    const checkAdminAndLoad = async () => {
      const { isAdmin } = await isCurrentUserAdmin()
      if (!isAdmin) {
        router.push('/admin')
        return
      }
      fetchProducts()
    }

    checkAdminAndLoad()
  }, [router])

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchTerm, products])

  const fetchProducts = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setProducts(data)
        setFilteredProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (!error) {
        alert('Product deleted successfully!')
        fetchProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  const handleLogout = async () => {
    await signOutAdminSession()
    router.push('/admin')
  }

  const parseList = (value: string) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

  const uploadFilesToStorage = async (files: FileList | null) => {
    if (!files || files.length === 0) return []

    const supabase = createClient()
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_IMAGES_BUCKET || 'product-images'
    const uploadedUrls: string[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const safeName = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-|-$/g, '')
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || undefined,
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      if (data?.publicUrl) {
        uploadedUrls.push(data.publicUrl)
      }
    }

    return uploadedUrls
  }

  const openEditModal = (product: Product) => {
    setEditingProductId(product.id)
    setEditError('')
    setEditForm({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      price: String(product.price ?? ''),
      category_id: product.category_id || 'women',
      subcategory: product.subcategory || '',
      stock: String(product.stock ?? 0),
      featured: Boolean(product.featured),
      is_active: product.is_active !== false,
      colors: (product.colors || []).join(', '),
      sizes: (product.sizes || []).join(', '),
    })
    setEditUploadedImages([...(product.images || [])])
    setShowEditModal(true)
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError('')

    if (uploadedImages.length === 0) {
      setCreateError('Please upload at least one product image from your device.')
      return
    }

    setIsCreating(true)

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: createForm.name,
          slug: createForm.slug || undefined,
          description: createForm.description || undefined,
          price: Number(createForm.price),
          category_id: createForm.category_id,
          subcategory: createForm.subcategory || undefined,
          stock: Number(createForm.stock),
          featured: createForm.featured,
          is_active: createForm.is_active,
          images: uploadedImages,
          colors: parseList(createForm.colors),
          sizes: parseList(createForm.sizes),
        }),
      })

      const result = await response.json()
      if (!response.ok || !result.product) {
        throw new Error(result.error || 'Failed to create product')
      }

      setShowAddModal(false)
      setCreateForm({
        name: '',
        slug: '',
        description: '',
        price: '',
        category_id: 'women',
        subcategory: '',
        stock: '0',
        featured: false,
        is_active: true,
        colors: '',
        sizes: '',
      })
      setUploadedImages([])
      await fetchProducts()
      alert('Product created successfully!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create product'
      setCreateError(message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setCreateError('')
    setIsUploadingImages(true)

    try {
      const uploadedUrls = await uploadFilesToStorage(files)

      if (uploadedUrls.length > 0) {
        setUploadedImages((prev) => [...prev, ...uploadedUrls])
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Image upload failed'
      setCreateError(`Image upload failed: ${message}`)
    } finally {
      setIsUploadingImages(false)
    }
  }

  const handleUploadEditImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setEditError('')
    setIsUploadingEditImages(true)

    try {
      const uploadedUrls = await uploadFilesToStorage(files)
      if (uploadedUrls.length > 0) {
        setEditUploadedImages((prev) => [...prev, ...uploadedUrls])
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Image upload failed'
      setEditError(`Image upload failed: ${message}`)
    } finally {
      setIsUploadingEditImages(false)
    }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError('')

    if (!editingProductId) {
      setEditError('No product selected for editing.')
      return
    }

    if (editUploadedImages.length === 0) {
      setEditError('Please upload at least one product image from your device.')
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/admin/products/${editingProductId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name,
          slug: editForm.slug || undefined,
          description: editForm.description || undefined,
          price: Number(editForm.price),
          category_id: editForm.category_id,
          subcategory: editForm.subcategory || undefined,
          stock: Number(editForm.stock),
          featured: editForm.featured,
          is_active: editForm.is_active,
          images: editUploadedImages,
          colors: parseList(editForm.colors),
          sizes: parseList(editForm.sizes),
        }),
      })

      const result = await response.json()
      if (!response.ok || !result.product) {
        throw new Error(result.error || 'Failed to update product')
      }

      setShowEditModal(false)
      setEditingProductId(null)
      setEditUploadedImages([])
      await fetchProducts()
      alert('Product updated successfully!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update product'
      setEditError(message)
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Femi9outfit Admin</h1>
                <p className="text-xs md:text-sm text-gray-600">Product Management</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 md:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className="lg:hidden bg-white border-b overflow-x-auto">
        <nav className="px-2 py-2 inline-flex min-w-full gap-2">
          <Link href="/admin/dashboard" className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm whitespace-nowrap">Dashboard</Link>
          <Link href="/admin/products" className="px-3 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium whitespace-nowrap">Products</Link>
          <Link href="/admin/orders" className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm whitespace-nowrap">Orders</Link>
          <Link href="/admin/customers" className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm whitespace-nowrap">Customers</Link>
          <Link href="/" target="_blank" className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm whitespace-nowrap">View Store</Link>
        </nav>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-white min-h-screen shadow-sm">
          <nav className="p-4 space-y-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-600 rounded-lg font-medium"
            >
              <Package className="w-5 h-5" />
              Products
            </Link>
            
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Orders
            </Link>
            
            <Link
              href="/admin/customers"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Users className="w-5 h-5" />
              Customers
            </Link>
            
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Eye className="w-5 h-5" />
              View Store
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Products</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-rose-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-rose-700 transition text-sm md:text-base"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                <div className="relative aspect-[3/4] bg-gray-100">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                      title="View Product"
                    >
                      <Eye className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                      title="Edit Product"
                    >
                      <Edit className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                      title="Delete Product"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-rose-600">
                      Rs.{product.price.toLocaleString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 capitalize">
                    {product.category_id} {product.subcategory && `• ${product.subcategory}`}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try a different search term' : 'Start by adding your first product'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition"
                >
                  Add Product
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center p-3 md:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 md:p-6 my-2 md:my-8 max-h-[calc(100vh-1.5rem)] md:max-h-[calc(100vh-4rem)] overflow-y-auto">
            <h3 className="text-xl font-bold text-black mb-4">Add New Product</h3>

            {createError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug (optional)</label>
                  <input
                    value={createForm.slug}
                    onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="product-slug"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={createForm.price}
                    onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={createForm.stock}
                    onChange={(e) => setCreateForm({ ...createForm, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    required
                    value={createForm.category_id}
                    onChange={(e) => setCreateForm({ ...createForm, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                    <option value="party">Party Wear</option>
                    <option value="bedding">Bedding</option>
                    <option value="shawls">Shawls</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                  <input
                    value={createForm.subcategory}
                    onChange={(e) => setCreateForm({ ...createForm, subcategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="marina / velvet / lawn"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                  <div className="mb-2 flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingImages ? 'Uploading...' : 'Upload Images'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          handleUploadImages(e.target.files)
                          e.currentTarget.value = ''
                        }}
                        disabled={isUploadingImages}
                      />
                    </label>
                    <p className="text-xs text-gray-500">
                      Select files from your computer. They upload to Supabase Storage.
                    </p>
                  </div>
                  {uploadedImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {uploadedImages.map((url, index) => (
                        <div key={`${url}-${index}`} className="relative aspect-square border rounded overflow-hidden bg-gray-50">
                          <Image
                            src={url}
                            alt={`Uploaded ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setUploadedImages((prev) => prev.filter((_, i) => i !== index))
                            }
                            className="absolute top-1 right-1 bg-black/70 text-white rounded p-1"
                            aria-label="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="absolute left-1 bottom-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">
                            #{index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 border border-dashed border-gray-300 rounded p-3">
                      No images uploaded yet.
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma-separated)</label>
                    <input
                      value={createForm.colors}
                      onChange={(e) => setCreateForm({ ...createForm, colors: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Black, Blue, Maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma-separated)</label>
                    <input
                      value={createForm.sizes}
                      onChange={(e) => setCreateForm({ ...createForm, sizes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="S, M, L, XL"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={createForm.featured}
                    onChange={(e) => setCreateForm({ ...createForm, featured: e.target.checked })}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={createForm.is_active}
                    onChange={(e) => setCreateForm({ ...createForm, is_active: e.target.checked })}
                  />
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:bg-gray-400"
                >
                  {isCreating ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center p-3 md:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 md:p-6 my-2 md:my-8 max-h-[calc(100vh-1.5rem)] md:max-h-[calc(100vh-4rem)] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Product</h3>

            {editError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug (optional)</label>
                  <input
                    value={editForm.slug}
                    onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="product-slug"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    required
                    value={editForm.category_id}
                    onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                    <option value="party">Party Wear</option>
                    <option value="bedding">Bedding</option>
                    <option value="shawls">Shawls</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                  <input
                    value={editForm.subcategory}
                    onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="marina / velvet / lawn"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                  <div className="mb-2 flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingEditImages ? 'Uploading...' : 'Upload Images'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          handleUploadEditImages(e.target.files)
                          e.currentTarget.value = ''
                        }}
                        disabled={isUploadingEditImages}
                      />
                    </label>
                    <p className="text-xs text-gray-500">
                      Select files from your computer. They upload to Supabase Storage.
                    </p>
                  </div>
                  {editUploadedImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {editUploadedImages.map((url, index) => (
                        <div key={`${url}-${index}`} className="relative aspect-square border rounded overflow-hidden bg-gray-50">
                          <Image
                            src={url}
                            alt={`Uploaded ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setEditUploadedImages((prev) => prev.filter((_, i) => i !== index))
                            }
                            className="absolute top-1 right-1 bg-black/70 text-white rounded p-1"
                            aria-label="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="absolute left-1 bottom-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">
                            #{index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 border border-dashed border-gray-300 rounded p-3">
                      No images uploaded yet.
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma-separated)</label>
                    <input
                      value={editForm.colors}
                      onChange={(e) => setEditForm({ ...editForm, colors: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Black, Blue, Maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma-separated)</label>
                    <input
                      value={editForm.sizes}
                      onChange={(e) => setEditForm({ ...editForm, sizes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="S, M, L, XL"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={editForm.featured}
                    onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                  />
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingProductId(null)
                    setEditError('')
                    setEditUploadedImages([])
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:bg-gray-400"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
