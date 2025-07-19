"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string, size?: string) => void
  updateQuantity: (id: string, quantity: number, size?: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedCart = localStorage.getItem("promode-cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Ensure it's an array
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart)
        } else {
          setItems([])
        }
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
        setItems([])
      }
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("promode-cart", JSON.stringify(items))
    }
  }, [items, isClient])

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id && item.size === newItem.size)
      if (existingItem) {
        return prev.map((item) =>
          item.id === newItem.id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item,
        )
      }
      return [...prev, newItem]
    })
  }

  const removeItem = (id: string, size?: string) => {
    setItems((prev) => {
      if (size) {
        return prev.filter((item) => !(item.id === id && item.size === size))
      } else {
        return prev.filter((item) => item.id !== id)
      }
    })
  }

  const updateQuantity = (id: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeItem(id, size)
      return
    }
    setItems((prev) =>
      prev.map((item) => {
        if (size) {
          return item.id === id && item.size === size ? { ...item, quantity } : item
        } else {
          return item.id === id ? { ...item, quantity } : item
        }
      }),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const subtotal = getTotalPrice()

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
