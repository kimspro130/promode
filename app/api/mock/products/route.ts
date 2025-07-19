import { NextResponse } from "next/server"
import { fallbackProducts } from "@/lib/product-data"

export async function GET() {
  // Convert our fallback products to a format similar to Shopify's API response
  const mockProducts = fallbackProducts.map((product) => ({
    id: Number.parseInt(product.id),
    title: product.name,
    body_html: product.description,
    vendor: "PROMODE",
    product_type: product.category || "Uncategorized",
    created_at: new Date().toISOString(),
    handle: product.name.toLowerCase().replace(/\s+/g, "-"),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    status: "active",
    published_scope: "web",
    tags: "",
    variants: [
      {
        id: Number.parseInt(product.id) * 100,
        product_id: Number.parseInt(product.id),
        title: "Default",
        price: product.price.toString(),
        sku: `SKU-${product.id}`,
        position: 1,
        inventory_policy: "deny",
        compare_at_price: null,
        fulfillment_service: "manual",
        inventory_management: null,
        option1: "Default",
        option2: null,
        option3: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        taxable: true,
        barcode: "",
        grams: 0,
        image_id: null,
        weight: 0,
        weight_unit: "kg",
        inventory_item_id: Number.parseInt(product.id) * 1000,
        inventory_quantity: 10,
        old_inventory_quantity: 10,
        requires_shipping: true,
        admin_graphql_api_id: `gid://shopify/ProductVariant/${Number.parseInt(product.id) * 100}`,
      },
    ],
    options: [
      {
        id: Number.parseInt(product.id) * 10,
        product_id: Number.parseInt(product.id),
        name: "Size",
        position: 1,
        values: product.sizes,
      },
    ],
    images: [
      {
        id: Number.parseInt(product.id) * 1000,
        product_id: Number.parseInt(product.id),
        position: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        alt: null,
        width: 800,
        height: 800,
        src: product.image,
        variant_ids: [],
      },
    ],
    image: {
      id: Number.parseInt(product.id) * 1000,
      product_id: Number.parseInt(product.id),
      position: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      alt: null,
      width: 800,
      height: 800,
      src: product.image,
      variant_ids: [],
    },
  }))

  return NextResponse.json(mockProducts)
}
