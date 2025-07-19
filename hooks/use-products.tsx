"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/types"
import { fallbackProducts } from "@/lib/product-data"

// Convert API product to our Product format
function mapApiProductToProduct(apiProduct: any): Product {
  if (!apiProduct) {
    console.error("Received undefined or null apiProduct")
    return {
      id: "fallback-1",
      name: "Product Unavailable",
      price: 0,
      description: "This product information is currently unavailable.",
      sizes: ["One Size"],
      image: "/placeholder.svg",
      category: "Uncategorized",
    }
  }

  try {
    // Extract sizes from options (assuming first option is size)
    const sizes = apiProduct.options?.find(
      (option: any) => option?.name?.toLowerCase() === "size" || option?.name?.toLowerCase() === "sizes",
    )?.values || ["One Size"]

    // Get main image URL
    const mainImage =
      apiProduct.image?.src ||
      (apiProduct.images && apiProduct.images.length > 0 ? apiProduct.images[0]?.src : null) ||
      "/placeholder.svg"

    // Get all image URLs
    const images = apiProduct.images?.map((img: any) => img.src) || [mainImage]

    // Get price from first variant
    const price = Number.parseFloat(apiProduct.variants?.[0]?.price || "0")

    // Extract category from product_type
    const category = apiProduct.product_type || "Uncategorized"

    // Clean up HTML from description
    const description = apiProduct.body_html ? stripHtmlTags(apiProduct.body_html) : ""

    return {
      id: apiProduct.id?.toString() || "unknown-id",
      name: apiProduct.title || "Unnamed Product",
      price: isNaN(price) ? 0 : price,
      description: description.substring(0, 200) + (description.length > 200 ? "..." : ""),
      details: description,
      sizes,
      image: mainImage,
      images: images.length > 0 ? images : [mainImage],
      category,
    }
  } catch (error) {
    console.error("Error mapping API product:", error, "Product data:", apiProduct)
    return {
      id: apiProduct.id?.toString() || "error-id",
      name: apiProduct.title || "Error Loading Product",
      price: 0,
      description: "There was an error processing this product's information.",
      sizes: ["One Size"],
      image: "/placeholder.svg",
      category: "Uncategorized",
    }
  }
}

// Helper function to strip HTML tags
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>?/gm, "")
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true)

        // Try to fetch from API first
        try {
          const response = await fetch("/api/products")
          if (response.ok) {
            const apiProducts = await response.json()
            if (apiProducts && apiProducts.length > 0) {
              const mappedProducts = apiProducts.map(mapApiProductToProduct)
              setProducts(mappedProducts)
              setFeaturedProducts(mappedProducts.slice(0, 8)) // Show 8 featured products including accessories
              setError(null)
              return
            }
          }
        } catch (apiError) {
          console.log("API fetch failed, using fallback products")
        }

        // Use fallback products if API fails
        setProducts(fallbackProducts)
        setFeaturedProducts(fallbackProducts.slice(0, 8)) // Show 8 featured products including accessories
        setError(null)
      } catch (err: any) {
        console.error("Error fetching products:", err)
        setError("Failed to load products")
        setProducts(fallbackProducts)
        setFeaturedProducts(fallbackProducts.slice(0, 8))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, featuredProducts, isLoading, error }
}
