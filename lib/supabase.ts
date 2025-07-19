import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Browser client for SSR
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Database types (we'll expand this as we create tables)
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          sizes: string[];
          images: string[];
          image: string;
          details?: string;
          stock_quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          category: string;
          sizes: string[];
          images: string[];
          image: string;
          details?: string;
          stock_quantity: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          sizes?: string[];
          images?: string[];
          image?: string;
          details?: string;
          stock_quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name?: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          size: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity: number;
          size: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          size?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          total_amount: number;
          subtotal: number;
          tax_amount: number;
          shipping_amount: number;
          discount_amount: number;
          status:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          payment_status:
            | "pending"
            | "paid"
            | "failed"
            | "refunded"
            | "partially_refunded";
          payment_method?: string;
          payment_reference?: string;
          shipping_address: any;
          billing_address?: any;
          customer_notes?: string;
          admin_notes?: string;
          tracking_number?: string;
          shipped_at?: string;
          delivered_at?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number?: string;
          total_amount: number;
          subtotal: number;
          tax_amount?: number;
          shipping_amount?: number;
          discount_amount?: number;
          status?:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          payment_status?:
            | "pending"
            | "paid"
            | "failed"
            | "refunded"
            | "partially_refunded";
          payment_method?: string;
          payment_reference?: string;
          shipping_address: any;
          billing_address?: any;
          customer_notes?: string;
          admin_notes?: string;
          tracking_number?: string;
          shipped_at?: string;
          delivered_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_number?: string;
          total_amount?: number;
          subtotal?: number;
          tax_amount?: number;
          shipping_amount?: number;
          discount_amount?: number;
          status?:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          payment_status?:
            | "pending"
            | "paid"
            | "failed"
            | "refunded"
            | "partially_refunded";
          payment_method?: string;
          payment_reference?: string;
          shipping_address?: any;
          billing_address?: any;
          customer_notes?: string;
          admin_notes?: string;
          tracking_number?: string;
          shipped_at?: string;
          delivered_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_image: string;
          quantity: number;
          size: string;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_image: string;
          quantity: number;
          size: string;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          product_image?: string;
          quantity?: number;
          size?: string;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          notes?: string;
          changed_by?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: string;
          notes?: string;
          changed_by?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          status?: string;
          notes?: string;
          changed_by?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
