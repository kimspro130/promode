"use client"

import { useState, useEffect, useCallback } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import type { Database } from "@/lib/supabase"

type Order = Database['public']['Tables']['orders']['Row']
type OrderItem = Database['public']['Tables']['order_items']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']

interface OrderWithItems extends Order {
  order_items: (OrderItem & {
    product: Database['public']['Tables']['products']['Row']
  })[]
}

interface CreateOrderData {
  shipping_address: {
    full_name: string
    address_line_1: string
    address_line_2?: string
    city: string
    state: string
    postal_code: string
    country: string
    phone?: string
  }
  billing_address?: {
    full_name: string
    address_line_1: string
    address_line_2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  payment_method?: string
  customer_notes?: string
  cart_items: {
    product_id: string
    product_name: string
    product_image: string
    quantity: number
    size: string
    unit_price: number
  }[]
}

export function useSupabaseOrders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, isAuthenticated } = useSupabaseAuth()
  const supabase = createSupabaseBrowserClient()

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setOrders([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setOrders(data || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user, supabase])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const createOrder = async (orderData: CreateOrderData) => {
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Please log in to create an order' }
    }

    try {
      // Calculate totals
      const subtotal = orderData.cart_items.reduce(
        (sum, item) => sum + (item.unit_price * item.quantity), 
        0
      )
      const tax_amount = subtotal * 0.1 // 10% tax (adjust as needed)
      const shipping_amount = subtotal > 100 ? 0 : 10 // Free shipping over $100
      const total_amount = subtotal + tax_amount + shipping_amount

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          subtotal,
          tax_amount,
          shipping_amount,
          total_amount,
          shipping_address: orderData.shipping_address,
          billing_address: orderData.billing_address || orderData.shipping_address,
          payment_method: orderData.payment_method,
          customer_notes: orderData.customer_notes,
        })
        .select()
        .single()

      if (orderError) {
        throw orderError
      }

      // Create order items
      const orderItems = orderData.cart_items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        quantity: item.quantity,
        size: item.size,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        throw itemsError
      }

      // Refresh orders list
      await fetchOrders()

      return { success: true, order }
    } catch (err) {
      console.error('Error creating order:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const getOrderById = async (orderId: string): Promise<OrderWithItems | null> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products(*)
          )
        `)
        .eq('id', orderId)
        .eq('user_id', user?.id)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (err) {
      console.error('Error fetching order:', err)
      return null
    }
  }

  const updateOrderStatus = async (orderId: string, status: string, notes?: string) => {
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Please log in to update order' }
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          admin_notes: notes,
          ...(status === 'shipped' && { shipped_at: new Date().toISOString() }),
          ...(status === 'delivered' && { delivered_at: new Date().toISOString() })
        })
        .eq('id', orderId)
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      await fetchOrders()
      return { success: true }
    } catch (err) {
      console.error('Error updating order status:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order'
      return { success: false, error: errorMessage }
    }
  }

  const cancelOrder = async (orderId: string, reason?: string) => {
    return updateOrderStatus(orderId, 'cancelled', reason)
  }

  const getOrderStatusHistory = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_status_history')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (err) {
      console.error('Error fetching order status history:', err)
      return []
    }
  }

  return {
    orders,
    isLoading,
    error,
    createOrder,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getOrderStatusHistory,
    fetchOrders,
  }
}
