"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingBag, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { fallbackProducts } from "@/lib/product-data"
import { ClimbingBoxLoader } from "react-spinners"
import { formatPrice } from "@/lib/utils"
import { trackEvent } from "@/components/google-analytics"
// import { useSwipeRef } from "@/hooks/use-swipe"

// Convert API product to our Product format
function mapApiProductToProduct(apiProduct: any) {
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

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { addItem } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()

  const [product, setProduct] = useState(fallbackProducts.find((p) => p.id === params.id))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // This ensures hydration issues are avoided
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/products/${params.id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`)
        }

        // Check if response is empty
        const text = await response.text()
        if (!text || text.trim() === "") {
          throw new Error("Empty response received from API")
        }

        // Parse JSON safely
        let apiProduct
        try {
          apiProduct = JSON.parse(text)
        } catch (parseError) {
          console.error("JSON parse error:", parseError, "Response text:", text)
          throw new Error("Invalid JSON response from API")
        }

        // Map API product to our app's format
        const mappedProduct = mapApiProductToProduct(apiProduct)
        setProduct(mappedProduct)

        // Track product view in Google Analytics
        if (mappedProduct) {
          trackEvent("view_item", "ecommerce", mappedProduct.name, mappedProduct.price)
        }

        // Set default size if available
        if (mappedProduct.sizes.length > 0) {
          setSelectedSize(mappedProduct.sizes[0])
        }

        setError(null)
      } catch (err: any) {
        console.error("Error fetching product:", err)
        setError(`Failed to load product details: ${err.message}. Using fallback data.`)

        // Use fallback data if API fails
        const fallbackProduct = fallbackProducts.find((p) => p.id === params.id)
        if (fallbackProduct) {
          setProduct(fallbackProduct)

          // Track fallback product view
          trackEvent("view_item", "ecommerce", fallbackProduct.name, fallbackProduct.price)

          if (fallbackProduct.sizes.length > 0) {
            setSelectedSize(fallbackProduct.sizes[0])
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  if (!isClient) {
    return null
  }

  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center items-center min-h-[60vh]">
        <ClimbingBoxLoader color="#ffffff" speedMultiplier={2} />
      </div>
    )
  }

  if (!product) {
    return <div className="container py-16 text-center">Product not found</div>
  }

  const isFavorite = isInWishlist(product.id)

  const toggleWishlist = () => {
    if (isFavorite) {
      removeFromWishlist(product.id)
      trackEvent("remove_from_wishlist", "ecommerce", product.name, product.price)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      })
      trackEvent("add_to_wishlist", "ecommerce", product.name, product.price)
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    setIsAdding(true)

    // Track add to cart event
    trackEvent("add_to_cart", "ecommerce", product.name, product.price * quantity)

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: quantity,
    })

    setTimeout(() => {
      setIsAdding(false)
      router.push("/cart")
    }, 1000)
  }

  // Add swipe functionality for image navigation (temporarily disabled)
  // const imageSwipeRef = useSwipeRef<HTMLDivElement>({
  //   onSwipeLeft: () => {
  //     if (product?.images && product.images.length > 1) {
  //       setSelectedImage((prev) => (prev + 1) % product.images!.length)
  //     }
  //   },
  //   onSwipeRight: () => {
  //     if (product?.images && product.images.length > 1) {
  //       setSelectedImage((prev) => (prev - 1 + product.images!.length) % product.images!.length)
  //     }
  //   },
  //   threshold: 50
  // })

  const nextImage = () => {
    if (product?.images && product.images.length > 1) {
      setSelectedImage((prev) => (prev + 1) % product.images!.length)
    }
  }

  const prevImage = () => {
    if (product?.images && product.images.length > 1) {
      setSelectedImage((prev) => (prev - 1 + product.images!.length) % product.images!.length)
    }
  }

  return (
    <div className="container py-8 md:py-16 px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Product Details</h1>

      {error && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 mx-4 md:mx-0">
          <p className="text-yellow-200 text-sm md:text-base">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        <div className="space-y-3 md:space-y-4">
          <div
            className="relative aspect-square overflow-hidden rounded-lg group"
          >
            <Image
              src={product.images && product.images.length > 0 ? product.images[selectedImage] : product.image}
              alt={product.name}
              width={500}
              height={500}
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />

            {/* Navigation arrows for desktop and mobile */}
            {product.images && product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity touch-target"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity touch-target"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                {/* Image counter for mobile */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full md:hidden">
                  {selectedImage + 1} / {product.images.length}
                </div>
              </>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "h-12 w-12 md:h-16 md:w-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all touch-target",
                    selectedImage === idx
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${product.name} - Image ${idx + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">{product.name}</h1>
              <p className="text-lg md:text-xl font-semibold mt-2 text-primary">{formatPrice(product.price)}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 md:h-10 md:w-10 rounded-full touch-target flex-shrink-0"
              onClick={toggleWishlist}
            >
              <Heart
                className={cn("h-6 w-6 md:h-5 md:w-5 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-gray-600")}
              />
              <span className="sr-only">{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
            </Button>
          </div>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{product.description}</p>

          {product.details && (
            <div>
              <h3 className="font-medium mb-2 text-sm md:text-base">Details</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{product.details}</p>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-3 text-sm md:text-base">Size</h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "h-12 md:h-10 min-w-[3rem] md:min-w-[2.5rem] px-3 md:px-3 rounded-md border border-border bg-background flex items-center justify-center transition-colors touch-target text-sm md:text-base",
                    selectedSize === size
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:border-gray-400",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
            {selectedSize && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected size: <span className="font-medium">{selectedSize}</span>
              </p>
            )}
          </div>

          <div className="mb-8">
            <h3 className="font-medium mb-3">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-r-none bg-transparent"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="h-10 px-4 flex items-center justify-center border-y border-border">{quantity}</div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-l-none bg-transparent"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button className="w-full h-12" onClick={handleAddToCart} disabled={isAdding || !selectedSize}>
            <ShoppingBag className="mr-2 h-5 w-5" />
            {isAdding ? "Adding to Cart..." : "Add to Cart"}
          </Button>

          <div className="mt-8 pt-8 border-t border-border">
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium mb-1">Category</h3>
                <p className="text-muted-foreground">{product.category}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Condition</h3>
                <p className="text-muted-foreground">Good - Gently Used</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
