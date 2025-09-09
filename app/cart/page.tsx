"use client";

export const dynamic = "force-dynamic";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  // Mock user state since we removed Clerk
  const isSignedIn = false;

  // Use local cart only since we removed authentication
  const activeItems = items;
  const activeRemoveItem = removeItem;
  const activeUpdateQuantity = updateQuantity;
  const activeSubtotal = subtotal;
  const activeClearCart = clearCart;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    router.push("/checkout");
  };

  if (activeItems.length === 0) {
    return (
      <div className="container max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="bg-secondary/50 rounded-lg p-8 mb-8">
          <p className="text-lg mb-6">Your cart is empty</p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="space-y-4">
            {activeItems.map((item) => {
              // Use local cart item data directly
              const itemData = item;

              return (
                <div
                  key={`${itemData.id}-${itemData.size}`}
                  className="flex gap-4 p-4 bg-secondary/50 rounded-lg"
                >
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={itemData.image || "/placeholder.svg"}
                      alt={itemData.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{itemData.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Size: {itemData.size}
                    </p>
                    <p className="text-sm font-medium">
                      {formatPrice(itemData.price)}
                    </p>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none bg-transparent"
                          onClick={() => {
                            if (itemData.quantity > 1) {
                              if (isSignedIn) {
                                activeUpdateQuantity(
                                  item.id,
                                  itemData.quantity - 1
                                );
                              } else {
                                activeUpdateQuantity(
                                  itemData.id,
                                  itemData.quantity - 1
                                );
                              }
                            }
                          }}
                          disabled={itemData.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <div className="h-8 px-3 flex items-center justify-center border-y border-border">
                          {itemData.quantity}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none bg-transparent"
                          onClick={() => {
                            if (isSignedIn) {
                              activeUpdateQuantity(
                                item.id,
                                itemData.quantity + 1
                              );
                            } else {
                              activeUpdateQuantity(
                                itemData.id,
                                itemData.quantity + 1
                              );
                            }
                          }}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => {
                          if (isSignedIn) {
                            activeRemoveItem(item.id);
                          } else {
                            activeRemoveItem(itemData.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="bg-secondary/50 rounded-lg p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(activeSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>{formatPrice(activeSubtotal)}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full mb-4"
              disabled={isCheckingOut}
            >
              {isCheckingOut ? "Processing..." : "Checkout"}
            </Button>

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
