import { NextResponse } from "next/server"

const categories = [
  {
    id: "1",
    name: "Hoodies",
    slug: "hoodies",
    image: "https://i.ibb.co/xq7nnWRs/hoodiessasa.webp",
    description: "Comfortable and stylish hoodies for all seasons",
  },
  {
    id: "2",
    name: "T-Shirts",
    slug: "t-shirts",
    image: "https://i.ibb.co/wFzkd1k9/vintage-sht.webp",
    description: "Vintage and modern t-shirts with unique designs",
  },
  {
    id: "3",
    name: "Outerwear",
    slug: "outerwear",
    image: "https://i.ibb.co/1Gk6Mz6k/hoode.webp",
    description: "Jackets, coats, and outer layers for style and warmth",
  },
  {
    id: "4",
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop",
    description: "Watches, sunglasses, jewelry, and other vintage accessories",
  },
  {
    id: "5",
    name: "Shoes",
    slug: "shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
    description: "Vintage and retro footwear for every style",
  },
]

export async function GET() {
  try {
    console.log(`Returning ${categories.length} categories`)
    return NextResponse.json(categories)
  } catch (error: any) {
    console.error("Error in categories API route:", error.message)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
