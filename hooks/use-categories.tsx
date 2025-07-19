"use client"

import { useState, useEffect } from "react"

export interface Category {
  id: string
  name: string
  slug: string
  image?: string
}

const defaultCategories: Category[] = [
  {
    id: "1",
    name: "Hoodies",
    slug: "hoodies",
    image: "https://i.ibb.co/xq7nnWRs/hoodiessasa.webp",
  },
  {
    id: "2",
    name: "T-Shirts",
    slug: "t-shirts",
    image: "https://i.ibb.co/wFzkd1k9/vintage-sht.webp",
  },
  {
    id: "3",
    name: "Outerwear",
    slug: "outerwear",
    image: "https://i.ibb.co/1Gk6Mz6k/hoode.webp",
  },
  {
    id: "4",
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Shoes",
    slug: "shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
  },
]

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true)

        // For now, we'll use default categories
        // In a real app, you might fetch from an API
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

        setCategories(defaultCategories)
        setError(null)
      } catch (err: any) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories")
        setCategories(defaultCategories) // Fallback to default
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, isLoading, error }
}
