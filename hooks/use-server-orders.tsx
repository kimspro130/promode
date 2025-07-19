"use client"

import { useState, useEffect, useCallback } from "react"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { 
  submitOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus, 
  cancelOrder,
  type OrderData 
} from "@/lib/actions/orders"

interface Order {
  id: string
  order_number: string
  user_id: string
  total_amount: number
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  status: string
  payment_status: string
  payment_method?: string
  shipping_address: any
  billing_address?: any
  customer_notes?: string
  admin_notes?: string
  tracking_number?: string
  shipped_at?: string
  delivered_at?: string
  created_at: string
  updated_at: string
  order_items: any[]
}

export function useServerOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, isAuthenticated } = useSupabaseAuth()

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setOrders([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const result = await getUserOrders(user.id)
      
      if (result.success) {
        setOrders(result.orders)
      } else {
        setError(result.error || 'Failed to fetch orders')
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const createOrder = async (orderData: Omit<OrderData, 'user_id'>) => {
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Please log in to create an order' }
    }

    try {
      const result = await submitOrder({
        ...orderData,
        user_id: user.id
      })

      if (result.success) {
        // Refresh orders list
        await fetchOrders()
      }

      return result
    } catch (err) {
      console.error('Error creating order:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create order' 
      }
    }
  }

  const getOrder = async (orderId: string): Promise<Order | null> => {
    if (!isAuthenticated || !user) {
      return null
    }

    try {
      const result = await getOrderById(orderId, user.id)
      
      if (result.success) {
        return result.order
      } else {
        setError(result.error || 'Failed to fetch order')
        return null
      }
    } catch (err) {
      console.error('Error fetching order:', err)
      setError('Failed to fetch order')
      return null
    }
  }

  const updateStatus = async (orderId: string, status: string, notes?: string) => {
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Please log in to update order' }
    }

    try {
      const result = await updateOrderStatus(orderId, user.id, status, notes)
      
      if (result.success) {
        // Refresh orders list
        await fetchOrders()
      }

      return result
    } catch (err) {
      console.error('Error updating order status:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update order status' 
      }
    }
  }

  const cancelOrderById = async (orderId: string, reason?: string) => {
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Please log in to cancel order' }
    }

    try {
      const result = await cancelOrder(orderId, user.id, reason)
      
      if (result.success) {
        // Refresh orders list
        await fetchOrders()
      }

      return result
    } catch (err) {
      console.error('Error cancelling order:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to cancel order' 
      }
    }
  }

  return {
    orders,
    isLoading,
    error,
    createOrder,
    getOrder,
    updateStatus,
    cancelOrderById,
    fetchOrders,
  }
}
