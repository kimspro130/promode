"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useSupabaseCart } from "@/hooks/use-supabase-cart";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { CreditCard, Truck, MapPin, Smartphone } from "lucide-react";
import PesapalPayment from "@/components/payments/pesapal-payment";

const checkoutSchema = z.object({
  shipping_address: z.object({
    full_name: z.string().min(2, "Full name is required"),
    address_line_1: z.string().min(5, "Address is required"),
    address_line_2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    postal_code: z.string().min(3, "Postal code is required"),
    country: z.string().min(2, "Country is required"),
    phone: z.string().min(10, "Phone number is required"),
  }),
  payment_method: z.enum(["pesapal", "credit_card", "cash_on_delivery"]),
  customer_notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface EnhancedCheckoutFormProps {
  onSuccess?: (orderId: string) => void;
}

export default function EnhancedCheckoutForm({ onSuccess }: EnhancedCheckoutFormProps) {
  const { user, isSignedIn } = useUser();
  const { items: supabaseItems, getTotalPrice: getSupabaseTotalPrice, clearCart: clearSupabaseCart } = useSupabaseCart();
  const { items: localItems, subtotal: localSubtotal, clearCart: clearLocalCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPesapalPayment, setShowPesapalPayment] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  // Use appropriate cart based on authentication
  const activeItems = isSignedIn ? supabaseItems : localItems;
  const activeTotal = isSignedIn ? getSupabaseTotalPrice() : localSubtotal;
  const activeClearCart = isSignedIn ? clearSupabaseCart : clearLocalCart;

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping_address: {
        full_name: user?.fullName || "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "KE",
        phone: user?.phoneNumbers?.[0]?.phoneNumber || "",
      },
      payment_method: "pesapal",
      customer_notes: "",
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (activeItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in database
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: activeItems,
          total_amount: activeTotal,
          shipping_address: data.shipping_address,
          payment_method: data.payment_method,
          customer_notes: data.customer_notes,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const order = await orderResponse.json();
      setCurrentOrderId(order.id);

      if (data.payment_method === "pesapal") {
        // Show Pesapal payment component
        setShowPesapalPayment(true);
      } else if (data.payment_method === "cash_on_delivery") {
        // Handle cash on delivery
        toast.success("Order placed successfully!");
        await activeClearCart();
        router.push(`/checkout/success?order=${order.id}`);
        if (onSuccess) onSuccess(order.id);
      } else {
        // Handle other payment methods
        toast.info("Payment method not yet implemented");
      }

    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePesapalSuccess = async (paymentData: any) => {
    toast.success("Payment initiated successfully!");
    await activeClearCart();
    if (onSuccess && currentOrderId) onSuccess(currentOrderId);
  };

  const handlePesapalError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
    setShowPesapalPayment(false);
  };

  if (showPesapalPayment && currentOrderId) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Complete Your Payment</h2>
          <p className="text-muted-foreground">
            You're almost done! Complete your payment to finalize your order.
          </p>
        </div>
        
        <PesapalPayment
          amount={activeTotal}
          currency="KES"
          orderId={currentOrderId}
          description={`Order payment for ${activeItems.length} items`}
          onSuccess={handlePesapalSuccess}
          onError={handlePesapalError}
        />
        
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowPesapalPayment(false)}
          >
            Back to Checkout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeItems.map((item) => {
              const itemData = isSignedIn 
                ? { name: item.product?.name, price: item.product?.price, quantity: item.quantity }
                : { name: item.name, price: item.price, quantity: item.quantity };
              
              return (
                <div key={item.id} className="flex justify-between">
                  <span>{itemData.name} × {itemData.quantity}</span>
                  <span>{formatPrice(itemData.price * itemData.quantity)}</span>
                </div>
              );
            })}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(activeTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                {...form.register("shipping_address.full_name")}
                placeholder="Enter your full name"
              />
              {form.formState.errors.shipping_address?.full_name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.shipping_address.full_name.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...form.register("shipping_address.phone")}
                placeholder="+254700000000"
              />
              {form.formState.errors.shipping_address?.phone && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.shipping_address.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line_1">Address Line 1</Label>
            <Input
              id="address_line_1"
              {...form.register("shipping_address.address_line_1")}
              placeholder="Street address"
            />
            {form.formState.errors.shipping_address?.address_line_1 && (
              <p className="text-sm text-destructive">
                {form.formState.errors.shipping_address.address_line_1.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...form.register("shipping_address.city")}
                placeholder="City"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State/County</Label>
              <Input
                id="state"
                {...form.register("shipping_address.state")}
                placeholder="State or County"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                {...form.register("shipping_address.postal_code")}
                placeholder="00100"
              />
            </div>
          </div>
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
            value={form.watch("payment_method")}
            onValueChange={(value) => form.setValue("payment_method", value as any)}
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="pesapal" id="pesapal" />
              <Label htmlFor="pesapal" className="flex items-center gap-2 cursor-pointer">
                <Smartphone className="h-4 w-4" />
                Pesapal (M-Pesa, Cards, Banks)
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="cash_on_delivery" id="cod" />
              <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                <Truck className="h-4 w-4" />
                Cash on Delivery
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Customer Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            {...form.register("customer_notes")}
            placeholder="Any special instructions for your order..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting || activeItems.length === 0}
      >
        {isSubmitting ? "Processing..." : `Place Order - ${formatPrice(activeTotal)}`}
      </Button>
    </form>
  );
}
