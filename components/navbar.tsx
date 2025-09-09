"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Shield,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const router = useRouter();

  // Mock user state since we're removing Clerk
  const user = null;
  const isSignedIn = false;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;

  if (!isClient) {
    return null;
  }

  return (
    <nav className="bg-black text-white border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl md:text-2xl font-bold text-white hover:text-green-400 transition-colors touch-target py-2 px-3 rounded-md"
            >
              PROMODE
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className="hover:text-green-400 transition-colors py-2 px-3 rounded-md touch-target"
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="hover:text-green-400 transition-colors py-2 px-3 rounded-md touch-target"
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="hover:text-green-400 transition-colors py-2 px-3 rounded-md touch-target"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="hover:text-green-400 transition-colors py-2 px-3 rounded-md touch-target"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-green-400 hover:bg-gray-800 relative"
              >
                <Heart className="h-5 w-5" />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-green-400 hover:bg-gray-800 relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-green-400 hover:bg-gray-800"
                title="Login"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-green-400 hover:bg-gray-800 touch-target min-h-[44px] min-w-[44px] p-3"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-4 pb-6 space-y-2 bg-gray-900 border-t border-gray-800 shadow-lg">
            <Link
              href="/"
              className="block px-4 py-3 text-white hover:text-green-400 hover:bg-gray-800 transition-colors rounded-md touch-target"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block px-4 py-3 text-white hover:text-green-400 hover:bg-gray-800 transition-colors rounded-md touch-target"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block px-4 py-3 text-white hover:text-green-400 hover:bg-gray-800 transition-colors rounded-md touch-target"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-3 text-white hover:text-green-400 hover:bg-gray-800 transition-colors rounded-md touch-target"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Icons */}
            <div className="flex items-center justify-center space-x-6 px-4 py-4 mt-4 border-t border-gray-800">
              <Link href="/wishlist" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:text-green-400 hover:bg-gray-800 relative touch-target min-h-[44px] min-w-[44px] p-3"
                  aria-label={`Wishlist (${wishlistItemCount} items)`}
                >
                  <Heart className="h-6 w-6" />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-black text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                      {wishlistItemCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:text-green-400 hover:bg-gray-800 relative touch-target min-h-[44px] min-w-[44px] p-3"
                  aria-label={`Cart (${cartItemCount} items)`}
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-black text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Link href="/account" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:text-green-400 hover:bg-gray-800 touch-target min-h-[44px] min-w-[44px] p-3"
                  aria-label="Account"
                >
                  <User className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
