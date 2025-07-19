"use client"

import { useWishlist } from "@/hooks/use-wishlist"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useState, useEffect } from "react"
import { formatPrice } from "@/lib/utils"

export default function WishlistPage() {
  const { items: wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAddToCart = (item: any) => {
    setAddingToCart(item.id)

    // Add to cart with default size "M" and quantity 1
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      size: "M", // Default size
      quantity: 1,
    })

    setTimeout(() => {
      setAddingToCart(null)
      removeFromWishlist(item.id)
    }, 1000)
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="container max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    )
  }

  // Ensure wishlistItems is always an array
  const safeWishlistItems = Array.isArray(wishlistItems) ? wishlistItems : []

  if (safeWishlistItems.length === 0) {
    return (
      <div className="container max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
        <div className="bg-secondary/50 rounded-lg p-8 mb-8">
          <p className="text-lg mb-6">Your wishlist is empty</p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Wishlist</h1>
        <Button variant="outline" size="sm" onClick={clearWishlist}>
          Clear All
        </Button>
      </div>

      <div className="grid gap-6">
        {safeWishlistItems.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 bg-secondary/50 rounded-lg">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={item.image || "/placeholder.svg?height=96&width=96"}
                alt={item.name}
                fill
                className="object-cover rounded-md"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{item.name}</h3>
              <p className="text-sm font-medium">{formatPrice(item.price)}</p>
              {item.category && <p className="text-sm text-muted-foreground">Category: {item.category}</p>}

              <div className="flex items-center gap-4 mt-2">
                <Button
                  variant="default"
                  size="sm"
                  className="h-8"
                  onClick={() => handleAddToCart(item)}
                  disabled={addingToCart === item.id}
                >
                  {addingToCart === item.id ? "Adding..." : "Add to Cart"}
                </Button>

                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => removeFromWishlist(item.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
