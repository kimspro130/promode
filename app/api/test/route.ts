import { NextResponse } from "next/server"

export async function GET() {
  try {
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "")
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN

    let shopifyConnectionStatus = "Not tested"
    let shopDetails = null

    if (shopifyDomain && accessToken) {
      try {
        const url = `https://${shopifyDomain}/admin/api/2023-10/shop.json`
        console.log(`Testing Shopify connection: ${url}`)

        const response = await fetch(url, {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()
          shopifyConnectionStatus = `Connected to ${data.shop?.name || "Shopify store"}`
          shopDetails = data.shop
        } else {
          const errorText = await response.text()
          shopifyConnectionStatus = `Failed to connect: ${response.status} ${response.statusText}`
          console.error("Shopify connection test failed:", errorText)
        }
      } catch (error: any) {
        shopifyConnectionStatus = `Error connecting: ${error.message}`
        console.error("Shopify connection test error:", error)
      }
    }

    return NextResponse.json({
      message: "PROMODE API is working!",
      timestamp: new Date().toISOString(),
      status: "healthy",
      env: {
        shopifyDomain: shopifyDomain || "Not set",
        hasShopifyAccessToken: !!accessToken,
      },
      shopifyConnection: shopifyConnectionStatus,
      shopDetails,
    })
  } catch (error: any) {
    console.error("Error in test API route:", error.message)
    return NextResponse.json({ error: "Test API failed" }, { status: 500 })
  }
}
