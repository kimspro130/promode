"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Phone, Mail } from "lucide-react"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    orderNumber: "",
  })

  useEffect(() => {
    const orderId = searchParams.get("orderId")
    const orderNumber = searchParams.get("orderNumber")

    if (orderId && orderNumber) {
      setOrderDetails({
        orderId,
        orderNumber,
      })
    }
  }, [searchParams])

  return (
    <div className="container py-16 max-w-2xl">
      <div className="text-center">
        <div className="mb-6">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for your order. We'll contact you shortly to confirm delivery details.
        </p>

        {orderDetails.orderNumber && (
          <div className="bg-secondary/50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Order Number:</strong> {orderDetails.orderNumber}
              </p>
              <p>
                <strong>Order ID:</strong> {orderDetails.orderId}
              </p>
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center justify-center">
            <Package className="mr-2 h-5 w-5" />
            What happens next?
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <p className="text-sm">We'll call you within 2 hours to confirm your order and delivery details.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <p className="text-sm">Your order will be prepared and packaged with care.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <p className="text-sm">We'll deliver your items directly to your doorstep.</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Phone className="h-4 w-4 text-green-500" />
              <span className="text-sm">+256 757 385 205 | 0789 548 006</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <span className="text-sm">promodecouture@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
