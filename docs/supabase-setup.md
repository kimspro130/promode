# 🚀 Complete Supabase Setup Guide

## 1. 🗄️ Storage Buckets Setup

### Step 1: Create Storage Buckets

Go to your Supabase Dashboard → Storage → Create Bucket

Create these buckets:

#### **products** bucket
```sql
-- Bucket for product images
-- Public: true
-- File size limit: 10MB
-- Allowed MIME types: image/*
```

#### **avatars** bucket
```sql
-- Bucket for user profile pictures
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/*
```

#### **demo** bucket
```sql
-- Bucket for demo uploads
-- Public: true
-- File size limit: 10MB
-- Allowed MIME types: */*
```

#### **documents** bucket
```sql
-- Bucket for general file uploads
-- Public: true
-- File size limit: 50MB
-- Allowed MIME types: */*
```

### Step 2: Set Bucket Policies

For each bucket, go to Storage → [bucket-name] → Policies

#### **Public Read Policy** (for all buckets):
```sql
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'bucket-name');
```

#### **Authenticated Upload Policy**:
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'bucket-name' AND 
  auth.role() = 'authenticated'
);
```

#### **Users can delete their own files**:
```sql
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'bucket-name' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## 2. 🔐 Authentication Setup

### Step 1: Enable Auth Providers

Go to Authentication → Providers

#### **Email Provider**:
- ✅ Enable email provider
- ✅ Enable email confirmations
- Set site URL: `http://localhost:3000`
- Set redirect URLs: `http://localhost:3000/auth/callback`

#### **Google Provider**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://[your-project].supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

### Step 2: Configure Auth Settings

Go to Authentication → Settings

```json
{
  "site_url": "http://localhost:3000",
  "redirect_urls": [
    "http://localhost:3000/auth/callback",
    "https://your-domain.com/auth/callback"
  ],
  "jwt_expiry": 3600,
  "refresh_token_rotation_enabled": true,
  "security_update_password_require_reauthentication": true
}
```

## 3. 🗃️ Database Schema Setup

### Step 1: Create Profiles Table

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Step 2: Create Orders Table (if not exists)

```sql
-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  billing_address JSONB,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );
```

### Step 3: Create Products Table (if not exists)

```sql
-- Create products table
CREATE TABLE products (
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

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

-- Only authenticated users can modify (admin check can be added)
CREATE POLICY "Authenticated users can modify products" ON products
  FOR ALL USING (auth.role() = 'authenticated');
```

## 4. 🔧 Environment Variables

Update your `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. 🧪 Testing the Setup

### Test Authentication:
1. Visit `/demo`
2. Click "Try Authentication"
3. Test email signup/login
4. Test Google OAuth

### Test File Upload:
1. Visit `/demo` or `/admin`
2. Try uploading images to different buckets
3. Verify files appear in Supabase Storage

### Test Analytics:
1. Create some test orders in the database
2. Visit `/admin`
3. Check analytics dashboard

## 6. 🚀 Production Deployment

### Update Environment Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Update Auth Settings:
- Add production domain to redirect URLs
- Update site URL to production domain
- Configure custom SMTP for emails (optional)

### Security Checklist:
- ✅ RLS enabled on all tables
- ✅ Proper bucket policies
- ✅ Environment variables secured
- ✅ HTTPS enabled in production
- ✅ CORS configured properly

## 7. 📊 Sample Data for Testing

### Insert Sample Products:
```sql
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
('Premium T-Shirt', 'High-quality cotton t-shirt', 29.99, 'https://example.com/tshirt.jpg', 'clothing', 50),
('Designer Jeans', 'Stylish denim jeans', 79.99, 'https://example.com/jeans.jpg', 'clothing', 30),
('Sneakers', 'Comfortable running shoes', 99.99, 'https://example.com/shoes.jpg', 'footwear', 25);
```

### Insert Sample Orders (for analytics):
```sql
INSERT INTO orders (user_id, total_amount, status, created_at) VALUES
(auth.uid(), 129.98, 'completed', NOW() - INTERVAL '1 day'),
(auth.uid(), 79.99, 'completed', NOW() - INTERVAL '2 days'),
(auth.uid(), 199.97, 'pending', NOW() - INTERVAL '3 days');
```

## 8. 🔍 Troubleshooting

### Common Issues:

#### **Storage Upload Fails:**
- Check bucket exists and is public
- Verify upload policies are set
- Check file size limits
- Ensure user is authenticated

#### **Auth Redirect Issues:**
- Verify redirect URLs in Supabase settings
- Check environment variables
- Ensure callback page exists

#### **Analytics Not Loading:**
- Check if orders table exists
- Verify RLS policies allow reading
- Check console for errors
- Ensure Recharts is installed

#### **Google OAuth Not Working:**
- Verify Google Cloud Console setup
- Check redirect URI matches exactly
- Ensure OAuth consent screen is configured
- Verify client ID/secret in Supabase

## 9. 📚 Useful Supabase Commands

### Storage Operations:
```javascript
// Upload file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('path/filename.jpg', file)

// Get public URL
const { data } = supabase.storage
  .from('bucket-name')
  .getPublicUrl('path/filename.jpg')

// Delete file
const { error } = await supabase.storage
  .from('bucket-name')
  .remove(['path/filename.jpg'])
```

### Auth Operations:
```javascript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: { data: { full_name: 'John Doe' } }
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Google OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: 'http://localhost:3000/auth/callback' }
})
```

### Database Operations:
```javascript
// Insert data
const { data, error } = await supabase
  .from('table_name')
  .insert([{ column: 'value' }])

// Query data
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', 'value')

// Real-time subscription
const subscription = supabase
  .channel('table_changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'table_name' },
    (payload) => console.log('Change received!', payload)
  )
  .subscribe()
```

---

🎉 **Your PROMODE platform is now fully configured with enterprise-grade features!**
