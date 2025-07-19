import { NextResponse } from "next/server"
import { fallbackProducts } from "@/lib/product-data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    console.log(`Fetching product with ID: ${id}`)

    // Find product in fallback data
    const product = fallbackProducts.find((p) => p.id === id)

    if (!product) {
      console.error(`Product with ID ${id} not found`)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Convert our Product format to match expected format
    const mockProduct = {
      id: Number.parseInt(product.id),
      title: product.name,
      body_html: product.description,
      vendor: "PROMODE",
      product_type: product.category || "Clothing",
      created_at: new Date().toISOString(),
      handle: product.name.toLowerCase().replace(/\s+/g, "-"),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      template_suffix: null,
      status: "active",
      published_scope: "web",
      tags: product.category || "thrift",
      admin_graphql_api_id: `gid://shopify/Product/${product.id}`,
      variants: [
        {
          id: Number.parseInt(product.id) * 100,
          product_id: Number.parseInt(product.id),
          title: "Default Title",
          price: product.price.toString(),
          sku: `PROMODE-${product.id}`,
          position: 1,
          inventory_policy: "deny",
          compare_at_price: null,
          fulfillment_service: "manual",
          inventory_management: "shopify",
          option1: product.sizes[0] || "One Size",
          option2: null,
          option3: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          taxable: true,
          barcode: "",
          grams: 500,
          image_id: null,
          weight: 0.5,
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
      images: (product.images || [product.image]).map((img, index) => ({
        id: Number.parseInt(product.id) * 1000 + index,
        product_id: Number.parseInt(product.id),
        position: index + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        alt: product.name,
        width: 800,
        height: 800,
        src: img,
        variant_ids: [Number.parseInt(product.id) * 100],
      })),
      image: {
        id: Number.parseInt(product.id) * 1000,
        product_id: Number.parseInt(product.id),
        position: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        alt: product.name,
        width: 800,
        height: 800,
        src: product.image,
        variant_ids: [Number.parseInt(product.id) * 100],
      },
    }

    console.log(`Successfully found product with ID ${id}`)
    return NextResponse.json(mockProduct)
  } catch (error: any) {
    console.error("Error in product API route:", error.message)
    return NextResponse.json({ error: "Failed to fetch product", message: error.message }, { status: 500 })
  }
}
