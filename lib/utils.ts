import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Update the formatPrice function to ensure proper UGX formatting
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Helper function to strip HTML tags
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>?/gm, "")
}

// Generate a random order number
export function generateOrderNumber(): string {
  return `PROMODE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

// Format phone number for Ugandan numbers
export function formatPhoneNumber(phone: string): string {
  if (!phone) return ""

  // Remove all non-digit characters
  let cleanPhone = phone.replace(/\D/g, "")

  // Remove leading 0 if present
  if (cleanPhone.startsWith("0")) {
    cleanPhone = cleanPhone.slice(1)
  }

  // If it's a 9-digit Ugandan number, add country code
  if (cleanPhone.length === 9 && !cleanPhone.startsWith("256")) {
    return "+256" + cleanPhone
  }

  // If it already has country code but no +, add it
  if (cleanPhone.length === 12 && cleanPhone.startsWith("256")) {
    return "+" + cleanPhone
  }

  // If it already has + and country code, return as is
  if (cleanPhone.length === 9 || cleanPhone.length === 12) {
    return cleanPhone.startsWith("256") ? "+" + cleanPhone : "+256" + cleanPhone
  }

  // For any other format, try to make it work
  return cleanPhone.length >= 9 ? "+" + cleanPhone : ""
}
