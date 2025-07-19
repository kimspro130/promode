// Migration script to populate Supabase with existing product data
// Run this script after setting up your Supabase database

import { createClient } from "@supabase/supabase-js";
import { fallbackProducts } from "../lib/product-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}

export { migrateProducts, addSampleProducts };
