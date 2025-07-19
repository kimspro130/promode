"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import { Button } from "@/components/ui/button"
import { cn, formatPrice } from "@/lib/utils"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    images?: string[]
    category?: string
  }
  className?: string
}

// Format price in Indian Rupees
// function formatPrice(price: number): string {
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(price)
// }

export default function ProductCard({ product, className }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [isHovered, setIsHovered] = useState(false)

  const isFavorite = isInWishlist(product.id)

  // Always show the main product image (no hover switching)
  const displayImage = product.image

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isFavorite) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      })
    }
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn("group block relative touch-target", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg mb-3 md:mb-4">
        <Image
          src={displayImage || "/placeholder.svg?height=400&width=400"}
          alt={product.name}
          fill
          className={cn("object-cover transition-transform duration-300", isHovered ? "scale-110" : "scale-100")}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-opacity touch-target",
            "h-10 w-10 md:h-8 md:w-8", // Larger on mobile
            isHovered || isFavorite ? "opacity-100" : "opacity-0 md:opacity-0",
            "opacity-100 md:opacity-0 md:group-hover:opacity-100" // Always visible on mobile, hover on desktop
          )}
          onClick={toggleWishlist}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn("h-5 w-5 md:h-4 md:w-4 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-gray-600")}
          />
        </Button>
      </div>

      <div className="space-y-1">
        <h3 className="font-medium text-white text-sm md:text-base line-clamp-2">{product.name}</h3>
        <p className="text-gray-400 text-sm md:text-base font-semibold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
