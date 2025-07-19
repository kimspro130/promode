"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { useProducts } from "@/hooks/use-products"

export default function Home() {
  const { featuredProducts, isLoading, error } = useProducts()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  // Category images with fallbacks - now including accessories
  const categoryImages = [
    {
      name: "Hoodies",
      slug: "hoodies",
      image: "https://i.ibb.co/xq7nnWRs/hoodiessasa.webp",
      fallbackImage: "/placeholder.svg?height=500&width=500",
    },
    {
      name: "T-Shirts",
      slug: "t-shirts",
      image: "https://i.ibb.co/wFzkd1k9/vintage-sht.webp",
      fallbackImage: "/placeholder.svg?height=500&width=500",
    },
    {
      name: "Outerwear",
      slug: "outerwear",
      image: "https://i.ibb.co/1Gk6Mz6k/hoode.webp",
      fallbackImage: "/placeholder.svg?height=500&width=500",
    },
    {
      name: "Accessories",
      slug: "accessories",
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop",
      fallbackImage: "/placeholder.svg?height=500&width=500",
    },
    {
      name: "Shoes",
      slug: "shoes",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
      fallbackImage: "/placeholder.svg?height=500&width=500",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://i.pinimg.com/originals/14/f4/35/14f435eaaf8d107cca5055ce150eaf47.gif"
            alt="Thrifted clothing collection animation"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = "/placeholder.svg?height=1080&width=1920"
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container relative z-10 px-4 md:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white leading-tight">
            Sustainable Style, Unique Finds
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 px-4">
            Discover one-of-a-kind thrifted pieces that each have a story to tell and display a sense of style
          </p>
          <Button asChild size="lg" className="rounded-full px-8 py-6 text-base md:text-lg touch-target">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* Content Sections */}
      <div className="bg-background">
        {/* Featured Products */}
        <section className="py-8 md:py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10">New Arrivals</h2>

            {error && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 mx-4">
                <p className="text-yellow-200 text-sm md:text-base">{error}</p>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-12 md:py-20">
                <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className="text-center mt-8 md:mt-10">
              <Button asChild variant="outline" className="rounded-full px-6 md:px-8 py-3 bg-transparent touch-target">
                <Link href="/shop">View All Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Shop Categories */}
        <section className="py-8 md:py-16 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10">Shop Categories</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {categoryImages.map((category) => (
                <Link
                  key={category.name}
                  href={`/shop?category=${category.slug}`}
                  className="group relative aspect-square overflow-hidden rounded-xl touch-target"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={category.image || "/placeholder.svg?height=400&width=400"}
                      alt={category.name}
                      fill
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.src = category.fallbackImage
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2">
                      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white text-center leading-tight">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Full Screen Image Section */}
        <section className="relative min-h-screen w-full flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://dripbyrage.store/cdn/shop/files/5_f884d650-9a5d-4fa0-8ef0-026fc5346baf.jpg"
              alt="Featured thrifted collection image"
              fill
              className="object-cover"
              sizes="100vw"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src = "/placeholder.svg?height=1080&width=1920"
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="container relative z-10 px-4 md:px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-white">Elevate Your Style</h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Curated vintage pieces that make a statement
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/shop">Explore Collection</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
