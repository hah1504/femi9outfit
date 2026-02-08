-- Supabase Database Schema for Femi9outfit E-commerce

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id TEXT NOT NULL,
  subcategory TEXT,
  images TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT,
  notes TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  size TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories Table (Optional - for better organization)
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products (you can customize these)
INSERT INTO products (name, slug, description, price, category_id, subcategory, images, colors, sizes, stock, featured) VALUES
  ('Embroidered 3pc Marina Dress With Printed Shawl', 'embroidered-marina-dress-1', 'Beautiful embroidered marina dress with printed shawl', 4690, 'women', 'marina', 
   ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'], 
   ARRAY['Green', 'Pink', 'White'], ARRAY['S', 'M', 'L', 'XL'], 15, true),
  
  ('Embroidered 2pc Velvet Dress', 'embroidered-velvet-dress', 'Elegant embroidered velvet dress', 4990, 'women', 'velvet',
   ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
   ARRAY['Maroon', 'Black'], ARRAY['S', 'M', 'L', 'XL'], 10, true),
  
  ('Embroidered 3pc Lawn Dress With Chiffon Dupatta', 'embroidered-lawn-dress', 'Beautiful lawn dress with embroidered chiffon dupatta', 4690, 'women', 'lawn',
   ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800'],
   ARRAY['Green', 'Blue'], ARRAY['S', 'M', 'L', 'XL'], 25, true),
  
  ('Embroidered Chiffon Unstitched 3Pc Suit', 'embroidered-chiffon-suit', 'Premium chiffon party wear', 5899, 'party', 'chiffon',
   ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800'],
   ARRAY['Peach', 'Gold'], ARRAY['S', 'M', 'L', 'XL'], 8, true),
  
  ('Grace Marina Embroidered 2pc Dress', 'grace-marina-dress', 'Premium marina winter dress', 2999, 'women', 'marina',
   ARRAY['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800'],
   ARRAY['Brown', 'Beige'], ARRAY['S', 'M', 'L', 'XL'], 20, true),
  
  ('Embroidered 3pc Marina With Shawl', 'marina-with-shawl', 'Complete winter outfit with embroidered shawl', 5690, 'women', 'marina',
   ARRAY['https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800'],
   ARRAY['Blue', 'Navy'], ARRAY['S', 'M', 'L', 'XL'], 12, true),
  
  ('Embroidered Velvet 2pc Dress', 'velvet-2pc-dress', 'Luxurious velvet embroidered dress', 4690, 'women', 'velvet',
   ARRAY['https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800'],
   ARRAY['Wine', 'Black'], ARRAY['S', 'M', 'L', 'XL'], 8, true),
  
  ('Khaddar Embroidered Suit', 'khaddar-embroidered-suit', 'Comfortable khaddar winter suit', 3190, 'women', 'khaddar',
   ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800'],
   ARRAY['Mustard', 'Orange'], ARRAY['S', 'M', 'L', 'XL'], 18, true),
  
  ('Embroidered Chiffon Luxury Suit - Moonlit Ocean', 'moonlit-ocean-suit', 'Premium embroidered chiffon party wear', 5899, 'party', 'chiffon',
   ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'],
   ARRAY['Blue'], ARRAY['S', 'M', 'L', 'XL'], 5, true),
  
  ('Embroidered Chiffon Suit - Peach Delight', 'peach-delight-suit', 'Elegant peach party wear', 5899, 'party', 'chiffon',
   ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'],
   ARRAY['Peach'], ARRAY['S', 'M', 'L', 'XL'], 6, true),
  
  ('Silk Net Embroidered 3Pc - Ainaa', 'ainaa-silk-net', 'Luxurious silk net party suit', 5899, 'party', 'silk',
   ARRAY['https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800'],
   ARRAY['Gold', 'Silver'], ARRAY['S', 'M', 'L', 'XL'], 4, true),
  
  ('Embroidered Chiffon Suit - Magenta', 'magenta-chiffon-suit', 'Bold magenta party wear', 5899, 'party', 'chiffon',
   ARRAY['https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800'],
   ARRAY['Magenta'], ARRAY['S', 'M', 'L', 'XL'], 7, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert categories
INSERT INTO categories (id, name, description) VALUES
  ('women', 'Women', 'Women''s clothing and fashion'),
  ('men', 'Men', 'Men''s clothing and fashion'),
  ('kids', 'Kids', 'Kids clothing and fashion'),
  ('party', 'Party Wear', 'Party and formal wear'),
  ('bedding', 'Bedding', 'Bedsheets and home textiles'),
  ('shawls', 'Shawls', 'Embroidered and printed shawls')
ON CONFLICT (id) DO NOTHING;
