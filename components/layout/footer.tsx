import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Femi9outfit</h3>
            <p className="text-sm">
              Your one-stop shop for quality clothing in Pakistan. We offer the best designs
              with affordable prices and free shipping on orders above Rs.5999.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white">Shop All</Link></li>
              <li><Link href="/products?category=women" className="hover:text-white">Women</Link></li>
              <li><Link href="/products?category=men" className="hover:text-white">Men</Link></li>
              <li><Link href="/products?featured=true" className="hover:text-white">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/track-order" className="hover:text-white">Track Order</Link></li>
              <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
              <li><Link href="/shipping" className="hover:text-white">Shipping Policy</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: info@femi9outfit.com</li>
              <li>Phone: +92 308 1234243</li>
              <li>WhatsApp: +92 308 1234243</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-white"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white"><Twitter size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Femi9outfit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}