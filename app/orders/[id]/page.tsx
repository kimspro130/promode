"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useServerOrders } from "@/hooks/use-server-orders";
import { useSupabaseAuth } from "@/contexts/supabase-auth-context";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { getOrder, cancelOrderById } = useServerOrders();
  const { isAuthenticated } = useSupabaseAuth();

  const [order, setOrder] = useState<any>(null);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.id as string;
  const isSuccess = searchParams.get("success") === "true";

  useEffect(() => {
    if (orderId && isAuthenticated) {
      fetchOrderDetails();
    }
  }, [orderId, isAuthenticated]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const orderData = await getOrder(orderId);
      if (orderData) {
        setOrder(orderData);
        // Note: Status history would need a separate server action if needed
        setStatusHistory([]);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    const confirmed = confirm("Are you sure you want to cancel this order?");
    if (!confirmed) return;

    const result = await cancelOrderById(order.id, "Cancelled by customer");
    if (result.success) {
      setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : null));
      alert("Order cancelled successfully!");
    } else {
      alert(result.error || "Failed to cancel order");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Details</h1>
        <p className="text-muted-foreground mb-8">
          Please log in to view order details.
        </p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-16">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-200">{error || "Order not found"}</p>
          <Button asChild className="mt-4">
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-purple-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-orange-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-200 border-yellow-500/30";
      case "confirmed":
        return "bg-blue-500/20 text-blue-200 border-blue-500/30";
      case "processing":
        return "bg-purple-500/20 text-purple-200 border-purple-500/30";
      case "shipped":
        return "bg-orange-500/20 text-orange-200 border-orange-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-200 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-200 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-200 border-gray-500/30";
    }
  };

  return (
    <div className="container py-8 md:py-16 px-4 md:px-6">
      {/* Success Message */}
      {isSuccess && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-green-200 font-medium">
              Order placed successfully!
            </p>
          </div>
          <p className="text-green-200/80 text-sm mt-1">
            Thank you for your order. You will receive updates via email.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Order {order.order_number}
          </h1>
          <p className="text-muted-foreground">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="border rounded-lg p-6 bg-secondary/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Order Status</h2>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusIcon(order.status)}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>

            {order.tracking_number && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-md">
                <p className="text-sm text-blue-200">
                  <strong>Tracking Number:</strong> {order.tracking_number}
                </p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="border rounded-lg p-6 bg-secondary/30">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.order_items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-background/50 rounded-md"
                >
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.product_image || "/placeholder.svg"}
                      alt={item.product_name}
                      fill
                      className="object-cover rounded"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.unit_price)} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(item.total_price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border rounded-lg p-6 bg-secondary/30">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.shipping_address.full_name}</p>
              <p>{order.shipping_address.address_line_1}</p>
              {order.shipping_address.address_line_2 && (
                <p>{order.shipping_address.address_line_2}</p>
              )}
              <p>
                {order.shipping_address.city}, {order.shipping_address.state}{" "}
                {order.shipping_address.postal_code}
              </p>
              <p>{order.shipping_address.country}</p>
              {order.shipping_address.phone && (
                <p className="mt-2">Phone: {order.shipping_address.phone}</p>
              )}
            </div>
          </div>

          {/* Customer Notes */}
          {order.customer_notes && (
            <div className="border rounded-lg p-6 bg-secondary/30">
              <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
              <p className="text-sm">{order.customer_notes}</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-8 lg:h-fit">
          <div className="border rounded-lg p-6 bg-secondary/30 space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.tax_amount > 0 && (
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax_amount)}</span>
                </div>
              )}
              {order.shipping_amount > 0 && (
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping_amount)}</span>
                </div>
              )}
              {order.discount_amount > 0 && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount_amount)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-border/50 pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Payment Method:</strong>{" "}
                {order.payment_method || "Not specified"}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Payment Status:</strong> {order.payment_status}
              </p>
            </div>

            {order.status === "pending" && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleCancelOrder}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
