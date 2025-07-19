"use client"

import { useState, useEffect } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

type Product = Database['public']['Tables']['products']['Row']

export function useSupabaseProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setProducts(data || [])
      // Set first 8 products as featured
      setFeaturedProducts((data || []).slice(0, 8))
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (err) {
      console.error('Error fetching product:', err)
      return null
    }
  }

  const getProductsByCategory = async (category: string): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (err) {
      console.error('Error fetching products by category:', err)
      return []
    }
  }

  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (err) {
      console.error('Error searching products:', err)
      return []
    }
  }

  return {
    products,
    featuredProducts,
    isLoading,
    error,
    fetchProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
  }
}
