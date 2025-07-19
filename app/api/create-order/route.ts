import { NextResponse } from "next/server"

// Phone number formatting function for Uganda
function formatPhone(phone: string): string {
  if (!phone) return ""

  // Remove all non-digit characters
  let cleanPhone = phone.replace(/\D/g, "")

  // Remove leading 0 if present
  if (cleanPhone.startsWith("0")) {
    cleanPhone = cleanPhone.slice(1)
  }

  // If it's a 9-digit Ugandan number, add country code
  if (cleanPhone.length === 9 && !cleanPhone.startsWith("256")) {
    return "+256" + cleanPhone
  }

  // If it already has country code but no +, add it
  if (cleanPhone.length === 12 && cleanPhone.startsWith("256")) {
    return "+" + cleanPhone
  }

  // If it already has + and country code, return as is
  if (cleanPhone.length === 9 || cleanPhone.length === 12) {
    return cleanPhone.startsWith("256") ? "+" + cleanPhone : "+256" + cleanPhone
  }

  // For any other format, try to make it work
  return cleanPhone.length >= 9 ? "+" + cleanPhone : ""
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, address, paymentMethod, items, totalAmount } = body

    console.log("Order request received:", { name, phone, address, paymentMethod, itemCount: items?.length })

    // Validate required fields
    if (!name || !phone || !address || !paymentMethod) {
      console.error("Missing required fields:", {
        name: !!name,
        phone: !!phone,
        address: !!address,
        paymentMethod: !!paymentMethod,
      })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Format phone number
    const formattedPhone = formatPhone(phone)
    console.log("Original phone:", phone)
    console.log("Formatted phone:", formattedPhone)

    if (!formattedPhone) {
      console.error("Invalid phone number format:", phone)
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    // Prepare line items from cart items or use default item
    let lineItems = []

    if (items && items.length > 0) {
      lineItems = items.map((item: any) => ({
        title: item.title || "Thrift Item",
        price: Number.parseFloat(item.price).toFixed(2),
        quantity: item.quantity || 1,
        taxable: false,
      }))
    } else {
      lineItems = [
        {
          title: "Thrift Item",
          price: "35000.00",
          quantity: 1,
          taxable: false,
        },
      ]
    }

    console.log("Prepared line items:", lineItems)

    // Calculate total price in UGX
    const totalPrice = totalAmount ? totalAmount.toFixed(2) : "35000.00"

    console.log("Total price (UGX):", totalPrice)

    // Split name into first and last name
    const nameParts = name.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    // Generate a unique order number
    const orderNumber = `PROMODE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const orderId = Date.now()

    // Create order data (this would typically be saved to a database)
    const orderData = {
      id: orderId,
      orderNumber: orderNumber,
      customer: {
        firstName: firstName,
        lastName: lastName,
        phone: formattedPhone,
        email: `customer_${Date.now()}@example.com`,
      },
      shippingAddress: {
        firstName: firstName,
        lastName: lastName,
        address1: address,
        phone: formattedPhone,
        city: "Kampala",
        province: "Central",
        country: "Uganda",
        zip: "00000",
      },
      lineItems: lineItems,
      totalPrice: totalPrice,
      currency: "UGX",
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "cash_on_delivery" ? "pending" : "awaiting_payment",
      createdAt: new Date().toISOString(),
      status: "confirmed",
    }

    console.log("Order created successfully:", JSON.stringify(orderData, null, 2))

    // In a real application, you would save this to a database
    // For now, we'll just log it and return success

    return NextResponse.json({
      success: true,
      orderId: orderId,
      orderNumber: orderNumber,
      message: "Order placed successfully",
      paymentMethod: paymentMethod,
    })
  } catch (error: any) {
    console.error("Error creating order:", error.message, error.stack)
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 })
  }
}
