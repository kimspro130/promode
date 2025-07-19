"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitOrder } from "@/lib/actions/orders";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/supabase-auth-context";
import { useSupabaseCart } from "@/hooks/use-supabase-cart";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { CreditCard, Truck, MapPin } from "lucide-react";
import { checkoutSchema, type CheckoutFormData } from "@/lib/schemas/checkout";

interface CheckoutFormProps {
  onSuccess?: (orderId: string) => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const { user, isAuthenticated } = useSupabaseAuth();
  const { items, getTotalPrice, clearCart } = useSupabaseCart();
  const router = useRouter();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping_address: {
        full_name: user?.name || "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "US",
        phone: "",
      },
      billing_address: undefined,
      use_same_address: true,
      payment_method: "credit_card",
      customer_notes: "",
    },
  });

  const { watch, setValue } = form;
  const useSameAddress = watch("use_same_address");
  const shippingAddress = watch("shipping_address");

  // Calculate totals
  const subtotal = getTotalPrice();
  const taxAmount = subtotal * 0.1; // 10% tax
  const shippingAmount = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const totalAmount = subtotal + taxAmount + shippingAmount;

  const onSubmit = async (values: CheckoutFormData) => {
    if (!isAuthenticated || !user) {
      toast.error("Please log in to place an order");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      // Prepare cart items for order
      const cartItems = items.map((item) => ({
        product_id: item.product_id,
        product_name: item.product.name,
        product_image: item.product.image,
        quantity: item.quantity,
        size: item.size,
        unit_price: item.product.price,
      }));

      // Submit order using server action
      const result = await submitOrder({
        user_id: user.id,
        shipping_address: values.shipping_address,
        billing_address: values.use_same_address
          ? values.shipping_address
          : values.billing_address,
        payment_method: values.payment_method,
        customer_notes: values.customer_notes,
        cart_items: cartItems,
      });

      if (result.success) {
        toast.success("Order placed successfully!");

        // Clear cart is handled by server action

        // Call success callback or redirect
        if (onSuccess && result.order) {
          onSuccess(result.order.id);
        } else if (result.order) {
          router.push(`/orders/${result.order.id}?success=true`);
        }
      } else {
        toast.error(result.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // Auto-fill billing address when "use same address" is checked
  const handleUseSameAddressChange = (checked: boolean) => {
    setValue("use_same_address", checked);
    if (checked) {
      setValue("billing_address", undefined);
    } else {
      setValue("billing_address", { ...shippingAddress });
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please log in to continue with checkout
          </p>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Your cart is empty
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="shipping_full_name">Full Name *</Label>
              <Input
                id="shipping_full_name"
                {...form.register("shipping_address.full_name")}
                className="mt-1"
              />
              {form.formState.errors.shipping_address?.full_name && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.shipping_address.full_name.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="shipping_address_1">Address Line 1 *</Label>
              <Input
                id="shipping_address_1"
                {...form.register("shipping_address.address_line_1")}
                className="mt-1"
              />
              {form.formState.errors.shipping_address?.address_line_1 && (
                <p className="text-sm text-red-500 mt-1">
                  {
                    form.formState.errors.shipping_address.address_line_1
                      .message
                  }
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="shipping_address_2">Address Line 2</Label>
              <Input
                id="shipping_address_2"
                {...form.register("shipping_address.address_line_2")}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="shipping_city">City *</Label>
              <Input
                id="shipping_city"
                {...form.register("shipping_address.city")}
                className="mt-1"
              />
              {form.formState.errors.shipping_address?.city && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.shipping_address.city.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="shipping_state">State *</Label>
              <Input
                id="shipping_state"
                {...form.register("shipping_address.state")}
                className="mt-1"
              />
              {form.formState.errors.shipping_address?.state && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.shipping_address.state.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="shipping_postal_code">Postal Code *</Label>
              <Input
                id="shipping_postal_code"
                {...form.register("shipping_address.postal_code")}
                className="mt-1"
              />
              {form.formState.errors.shipping_address?.postal_code && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.shipping_address.postal_code.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="shipping_phone">Phone</Label>
              <Input
                id="shipping_phone"
                type="tel"
                {...form.register("shipping_address.phone")}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Billing Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="use_same_address"
              checked={useSameAddress}
              onCheckedChange={handleUseSameAddressChange}
            />
            <Label htmlFor="use_same_address">Same as shipping address</Label>
          </div>

          {!useSameAddress && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Billing address fields - similar to shipping */}
              <div className="md:col-span-2">
                <Label htmlFor="billing_full_name">Full Name *</Label>
                <Input
                  id="billing_full_name"
                  {...form.register("billing_address.full_name")}
                  className="mt-1"
                />
              </div>
              {/* Add other billing fields as needed */}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={watch("payment_method")}
            onValueChange={(value) => setValue("payment_method", value as any)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card">Credit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal">PayPal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
              <Label htmlFor="cash_on_delivery">Cash on Delivery</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Order Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Order Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            {...form.register("customer_notes")}
            placeholder="Any special instructions for your order..."
            className="min-h-[80px]"
          />
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({items.length} items)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>{formatPrice(taxAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>
              {shippingAmount === 0 ? "Free" : formatPrice(shippingAmount)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 text-lg"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting
          ? "Processing..."
          : `Place Order - ${formatPrice(totalAmount)}`}
      </Button>
    </form>
  );
}
