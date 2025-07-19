export interface Product {
  id: string
  name: string
  price: number
  description: string
  details?: string
  sizes: string[]
  image: string
  category?: string
  images?: string[]
}

export const fallbackProducts: Product[] = [
  {
    id: "1",
    name: "Vintage Denim Jacket",
    price: 85000, // UGX 85,000
    description: "Classic vintage denim jacket with authentic wear and character. Perfect for layering.",
    details:
      "This vintage denim jacket features authentic distressing and a timeless silhouette. Made from high-quality denim with a comfortable fit. Perfect for casual outings and street style looks.",
    sizes: ["S", "M", "L", "XL"],
    image: "https://i.ibb.co/1Gk6Mz6k/hoode.webp",
    category: "Outerwear",
    images: ["https://i.ibb.co/1Gk6Mz6k/hoode.webp", "/placeholder.svg?height=500&width=500"],
  },
  {
    id: "2",
    name: "Retro Band T-Shirt",
    price: 45000, // UGX 45,000
    description: "Authentic vintage band t-shirt with original graphics and soft cotton fabric.",
    details:
      "Original vintage band merchandise featuring classic graphics and comfortable cotton construction. Shows authentic wear that adds to its character and authenticity.",
    sizes: ["XS", "S", "M", "L"],
    image: "https://i.ibb.co/wFzkd1k9/vintage-sht.webp",
    category: "T-Shirts",
    images: ["https://i.ibb.co/wFzkd1k9/vintage-sht.webp", "/placeholder.svg?height=500&width=500"],
  },
  {
    id: "3",
    name: "Oversized Hoodie",
    price: 65000, // UGX 65,000
    description: "Comfortable oversized hoodie in excellent condition. Perfect for casual wear.",
    details:
      "This oversized hoodie offers maximum comfort with its relaxed fit and soft fleece interior. Features a spacious kangaroo pocket and adjustable drawstring hood.",
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://i.ibb.co/xq7nnWRs/hoodiessasa.webp",
    category: "Hoodies",
    images: ["https://i.ibb.co/xq7nnWRs/hoodiessasa.webp", "/placeholder.svg?height=500&width=500"],
  },
  {
    id: "4",
    name: "Leather Bomber Jacket",
    price: 135000, // UGX 135,000
    description: "Premium leather bomber jacket with vintage appeal and modern comfort.",
    details:
      "Crafted from genuine leather with a classic bomber silhouette. Features ribbed cuffs and hem, front zip closure, and interior pockets. Ages beautifully with wear.",
    sizes: ["S", "M", "L"],
    image: "/placeholder.svg?height=500&width=500",
    category: "Outerwear",
    images: ["/placeholder.svg?height=500&width=500"],
  },
  {
    id: "5",
    name: "Graphic Print Tee",
    price: 35000, // UGX 35,000
    description: "Unique graphic print t-shirt with artistic design and comfortable fit.",
    details:
      "Features an eye-catching graphic print on premium cotton fabric. Comfortable regular fit that works for both casual and street style looks.",
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/placeholder.svg?height=500&width=500",
    category: "T-Shirts",
    images: ["/placeholder.svg?height=500&width=500"],
  },
  {
    id: "6",
    name: "Zip-Up Hoodie",
    price: 75000, // UGX 75,000
    description: "Classic zip-up hoodie in great condition. Versatile and comfortable.",
    details:
      "Full-zip hoodie with adjustable hood and front pockets. Made from a cotton-polyester blend for durability and comfort. Perfect for layering.",
    sizes: ["S", "M", "L", "XL"],
    image: "/placeholder.svg?height=500&width=500",
    category: "Hoodies",
    images: ["/placeholder.svg?height=500&width=500"],
  },
  {
    id: "7",
    name: "Vintage Leather Boots",
    price: 95000, // UGX 95,000
    description: "Classic leather boots with authentic vintage character and sturdy construction.",
    details:
      "These vintage leather boots feature genuine leather construction with a timeless design. Perfect for both casual and semi-formal occasions. Shows beautiful patina that adds character.",
    sizes: ["40", "41", "42", "43", "44"],
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=500&fit=crop",
    ],
  },
  {
    id: "8",
    name: "Retro Sneakers",
    price: 55000, // UGX 55,000
    description: "Classic retro sneakers in excellent condition. Perfect for street style looks.",
    details:
      "Vintage-inspired sneakers with comfortable cushioning and durable construction. Features classic colorway and timeless silhouette that never goes out of style.",
    sizes: ["38", "39", "40", "41", "42", "43"],
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop",
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop",
    ],
  },
  {
    id: "9",
    name: "Canvas High-Tops",
    price: 45000, // UGX 45,000
    description: "Classic canvas high-top sneakers with vintage appeal and comfortable fit.",
    details:
      "Timeless canvas high-top sneakers with rubber sole and classic lace-up design. Perfect for casual wear and adds a retro touch to any outfit.",
    sizes: ["37", "38", "39", "40", "41", "42"],
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&h=500&fit=crop",
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop",
    ],
  },
  // NEW ACCESSORIES
  {
    id: "10",
    name: "Vintage Gold Watch",
    price: 125000, // UGX 125,000
    description: "Classic vintage gold-tone watch with leather strap. Timeless elegance for any occasion.",
    details:
      "This vintage-inspired timepiece features a gold-tone case with Roman numeral markers and a genuine leather strap. Perfect for both casual and formal wear. Quartz movement ensures reliable timekeeping.",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=500&h=500&fit=crop",
    ],
  },
  {
    id: "11",
    name: "Retro Aviator Sunglasses",
    price: 35000, // UGX 35,000
    description: "Classic aviator sunglasses with UV protection. Perfect for that vintage cool look.",
    details:
      "Iconic aviator-style sunglasses with metal frame and gradient lenses. Provides 100% UV protection while maintaining that timeless pilot aesthetic. Comes with protective case.",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    ],
  },
  {
    id: "12",
    name: "Leather Bracelet Set",
    price: 25000, // UGX 25,000
    description: "Handcrafted leather bracelet set with vintage brass accents. Perfect for layering.",
    details:
      "Set of 3 genuine leather bracelets with antique brass hardware. Each bracelet features unique textures and finishes. Adjustable sizing with snap closures. Perfect for creating a layered wrist look.",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=500&fit=crop",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1506629905607-c52b1b8e8d19?w=500&h=500&fit=crop",
    ],
  },
  {
    id: "13",
    name: "Vintage Cross Pendant",
    price: 45000, // UGX 45,000
    description: "Antique-style cross pendant necklace with intricate detailing. A statement piece with character.",
    details:
      "Beautiful vintage-inspired cross pendant crafted from oxidized metal with intricate engravings. Comes with an adjustable chain (18-22 inches). Perfect for adding a touch of vintage spirituality to any outfit.",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
    ],
  },
  {
    id: "14",
    name: "Round Frame Sunglasses",
    price: 30000, // UGX 30,000
    description: "Vintage-inspired round frame sunglasses. Perfect for that retro intellectual look.",
    details:
      "Classic round frame sunglasses with tinted lenses and metal frame. Inspired by 1960s fashion, these glasses add a sophisticated vintage touch to any outfit. UV protection included.",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500&h=500&fit=crop",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&h=500&fit=crop",
    ],
  },
  {
    id: "15",
    name: "Silver Chain Bracelet",
    price: 35000, // UGX 35,000
    description: "Chunky silver-tone chain bracelet with vintage appeal. Bold statement piece.",
    details:
      "Heavy-duty silver-tone chain bracelet with secure lobster clasp. Features a chunky link design that's perfect for making a bold fashion statement. Tarnish-resistant finish ensures lasting shine.",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
    ],
  },
  {
    id: "16",
    name: "Vintage Pocket Watch",
    price: 85000, // UGX 85,000
    description: "Classic pocket watch with chain. A sophisticated vintage timepiece with character.",
    details:
      "Elegant pocket watch with Roman numeral dial and vintage-style chain. Features a hinged cover and reliable quartz movement. Perfect for formal occasions or as a unique fashion statement.",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1509048191080-d2e2678e67b4?w=500&h=500&fit=crop",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1509048191080-d2e2678e67b4?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop",
    ],
  },
  {
    id: "17",
    name: "Beaded Pendant Necklace",
    price: 40000, // UGX 40,000
    description: "Handcrafted beaded necklace with natural stone pendant. Bohemian vintage style.",
    details:
      "Beautiful handcrafted necklace featuring natural stone beads and a unique pendant. Each piece is one-of-a-kind with slight variations in bead patterns. Adjustable length from 16-20 inches.",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
    ],
  },
]
