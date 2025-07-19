"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import {
  validateOrderSubmission,
  validateCartItems,
  validateTotalAmount,
  formatValidationErrors,
  type OrderSubmissionData,
} from "@/lib/schemas/checkout";

// Use service role key for server actions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Use the validated type from schema
export type OrderData = OrderSubmissionData;

export async function submitOrder(orderData: OrderData) {
  try {
    // Validate input data
    const validation = validateOrderSubmission(orderData);
    if (!validation.success) {
      return {
        success: false,
        error: `Validation failed: ${formatValidationErrors(validation.error)
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    // Validate cart items
    const cartValidation = validateCartItems(orderData.cart_items);
    if (!cartValidation.success) {
      return {
        success: false,
        error: cartValidation.error,
      };
    }

    // Calculate totals
    const subtotal = orderData.cart_items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
    const tax_amount = subtotal * 0.1; // 10% tax
    const shipping_amount = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total_amount = subtotal + tax_amount + shipping_amount;

    // Validate calculated totals
    const totalValidation = validateTotalAmount(orderData.cart_items, subtotal);
    if (!totalValidation.success) {
      return {
        success: false,
        error: totalValidation.error,
      };
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: orderData.user_id,
        subtotal,
        tax_amount,
        shipping_amount,
        total_amount,
        shipping_address: orderData.shipping_address,
        billing_address:
          orderData.billing_address || orderData.shipping_address,
        payment_method: orderData.payment_method,
        customer_notes: orderData.customer_notes,
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // Create order items
    const orderItems = orderData.cart_items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      quantity: item.quantity,
      size: item.size,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      // If order items fail, we should clean up the order
      await supabase.from("orders").delete().eq("id", order.id);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // Clear user's cart after successful order
    const { error: cartError } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", orderData.user_id);

    if (cartError) {
      console.warn("Failed to clear cart after order:", cartError.message);
      // Don't throw error here as order was successful
    }

    // Revalidate relevant paths
    revalidatePath("/orders");
    revalidatePath("/cart");

    return {
      success: true,
      order: order,
      message: "Order placed successfully!",
    };
  } catch (error) {
    console.error("Error in submitOrder:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit order",
    };
  }
}

export async function getUserOrders(userId: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          product:products(*)
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    return {
      success: true,
      orders: data || [],
    };
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
    };
  }
}

export async function getOrderById(orderId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          product:products(*)
        )
      `
      )
      .eq("id", orderId)
      .eq("user_id", userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch order: ${error.message}`);
    }

    return {
      success: true,
      order: data,
    };
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order",
    };
  }
}

export async function updateOrderStatus(
  orderId: string,
  userId: string,
  status: string,
  notes?: string
) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        status,
        admin_notes: notes,
        ...(status === "shipped" && { shipped_at: new Date().toISOString() }),
        ...(status === "delivered" && {
          delivered_at: new Date().toISOString(),
        }),
      })
      .eq("id", orderId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update order: ${error.message}`);
    }

    // Revalidate orders page
    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);

    return {
      success: true,
      order: data,
      message: "Order status updated successfully!",
    };
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update order status",
    };
  }
}

export async function cancelOrder(
  orderId: string,
  userId: string,
  reason?: string
) {
  try {
    // Only allow cancellation of pending orders
    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      throw new Error(`Order not found: ${fetchError.message}`);
    }

    if (existingOrder.status !== "pending") {
      throw new Error("Only pending orders can be cancelled");
    }

    const { data, error } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        admin_notes: reason || "Cancelled by customer",
      })
      .eq("id", orderId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }

    // Revalidate orders page
    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);

    return {
      success: true,
      order: data,
      message: "Order cancelled successfully!",
    };
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to cancel order",
    };
  }
}
