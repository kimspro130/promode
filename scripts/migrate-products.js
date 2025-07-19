// Migration script to populate Supabase with existing product data
// Run this script after setting up your Supabase database

require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

// Sample products to migrate (you can expand this list)
const fallbackProducts = [
  {
    id: "1",
    name: "Vintage Denim Jacket",
    price: 85.0,
    description:
      "Classic vintage denim jacket with authentic wear and character. Perfect for layering.",
    details:
      "This vintage denim jacket features authentic distressing and a timeless silhouette. Made from high-quality denim with a comfortable fit. Perfect for casual outings and street style looks.",
    sizes: ["S", "M", "L", "XL"],
    image: "https://i.ibb.co/1Gk6Mz6k/hoode.webp",
    category: "Outerwear",
    images: [
      "https://i.ibb.co/1Gk6Mz6k/hoode.webp",
      "/placeholder.svg?height=500&width=500",
    ],
  },
  {
    id: "2",
    name: "Retro Band T-Shirt",
    price: 45.0,
    description:
      "Authentic vintage band t-shirt with original graphics and soft cotton fabric.",
    details:
      "Original vintage band t-shirt featuring classic band graphics. Made from soft, pre-washed cotton for ultimate comfort. A must-have for music lovers and vintage enthusiasts.",
    sizes: ["S", "M", "L"],
    image: "https://i.ibb.co/wFzkd1k9/vintage-sht.webp",
    category: "T-Shirts",
    images: ["https://i.ibb.co/wFzkd1k9/vintage-sht.webp"],
  },
  {
    id: "3",
    name: "Oversized Hoodie",
    price: 65.0,
    description:
      "Comfortable oversized hoodie perfect for casual wear and street style.",
    details:
      "This oversized hoodie offers maximum comfort with its relaxed fit and soft fabric. Features a spacious kangaroo pocket and adjustable drawstring hood.",
    sizes: ["S", "M", "L", "XL"],
    image: "https://i.ibb.co/xq7nnWRs/hoodiessasa.webp",
    category: "Hoodies",
    images: ["https://i.ibb.co/xq7nnWRs/hoodiessasa.webp"],
  },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing environment variables. Please check your .env.local file."
  );
  console.error(
    "Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateProducts() {
  console.log("Starting product migration...");

  try {
    // Transform the existing product data to match Supabase schema
    const productsToInsert = fallbackProducts.map((product) => ({
      id: product.id,
      name: product.name,
      description:
        product.description ||
        `Premium ${(
          product.category || "item"
        ).toLowerCase()} from our thrift collection`,
      price: product.price,
      category: product.category || "Uncategorized",
      sizes: product.sizes || ["One Size"],
      images: product.images || [product.image],
      image: product.image,
      details: product.details || null,
      stock_quantity: Math.floor(Math.random() * 20) + 5, // Random stock between 5-25
    }));

    console.log(`Preparing to migrate ${productsToInsert.length} products...`);

    // Insert products in batches
    const batchSize = 10;
    for (let i = 0; i < productsToInsert.length; i += batchSize) {
      const batch = productsToInsert.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from("products")
        .upsert(batch, { onConflict: "id" });

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      } else {
        console.log(
          `Successfully inserted batch ${i / batchSize + 1} (${
            batch.length
          } products)`
        );
      }
    }

    console.log("Product migration completed!");

    // Verify the migration
    const { data: allProducts, error: countError } = await supabase
      .from("products")
      .select("id", { count: "exact" });

    if (countError) {
      console.error("Error counting products:", countError);
    } else {
      console.log(`Total products in database: ${allProducts?.length || 0}`);
    }
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Sample products to add if you want more variety
const additionalProducts = [
  {
    id: "vintage-denim-jacket-001",
    name: "Vintage Denim Jacket",
    description: "Classic 90s denim jacket with authentic wear and character",
    price: 89.99,
    category: "Outerwear",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop&sat=-100",
    ],
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop",
    details:
      "Authentic vintage denim jacket from the 90s. Features classic button closure, chest pockets, and a relaxed fit.",
    stock_quantity: 3,
  },
  {
    id: "retro-band-tee-001",
    name: "Retro Band T-Shirt",
    description: "Authentic vintage band t-shirt with original graphics",
    price: 45.0,
    category: "T-Shirts",
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    ],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    details:
      "Original vintage band t-shirt with authentic graphics and soft cotton fabric.",
    stock_quantity: 2,
  },
  {
    id: "leather-boots-vintage-001",
    name: "Vintage Leather Boots",
    description: "Classic leather boots with timeless style",
    price: 120.0,
    category: "Shoes",
    sizes: ["37", "38", "39", "40", "41", "42", "43"],
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
    ],
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
    details:
      "High-quality vintage leather boots with excellent craftsmanship and durability.",
    stock_quantity: 8,
  },
];

async function addSampleProducts() {
  console.log("Adding sample products...");

  try {
    const { data, error } = await supabase
      .from("products")
      .upsert(additionalProducts, { onConflict: "id" });

    if (error) {
      console.error("Error adding sample products:", error);
    } else {
      console.log("Sample products added successfully!");
    }
  } catch (error) {
    console.error("Failed to add sample products:", error);
  }
}

// Run the migration
if (require.main === module) {
  migrateProducts()
    .then(() => addSampleProducts())
    .then(() => {
      console.log("Migration completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}

module.exports = { migrateProducts, addSampleProducts };
