"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type CartItem = Database["public"]["Tables"]["cart_items"]["Row"] & {
  product: Database["public"]["Tables"]["products"]["Row"];
};

type CartItemInsert = Database["public"]["Tables"]["cart_items"]["Insert"];

export function useSupabaseCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  // Mock user state since we removed authentication
  const user = null;
  const isSignedIn = false;

  const fetchCartItems = useCallback(async () => {
    if (!isSignedIn || !user) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          *,
          product:products(*)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setItems(data || []);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch cart items"
      );
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, user, supabase]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const addItem = async (
    productId: string,
    size: string,
    quantity: number = 1
  ) => {
    if (!isSignedIn || !user) {
      setError("Please log in to add items to cart");
      return { success: false, error: "Please log in to add items to cart" };
    }

    try {
      // Check if item already exists
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .eq("size", size)
        .single();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          size,
          quantity,
        });

        if (error) throw error;
      }

      await fetchCartItems();
      return { success: true };
    } catch (err) {
      console.error("Error adding item to cart:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add item to cart";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!isSignedIn || !user) {
      return { success: false, error: "Please log in to update cart" };
    }

    try {
      if (quantity <= 0) {
        return await removeItem(itemId);
      }

      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", itemId)
        .eq("user_id", user.id);

      if (error) throw error;

      await fetchCartItems();
      return { success: true };
    } catch (err) {
      console.error("Error updating cart item:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update cart item";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const removeItem = async (itemId: string) => {
    if (!isSignedIn || !user) {
      return {
        success: false,
        error: "Please log in to remove items from cart",
      };
    }

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId)
        .eq("user_id", user.id);

      if (error) throw error;

      await fetchCartItems();
      return { success: true };
    } catch (err) {
      console.error("Error removing cart item:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove cart item";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async () => {
    if (!isSignedIn || !user) {
      return { success: false, error: "Please log in to clear cart" };
    }

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setItems([]);
      return { success: true };
    } catch (err) {
      console.error("Error clearing cart:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to clear cart";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    items,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
    fetchCartItems,
  };
}
