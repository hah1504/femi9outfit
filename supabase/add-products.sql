-- ============================================
-- Add More Products - Paste in Supabase SQL Editor
-- ============================================

-- Lawn Collection (Summer)
INSERT INTO products (name, slug, description, price, category_id, subcategory, images, colors, sizes, stock, featured) VALUES

('Grace S249 - Embroidered 2pc Lawn Dress', 'grace-s249-lawn-dress',
 'Beautiful embroidered 2pc lawn dress. Unstitched fabric (5.25 meters). Perfect for summer season.',
 2399, 'women', 'lawn',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/DSC00039-768x1179-2_b1da3305-72bb-4419-99cf-1d337a300b13.jpg'],
 ARRAY['Green', 'White'], ARRAY['S', 'M', 'L', 'XL'], 20, true),

('Grace S533 - Embroidered 2pc Lawn Dress', 'grace-s533-lawn-dress',
 'Premium embroidered 2pc lawn dress. Unstitched fabric (5.25 meters). Elegant summer wear.',
 2999, 'women', 'lawn',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/Asim_Jofa_Essential_Eid_Edition_2023_AJPE-17_1_1800x1800_f3772e2f-73ed-40c6-b4e8-bbe45840df79.webp'],
 ARRAY['Pink', 'Peach'], ARRAY['S', 'M', 'L', 'XL'], 15, true),

('Grace S691 - Embroidered 2pc Lawn Dress', 'grace-s691-lawn-dress',
 'Elegant embroidered 2pc lawn dress. Unstitched (5.25 meters). Summer essential.',
 2799, 'women', 'lawn',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/l1.jpg'],
 ARRAY['Blue', 'White'], ARRAY['S', 'M', 'L', 'XL'], 18, true),

('Grace S733 - Embroidered 2pc Lawn Dress', 'grace-s733-lawn-dress',
 'Premium embroidered 2pc lawn dress with intricate design. Unstitched (5.25 meters).',
 3299, 'women', 'lawn',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/AD62A2DC-5D61-4462-987C-5F691F8A99DB.webp'],
 ARRAY['Purple', 'Lavender'], ARRAY['S', 'M', 'L', 'XL'], 12, false),

('Grace S248 - Embroidered 2pc Lawn Dress', 'grace-s248-lawn-dress',
 'Elegant embroidered 2pc lawn dress. Unstitched (5.25 meters). Summer collection.',
 2499, 'women', 'lawn',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/DSC02074-768x1153-4_190ec076-c27b-4120-930f-e727161e1836.jpg'],
 ARRAY['Yellow', 'Cream'], ARRAY['S', 'M', 'L', 'XL'], 22, false),

('Grace S692 - Embroidered 2pc Lawn Dress', 'grace-s692-lawn-dress',
 'Premium embroidered 2pc lawn dress. Unstitched (5.25 meters). Stylish summer wear.',
 2499, 'women', 'lawn',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/l1.jpg'],
 ARRAY['Mint', 'Green'], ARRAY['S', 'M', 'L', 'XL'], 16, false),

('Grace S992 - Embroidered 2pc Lawn Dress', 'grace-s992-lawn-dress',
 'Luxurious embroidered 2pc lawn dress. Unstitched (5.25 meters). New arrival.',
 3299, 'women', 'lawn',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/AD62A2DC-5D61-4462-987C-5F691F8A99DB.webp'],
 ARRAY['Red', 'Maroon'], ARRAY['S', 'M', 'L', 'XL'], 10, true),

('Grace S70 - Embroidered 3pc Lawn With Chiffon Dupatta', 'grace-s70-lawn-3pc',
 'Embroidered 3pc lawn dress with chiffon dupatta. Unstitched (7.35 meters). Premium collection.',
 4090, 'women', 'lawn',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/DSC00039-768x1179-2_b1da3305-72bb-4419-99cf-1d337a300b13.jpg'],
 ARRAY['Teal', 'Sea Green'], ARRAY['S', 'M', 'L', 'XL'], 8, false),

('Grace S665 - Embroidered 3pc Lawn With Chiffon Dupatta', 'grace-s665-lawn-3pc',
 'Premium embroidered 3pc lawn with embroidered chiffon dupatta. Unstitched (7.5 meters).',
 4599, 'women', 'lawn',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/DSC02074-768x1153-4_190ec076-c27b-4120-930f-e727161e1836.jpg'],
 ARRAY['Gold', 'Beige'], ARRAY['S', 'M', 'L', 'XL'], 6, false),

('Grace S638 - Embroidered 3pc Lawn With Munar Dupatta', 'grace-s638-lawn-3pc',
 'Elegant 3pc lawn with printed munar dupatta. Unstitched (7.35 meters). Summer luxury.',
 4399, 'women', 'lawn',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/Asim_Jofa_Essential_Eid_Edition_2023_AJPE-17_1_1800x1800_f3772e2f-73ed-40c6-b4e8-bbe45840df79.webp'],
 ARRAY['Orange', 'Rust'], ARRAY['S', 'M', 'L', 'XL'], 7, false),

('Grace S416 - Embroidered 2pc Lawn Dress', 'grace-s416-lawn-dress',
 'Stylish embroidered 2pc lawn dress. Unstitched (5.25 meters).',
 3299, 'women', 'lawn',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/DSC00039-768x1179-2_b1da3305-72bb-4419-99cf-1d337a300b13.jpg'],
 ARRAY['Navy', 'Blue'], ARRAY['S', 'M', 'L', 'XL'], 14, false),

('Grace S592 - Embroidered 2pc Lawn Dress', 'grace-s592-lawn-dress',
 'Elegant embroidered 2pc lawn dress. Unstitched (5.25 meters). Must have summer outfit.',
 2499, 'women', 'lawn',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/l1.jpg'],
 ARRAY['Pink', 'Rose'], ARRAY['S', 'M', 'L', 'XL'], 19, false)

ON CONFLICT (slug) DO NOTHING;

-- Marina Collection (Winter)
INSERT INTO products (name, slug, description, price, category_id, subcategory, images, colors, sizes, stock, featured) VALUES

('Grace W173 - Embroidered 2pc Marina Dress', 'grace-w173-marina-dress',
 'Premium embroidered 2pc marina dress. Unstitched (5.25 meters). Winter essential.',
 2899, 'women', 'marina',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/56454YYTR.jpg'],
 ARRAY['Maroon', 'Brown'], ARRAY['S', 'M', 'L', 'XL'], 15, true),

('Grace W444 - Embroidered 2pc Marina Dress', 'grace-w444-marina-dress',
 'Elegant embroidered 2pc marina dress. Unstitched (5.25 meters). Warm winter wear.',
 2899, 'women', 'marina',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/56454YYTR.jpg'],
 ARRAY['Black', 'Grey'], ARRAY['S', 'M', 'L', 'XL'], 12, true),

('Grace W161 - Embroidered 2pc Marina Dress', 'grace-w161-marina-dress',
 'Beautiful embroidered 2pc marina dress. Unstitched (5.25 meters). Classic winter design.',
 2899, 'women', 'marina',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/56454YYTR.jpg'],
 ARRAY['Green', 'Olive'], ARRAY['S', 'M', 'L', 'XL'], 10, false),

('Grace W473 - Embroidered 2pc Marina Dress', 'grace-w473-marina-dress',
 'Embroidered 2pc marina dress in blackish blue. Unstitched (5.25 meters).',
 3190, 'women', 'marina',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/56454YYTR.jpg'],
 ARRAY['Navy', 'Blue'], ARRAY['S', 'M', 'L', 'XL'], 14, false),

('Grace W217 - Embroidered 2pc Marina Dress', 'grace-w217-marina-dress',
 'Embroidered 2pc marina dress. Unstitched (5.3 meters). Affordable winter collection.',
 2590, 'women', 'marina',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/56454YYTR.jpg'],
 ARRAY['Rust', 'Orange'], ARRAY['S', 'M', 'L', 'XL'], 20, false),

('Grace W709 - Embroidered 3pc Marina With Shawl', 'grace-w709-marina-3pc',
 'Embroidered 3pc marina dress with printed polyester shawl. Unstitched (7.4 meters). Premium winter outfit.',
 4699, 'women', 'marina',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/56454YYTR.jpg'],
 ARRAY['Purple', 'Plum'], ARRAY['S', 'M', 'L', 'XL'], 8, true),

('Grace W770 - Embroidered 2pc Marina Dress', 'grace-w770-marina-dress',
 'Premium embroidered 2pc marina dress. Unstitched (5.3 meters). New arrival.',
 3190, 'women', 'marina',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/56454YYTR.jpg'],
 ARRAY['Teal', 'Emerald'], ARRAY['S', 'M', 'L', 'XL'], 11, false),

('Grace W471 - Embroidered 2pc Marina Dress', 'grace-w471-marina-dress',
 'Elegant embroidered 2pc marina dress. Unstitched (5.25 meters). Winter favorite.',
 3199, 'women', 'marina',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/56454YYTR.jpg'],
 ARRAY['Beige', 'Cream'], ARRAY['S', 'M', 'L', 'XL'], 16, false),

('Grace W757 - Embroidered 3pc Marina With Shawl', 'grace-w757-marina-3pc',
 'Embroidered 3pc marina dress with embroidered marina shawl. Unstitched (7.4 meters). Luxury winter.',
 4690, 'women', 'marina',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/56454YYTR.jpg'],
 ARRAY['Wine', 'Burgundy'], ARRAY['S', 'M', 'L', 'XL'], 6, false),

('Grace W883 - Embroidered 2pc Marina Dress', 'grace-w883-marina-dress',
 'Embroidered 2pc marina dress. Unstitched (5.3 meters). New winter arrival.',
 2999, 'women', 'marina',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/56454YYTR.jpg'],
 ARRAY['Pink', 'Rose'], ARRAY['S', 'M', 'L', 'XL'], 13, true),

('Grace W752 - Embroidered 3pc Marina With Shawl', 'grace-w752-marina-3pc',
 'Embroidered 3pc marina dress with printed polyester shawl. Unstitched (7.4 meters).',
 4499, 'women', 'marina',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/56454YYTR.jpg'],
 ARRAY['Black', 'Charcoal'], ARRAY['S', 'M', 'L', 'XL'], 9, false),

('Grace W775 - Embroidered 3pc Marina With Shawl', 'grace-w775-marina-3pc',
 'Premium embroidered 3pc marina dress with embroidered marina shawl. Unstitched (7.4 meters).',
 5690, 'women', 'marina',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/56454YYTR.jpg'],
 ARRAY['Gold', 'Bronze'], ARRAY['S', 'M', 'L', 'XL'], 5, false)

ON CONFLICT (slug) DO NOTHING;

-- Khaddar Collection (Winter)
INSERT INTO products (name, slug, description, price, category_id, subcategory, images, colors, sizes, stock, featured) VALUES

('Grace W102 - Embroidered 3pc Khaddar With Shawl', 'grace-w102-khaddar-3pc',
 'Embroidered 3pc khaddar dress with printed shawl. Unstitched (7.5 meters). Warm winter wear.',
 3499, 'women', 'khaddar',
 ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800'],
 ARRAY['Mustard', 'Brown'], ARRAY['S', 'M', 'L', 'XL'], 14, true)

ON CONFLICT (slug) DO NOTHING;

-- Bedsheet Collection
INSERT INTO products (name, slug, description, price, category_id, subcategory, images, colors, sizes, stock, featured) VALUES

('FL560 - Cotton PC King Size Bedsheet Set', 'fl560-bedsheet-set',
 'Premium PC Cotton bedsheet set. King size (235x250cm). Includes 2 pillow covers.',
 1599, 'bedding', 'bedsheet',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/FL560.png'],
 ARRAY['Multi'], ARRAY['King Size'], 25, true),

('Grace D467 - Cotton PC King Size Bedsheet', 'grace-d467-bedsheet',
 'Cotton PC king size bedsheet with 2 pillow covers. Premium quality fabric.',
 1699, 'bedding', 'bedsheet',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/products/image_b8942418-1912-4927-938a-37d56d58b3d3.jpg'],
 ARRAY['Blue', 'White'], ARRAY['King Size', 'Single'], 20, false),

('FL721 - Polyester Cotton King Size Bedsheet Set', 'fl721-bedsheet-set',
 'Polyester cotton bedsheet set. King size. Comes with 2 pillow covers.',
 1999, 'bedding', 'bedsheet',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/FL560.png'],
 ARRAY['Floral', 'Multi'], ARRAY['King Size'], 18, false),

('FL718 - Cotton PC King Size Bedsheet Set', 'fl718-bedsheet-set',
 'PC Cotton bedsheet set. King size. Includes 2 matching pillow covers.',
 1599, 'bedding', 'bedsheet',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/FL560.png'],
 ARRAY['Grey', 'Silver'], ARRAY['King Size'], 22, false),

('FL719 - Cotton PC King Size Bedsheet Set', 'fl719-bedsheet-set',
 'Premium PC Cotton bedsheet set. King size. With 2 pillow covers.',
 1599, 'bedding', 'bedsheet',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/FL560.png'],
 ARRAY['Pink', 'Rose'], ARRAY['King Size'], 15, false),

('FL602 - Polyester Cotton King Size Bedsheet Set', 'fl602-bedsheet-set',
 'Luxury polyester cotton bedsheet set. King size. With 2 pillow covers.',
 2099, 'bedding', 'bedsheet',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/FL560.png'],
 ARRAY['Beige', 'Cream'], ARRAY['King Size'], 12, false),

('FL720 - Cotton PC King Size Bedsheet Set', 'fl720-bedsheet-set',
 'Quality PC Cotton bedsheet set. King size. Includes 2 matching pillow covers.',
 1599, 'bedding', 'bedsheet',
 ARRAY['https://cdn.shopify.com/s/files/1/1464/0726/files/FL560.png'],
 ARRAY['Green', 'White'], ARRAY['King Size'], 17, false)

ON CONFLICT (slug) DO NOTHING;

-- Shawl Collection
INSERT INTO products (name, slug, description, price, category_id, subcategory, images, colors, sizes, stock, featured) VALUES

('Sarinnah Premium D85 - Velvet Embroidered Shawl', 'sarinnah-d85-velvet-shawl',
 'Fully embroidered velvet micro shawl. Premium quality (2.2 meters). Luxury winter accessory.',
 5990, 'shawls', 'velvet',
 ARRAY['https://images.unsplash.com/photo-1601244005535-a48d58db0b43?w=800'],
 ARRAY['Maroon', 'Black', 'Navy'], ARRAY['Free Size'], 8, true)

ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- DONE! 33 new products added.
-- ============================================
