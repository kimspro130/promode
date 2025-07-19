"use client";

export const dynamic = "force-dynamic";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { useSupabaseCart } from "@/hooks/use-supabase-cart";
import { useSupabaseOrders } from "@/hooks/use-supabase-orders";
import { useSupabaseAuth } from "@/contexts/supabase-auth-context";
import { formatPrice } from "@/lib/utils";
import { Loader2, Phone, Truck, Shield } from "lucide-react";
import { trackEvent } from "@/components/google-analytics";
import { submitOrder } from "@/lib/actions/orders";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const {
    items: supabaseItems,
    getTotalPrice: getSupabaseTotalPrice,
    clearCart: clearSupabaseCart,
  } = useSupabaseCart();
  const { createOrder } = useSupabaseOrders();
  const { isAuthenticated, user } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Use Supabase cart if user is authenticated, otherwise use local cart
  const activeItems = isAuthenticated ? supabaseItems : items;
  const activeTotalPrice = isAuthenticated
    ? getSupabaseTotalPrice()
    : getTotalPrice();
  const activeClearCart = isAuthenticated ? clearSupabaseCart : clearCart;

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    paymentMethod: "cash_on_delivery",
    customerNotes: "",
  });

  // This ensures hydration issues are avoided
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (isClient && activeItems.length === 0) {
      router.push("/cart");
    }
  }, [activeItems, router, isClient]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Please enter your name");
      return false;
    }
    if (!formData.phone.trim()) {
      alert("Please enter your phone number");
      return false;
    }
    if (!formData.address.trim()) {
      alert("Please enter your address");
      return false;
    }
    if (!formData.city.trim()) {
      alert("Please enter your city");
      return false;
    }
    if (!formData.state.trim()) {
      alert("Please enter your state");
      return false;
    }
    if (!formData.postal_code.trim()) {
      alert("Please enter your postal code");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Track checkout initiation
      trackEvent(
        "begin_checkout",
        "ecommerce",
        "Checkout Started",
        activeTotalPrice
      );

      if (isAuthenticated && user) {
        // Use server action for authenticated users
        const cartItems = activeItems.map((item) => ({
          product_id: item.product_id || item.id,
          product_name: item.product?.name || item.name,
          product_image: item.product?.image || item.image,
          quantity: item.quantity,
          size: item.size || "One Size",
          unit_price: item.product?.price || item.price,
        }));

        const result = await submitOrder({
          user_id: user.id,
          shipping_address: {
            full_name: formData.name,
            address_line_1: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: "US",
            phone: formData.phone,
          },
          payment_method: formData.paymentMethod,
          customer_notes: formData.customerNotes || undefined,
          cart_items: cartItems,
        });

        if (result.success) {
          // Track successful order placement
          trackEvent("purchase", "ecommerce", "Order Placed", activeTotalPrice);

          // Cart is automatically cleared by server action
          router.push(`/orders/${result.order?.id}?success=true`);
        } else {
          throw new Error(result.error || "Failed to create order");
        }
      } else {
        // Fallback to original API for non-authenticated users
        const createOrderResponse = await fetch("/api/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            paymentMethod: formData.paymentMethod,
            customerNotes: formData.customerNotes,
            items: activeItems.map((item) => ({
              title: item.name,
              price: item.price,
              quantity: item.quantity,
              size: item.size || "One Size",
            })),
            totalAmount: activeTotalPrice,
          }),
        });

        if (!createOrderResponse.ok) {
          throw new Error("Failed to create order");
        }

        const orderResult = await createOrderResponse.json();

        // Track successful order placement
        trackEvent("purchase", "ecommerce", "Order Placed", activeTotalPrice);

        // Clear cart and redirect to success page
        activeClearCart();
        router.push(
          `/order-success?orderId=${orderResult.orderId}&orderNumber=${orderResult.orderNumber}`
        );
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Add some items to your cart before checking out.
        </p>
        <Button onClick={() => router.push("/shop")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Size: {item.size}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span>{formatPrice(activeTotalPrice)}</span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-8 w-8 text-green-500" />
              <span className="text-sm text-muted-foreground">
                Secure Service
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Truck className="h-8 w-8 text-blue-500" />
              <span className="text-sm text-muted-foreground">
                Door-to-Door
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Phone className="h-8 w-8 text-purple-500" />
              <span className="text-sm text-muted-foreground">
                Easy Contact
              </span>
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your street address"
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter your state"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="postal_code">Postal Code *</Label>
              <Input
                id="postal_code"
                name="postal_code"
                type="text"
                value={formData.postal_code}
                onChange={handleInputChange}
                placeholder="Enter your postal code"
                required
              />
            </div>

            <div>
              <Label htmlFor="customerNotes">Order Notes (Optional)</Label>
              <Textarea
                id="customerNotes"
                name="customerNotes"
                value={formData.customerNotes}
                onChange={handleInputChange}
                placeholder="Any special instructions for your order..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                required
              >
                <option value="cash_on_delivery">Cash on Delivery</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            {formData.paymentMethod === "mobile_money" && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Mobile Money Payment:</strong> You will receive
                  payment instructions via SMS after placing your order.
                </p>
              </div>
            )}

            {formData.paymentMethod === "bank_transfer" && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Bank Transfer:</strong> Bank details will be provided
                  after order confirmation.
                </p>
              </div>
            )}

            {formData.paymentMethod === "cash_on_delivery" && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Cash on Delivery:</strong> Pay when your order is
                  delivered to your doorstep.
                </p>
              </div>
            )}

            <Button
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <Phone className="mr-2 h-5 w-5" />
                  Place Order - {formatPrice(getTotalPrice())}
                </>
              )}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              By placing your order, you agree to our{" "}
              <a href="/policies/terms" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/policies/privacy" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
