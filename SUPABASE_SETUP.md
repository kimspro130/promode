# 🚀 Supabase Integration Setup Guide

This guide will help you complete the Supabase integration for your PROMODE e-commerce project.

## 📋 Prerequisites

- Supabase project created at: https://itiuglvzzawqixspvses.supabase.co
- Project API keys from Supabase dashboard

## 🔧 Step 1: Configure Environment Variables

1. Open your `.env.local` file
2. Replace the placeholder values with your actual Supabase keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://itiuglvzzawqixspvses.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

**To find your keys:**
1. Go to your Supabase dashboard
2. Navigate to Settings → API
3. Copy the "anon public" key and "service_role" key

## 🗄️ Step 2: Set Up Database Schema

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Click "Run" to execute the schema

This will create:
- ✅ Products table
- ✅ User profiles table
- ✅ Cart items table
- ✅ Wishlist items table
- ✅ Orders table
- ✅ Categories table
- ✅ Row Level Security policies
- ✅ Triggers and functions

## 📦 Step 3: Migrate Product Data

1. Ensure your environment variables are set correctly
2. Run the migration script:

```bash
npm run migrate-products
```

Or manually run:
```bash
npx ts-node scripts/migrate-products.ts
```

This will populate your database with existing product data.

## 🔄 Step 4: Update Your Application

### Option A: Gradual Migration (Recommended)
Keep your existing auth system and gradually migrate features:

1. **Test Supabase Products:**
   ```tsx
   import { useSupabaseProducts } from '@/hooks/use-supabase-products'
   
   // In your component
   const { products, isLoading, error } = useSupabaseProducts()
   ```

2. **Test Supabase Cart (for logged-in users):**
   ```tsx
   import { useSupabaseCart } from '@/hooks/use-supabase-cart'
   import { SupabaseAuthProvider } from '@/contexts/supabase-auth-context'
   
   // Wrap your app with SupabaseAuthProvider
   // Then use the cart hook
   const { items, addItem, removeItem } = useSupabaseCart()
   ```

### Option B: Full Migration
Replace your existing auth system with Supabase Auth:

1. **Update your layout.tsx:**
   ```tsx
   import { SupabaseAuthProvider } from '@/contexts/supabase-auth-context'
   
   // Wrap your app with SupabaseAuthProvider instead of AuthProvider
   ```

2. **Update components to use Supabase hooks:**
   - Replace `useProducts` with `useSupabaseProducts`
   - Replace `useCart` with `useSupabaseCart`
   - Replace `useAuth` with `useSupabaseAuth`

## 🎯 Step 5: Enable Authentication

1. **Configure Auth Providers (Optional):**
   - Go to Authentication → Providers in Supabase dashboard
   - Enable email/password authentication
   - Optionally enable Google, GitHub, etc.

2. **Set up email templates:**
   - Go to Authentication → Email Templates
   - Customize signup confirmation and password reset emails

## 🔒 Step 6: Configure Storage (Optional)

For product images and user uploads:

1. Go to Storage in Supabase dashboard
2. Create a bucket named "product-images"
3. Set up policies for public read access
4. Update your image upload logic to use Supabase Storage

## 🧪 Step 7: Test the Integration

1. **Test Authentication:**
   - Sign up a new user
   - Log in/out
   - Check if profile is created automatically

2. **Test Products:**
   - Browse products from database
   - Search functionality
   - Category filtering

3. **Test Cart & Wishlist:**
   - Add items to cart (requires login)
   - Persist across sessions
   - Real-time updates

## 🚀 Step 8: Deploy

1. **Add environment variables to your hosting platform:**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables

2. **Update production URLs:**
   - Ensure CORS is configured in Supabase for your domain
   - Update any hardcoded localhost URLs

## 📊 Features You'll Get

### ✅ Implemented
- **Real-time database** with PostgreSQL
- **User authentication** with email/password
- **Row Level Security** for data protection
- **Persistent cart & wishlist**
- **Product management**
- **User profiles**

### 🔄 Next Steps
- **Real-time subscriptions** for live updates
- **File storage** for images
- **Order management** system
- **Admin dashboard** for product management
- **Analytics** and reporting

## 🆘 Troubleshooting

### Common Issues:

1. **"Invalid API key" error:**
   - Check your environment variables
   - Ensure `.env.local` is in project root
   - Restart your development server

2. **Database connection issues:**
   - Verify your Supabase URL
   - Check if RLS policies are correctly set up
   - Ensure tables are created

3. **Authentication not working:**
   - Check if email confirmation is required
   - Verify auth providers are enabled
   - Check browser console for errors

### Getting Help:
- Check Supabase documentation: https://supabase.com/docs
- Join Supabase Discord: https://discord.supabase.com
- Review the logs in Supabase dashboard

## 🎉 You're Ready!

Your PROMODE project now has a powerful, scalable backend with Supabase! 

The integration provides:
- 🔐 Secure authentication
- 📊 Real-time database
- 🛒 Persistent shopping cart
- ❤️ Wishlist functionality
- 📱 Mobile-optimized experience
- 🚀 Production-ready infrastructure
