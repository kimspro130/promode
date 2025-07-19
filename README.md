# 🛍️ PROMODE - Premium E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js, featuring Clerk authentication, Supabase backend, and Pesapal payment integration.

![PROMODE Platform](https://img.shields.io/badge/Platform-Next.js-black?style=for-the-badge&logo=next.js)
![Authentication](https://img.shields.io/badge/Auth-Clerk-purple?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-Supabase-green?style=for-the-badge)
![Payments](https://img.shields.io/badge/Payments-Pesapal-blue?style=for-the-badge)

## ✨ Features

### 🔐 **Authentication & User Management**
- **Clerk Integration** - Modern authentication with email/password and OAuth
- **User Profiles** - Automatic profile creation and management
- **Protected Routes** - Secure admin and user areas
- **Session Management** - Persistent sessions across devices

### 🛒 **E-commerce Functionality**
- **Product Catalog** - Dynamic product listings with categories
- **Shopping Cart** - Local storage for guests, database for users
- **Enhanced Checkout** - Mobile-optimized checkout flow
- **Order Management** - Complete order tracking and history

### 💳 **Payment Processing**
- **Pesapal Integration** - Support for M-Pesa, cards, and bank transfers
- **Multiple Payment Methods** - Cash on delivery, online payments
- **Secure Transactions** - PCI-compliant payment processing
- **Real-time Status Updates** - Automatic payment confirmations

### 📊 **Admin Dashboard**
- **Analytics Dashboard** - Sales charts and performance metrics
- **File Management** - Drag & drop file uploads to Supabase Storage
- **Order Management** - View and manage customer orders
- **Product Management** - Add, edit, and manage inventory

### 📱 **Mobile-First Design**
- **Responsive Layout** - Optimized for all screen sizes
- **Touch-Friendly** - Mobile-optimized interactions
- **Fast Loading** - Optimized performance and caching
- **PWA Ready** - Progressive web app capabilities

## 🚀 Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### **Backend & Database**
- **Supabase** - PostgreSQL database with real-time features
- **Supabase Storage** - File storage and CDN
- **Row Level Security** - Database-level security policies
- **Real-time Subscriptions** - Live data updates

### **Authentication**
- **Clerk** - Complete authentication solution
- **OAuth Providers** - Google, GitHub, and more
- **User Management** - Admin dashboard and user profiles
- **Security** - JWT tokens and secure sessions

### **Payments**
- **Pesapal** - East African payment gateway
- **M-Pesa Integration** - Mobile money payments
- **Card Processing** - Visa, Mastercard support
- **Bank Transfers** - Direct bank payments

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control
- **Vercel** - Deployment platform

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm
- Git
- Supabase account
- Clerk account
- Pesapal merchant account

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/promode.git
cd promode
```

### **2. Install Dependencies**
```bash
npm install --legacy-peer-deps
```

### **3. Environment Setup**
Create `.env.local` file:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Pesapal Configuration
PESAPAL_CONSUMER_KEY=your_pesapal_consumer_key
PESAPAL_CONSUMER_SECRET=your_pesapal_consumer_secret
PESAPAL_ENVIRONMENT=sandbox
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **4. Database Setup**
1. Create a new Supabase project
2. Run the SQL scripts in `/scripts/setup-database.sql`
3. Create storage buckets: `products`, `avatars`, `demo`, `documents`

### **5. Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 📁 Project Structure

```
promode/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── checkout/          # Checkout pages
│   ├── admin/             # Admin dashboard
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── payments/         # Payment components
│   └── ...
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client
│   ├── pesapal.ts        # Pesapal integration
│   └── ...
├── hooks/                 # Custom React hooks
├── contexts/              # React contexts
└── docs/                  # Documentation
```

## 🔧 Configuration

### **Supabase Setup**
1. Create project at [supabase.com](https://supabase.com)
2. Run database migrations
3. Configure storage buckets
4. Set up Row Level Security policies

### **Clerk Setup**
1. Create application at [clerk.com](https://clerk.com)
2. Configure OAuth providers
3. Set up webhooks for user sync
4. Customize authentication UI

### **Pesapal Setup**
1. Register at [pesapal.com](https://pesapal.com)
2. Get merchant credentials
3. Configure IPN endpoints
4. Test with sandbox environment

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

### **Environment Variables**
Set all environment variables in your deployment platform.

## 📖 Documentation

- [Quick Setup Guide](./docs/quick-setup.md)
- [Supabase Configuration](./docs/supabase-setup.md)
- [API Documentation](./docs/api.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

**Built with ❤️ using modern web technologies**
