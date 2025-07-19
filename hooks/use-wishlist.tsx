"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  category?: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedWishlist = localStorage.getItem("promode-wishlist")
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist)
        // Ensure it's an array
        if (Array.isArray(parsedWishlist)) {
          setItems(parsedWishlist)
        } else {
          setItems([])
        }
      } catch (error) {
        console.error("Error parsing wishlist from localStorage:", error)
        setItems([])
      }
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("promode-wishlist", JSON.stringify(items))
    }
  }, [items, isClient])

  const addToWishlist = (item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id)
      if (exists) return prev
      return [...prev, item]
    })
  }

  const removeFromWishlist = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const clearWishlist = () => {
    setItems([])
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
