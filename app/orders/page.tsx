"use client";

export const dynamic = "force-dynamic";

import { useServerOrders } from "@/hooks/use-server-orders";
import { useSupabaseAuth } from "@/contexts/supabase-auth-context";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function OrdersPage() {
  const { orders, isLoading, error } = useServerOrders();
  const { isAuthenticated, user } = useSupabaseAuth();

  if (!isAuthenticated) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">My Orders</h1>
        <p className="text-muted-foreground mb-8">
          Please log in to view your orders.
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
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-200">Error loading orders: {error}</p>
        </div>
      </div>
    );
  }

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
      case "refunded":
        return "bg-gray-500/20 text-gray-200 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-200 border-gray-500/30";
    }
  };

  return (
    <div className="container py-8 md:py-16 px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet.
          </p>
          <Button asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 md:p-6 bg-secondary/30"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    Order {order.order_number}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                  <p className="font-semibold">
                    {formatPrice(order.total_amount)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-md"
                  >
                    <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                      <Image
                        src={item.product_image || "/placeholder.svg"}
                        alt={item.product_name}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm md:text-base truncate">
                        {item.product_name}
                      </h4>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm md:text-base">
                        {formatPrice(item.total_price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.unit_price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="space-y-1 text-sm">
                    <p>Subtotal: {formatPrice(order.subtotal)}</p>
                    {order.tax_amount > 0 && (
                      <p>Tax: {formatPrice(order.tax_amount)}</p>
                    )}
                    {order.shipping_amount > 0 && (
                      <p>Shipping: {formatPrice(order.shipping_amount)}</p>
                    )}
                    {order.discount_amount > 0 && (
                      <p>Discount: -{formatPrice(order.discount_amount)}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                    {order.status === "pending" && (
                      <Button variant="outline" size="sm">
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tracking Info */}
              {order.tracking_number && (
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-md">
                  <p className="text-sm text-blue-200">
                    <strong>Tracking Number:</strong> {order.tracking_number}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
