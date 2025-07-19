"use client";

import type React from "react";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { Toaster } from "@/components/ui/toast-provider";
import { Toaster as SonnerToaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <CartProvider>
        <WishlistProvider>
          {children}
          <Toaster />
          <SonnerToaster />
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
