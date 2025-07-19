"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import EnhancedCheckoutForm from "@/components/checkout/enhanced-checkout-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function CheckoutV2Page() {
  return (
    <div className="container py-8 md:py-16 px-4 md:px-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cart">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>
      </div>

      {/* Checkout Form */}
      <div className="max-w-2xl mx-auto">
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          }
        >
          <EnhancedCheckoutForm
            onSuccess={(orderId) => {
              // Custom success handling if needed
              console.log("Order created:", orderId);
            }}
          />
        </Suspense>
      </div>

      {/* Help Section */}
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-secondary/30 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="h-5 w-5" />
          <h3 className="font-semibold">Need Help?</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          If you have any questions about your order, please don't hesitate to
          contact us.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/faq">View FAQ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
