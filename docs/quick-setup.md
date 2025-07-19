# 🚀 Quick Supabase Setup for PROMODE

## Your Supabase Project

**URL:** https://itiuglvzzawqixspvses.supabase.co
**Dashboard:** https://supabase.com/dashboard/project/itiuglvzzawqixspvses

---

## Step 1: 🗃️ Database Setup (2 minutes)

1. **Click this link to open your SQL Editor:**
   👉 https://supabase.com/dashboard/project/itiuglvzzawqixspvses/sql

2. **Click "New Query"**

3. **Copy and paste this ENTIRE script:**

```sql
-- 🚀 PROMODE Complete Database Setup
-- This creates all tables, policies, and sample data

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can modify products" ON products FOR ALL USING (auth.role() = 'authenticated');

-- 3. Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  billing_address JSONB,
  payment_method TEXT,
  order_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can create own order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- 5. Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
('Premium Cotton T-Shirt', 'Soft, comfortable cotton t-shirt perfect for everyday wear', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 'clothing', 50),
('Designer Denim Jeans', 'Stylish slim-fit jeans with premium denim fabric', 79.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 'clothing', 30),
('Athletic Running Shoes', 'Lightweight running shoes with superior comfort and support', 99.99, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', 'footwear', 25),
('Vintage Leather Jacket', 'Classic leather jacket with timeless style', 199.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 'outerwear', 15),
('Casual Hoodie', 'Cozy pullover hoodie perfect for casual occasions', 49.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', 'clothing', 40),
('Canvas Sneakers', 'Classic canvas sneakers for everyday style', 59.99, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500', 'footwear', 35)
ON CONFLICT (id) DO NOTHING;

-- 6. Auto-create profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'), NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
```

4. **Click "Run" button**
5. **You should see "Success. No rows returned" message**

---

## Step 2: 📁 Storage Setup (3 minutes)

1. **Click this link to open Storage:**
   👉 https://supabase.com/dashboard/project/itiuglvzzawqixspvses/storage/buckets

2. **Create 4 buckets by clicking "New bucket" for each:**

### Bucket 1: `products`

- Name: `products`
- Public bucket: ✅ **YES**
- File size limit: `10485760` (10MB)
- Allowed MIME types: `image/*`

### Bucket 2: `avatars`

- Name: `avatars`
- Public bucket: ✅ **YES**
- File size limit: `5242880` (5MB)
- Allowed MIME types: `image/*`

### Bucket 3: `demo`

- Name: `demo`
- Public bucket: ✅ **YES**
- File size limit: `10485760` (10MB)
- Allowed MIME types: `*/*`

### Bucket 4: `documents`

- Name: `documents`
- Public bucket: ✅ **YES**
- File size limit: `52428800` (50MB)
- Allowed MIME types: `*/*`

---

## Step 3: 🔐 Clerk Authentication Setup (2 minutes)

### **Configure Clerk in Supabase:**

1. **Click this link to open Auth Settings:**
   👉 https://supabase.com/dashboard/project/itiuglvzzawqixspvses/auth/settings

2. **Scroll down to "Third-party Auth" section**

3. **Enable Clerk integration:**

   ```
   [auth.third_party.clerk]
   enabled = true
   domain = "grand-gull-95.clerk.accounts.dev"
   ```

4. **Click "Save"**

### **Your Clerk Configuration:**

- **Domain:** `grand-gull-95.clerk.accounts.dev`
- **Publishable Key:** `pk_test_Z3JhbmQtZ3VsbC05NS5jbGVyay5hY2NvdW50cy5kZXYk`
- **Secret Key:** `sk_test_oRcSn136iqoK2q41s0bc3EftEYIej8NU1XQ91LrkZa`

✅ **Already configured in your `.env.local` file!**

---

## Step 4: 🔧 Storage Policies (2 minutes)

For each bucket, you need to set policies. Here's the fastest way:

1. **Go to Storage → products → Policies**
2. **Click "New Policy" → "For full customization"**
3. **Paste this policy:**

```sql
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'products');
```

4. **Click "Review" → "Save policy"**

5. **Repeat for each bucket** (replace 'products' with 'avatars', 'demo', 'documents')

**OR use this shortcut - Go to SQL Editor and run:**

```sql
-- Storage policies for all buckets
CREATE POLICY "Public read products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public read demo" ON storage.objects FOR SELECT USING (bucket_id = 'demo');
CREATE POLICY "Public read documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Auth upload products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload demo" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'demo' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
```

---

## Step 5: ✅ Test Everything

1. **Restart your development server:**

   ```bash
   # In your terminal, stop the server (Ctrl+C) then:
   npm run dev
   ```

2. **Visit these pages to test:**
   - http://localhost:3000/setup-check ← **Check if everything works**
   - http://localhost:3000/demo ← **Try all features**
   - http://localhost:3000/admin ← **Analytics dashboard**

---

## 🎉 Expected Results

After completing all steps:

✅ **Setup Checker:** All checks should pass  
✅ **Authentication:** Sign up/login should work  
✅ **File Upload:** Drag & drop files should work  
✅ **Analytics:** Charts should display with sample data  
✅ **Checkout:** Enhanced checkout should work

---

## 🆘 Need Help?

If any step fails:

1. **Check the setup checker:** http://localhost:3000/setup-check
2. **Common issues:**
   - Red X on database → Re-run the SQL script
   - Red X on storage → Check bucket names are exact
   - Red X on auth → Verify redirect URLs

**Total setup time: ~8 minutes** ⏱️

---

## 🔗 Quick Links for Your Project

- **Dashboard:** https://supabase.com/dashboard/project/itiuglvzzawqixspvses
- **SQL Editor:** https://supabase.com/dashboard/project/itiuglvzzawqixspvses/sql
- **Storage:** https://supabase.com/dashboard/project/itiuglvzzawqixspvses/storage/buckets
- **Auth Settings:** https://supabase.com/dashboard/project/itiuglvzzawqixspvses/auth/settings
- **Auth Providers:** https://supabase.com/dashboard/project/itiuglvzzawqixspvses/auth/providers
