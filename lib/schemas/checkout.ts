import { z } from 'zod'

// Phone number validation regex (basic US format)
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/

// Postal code validation (US format)
const postalCodeRegex = /^\d{5}(-\d{4})?$/

export const addressSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Full name contains invalid characters'),
  
  address_line_1: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters'),
  
  address_line_2: z
    .string()
    .max(200, 'Address line 2 must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'City contains invalid characters'),
  
  state: z
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'State contains invalid characters'),
  
  postal_code: z
    .string()
    .regex(postalCodeRegex, 'Please enter a valid postal code (e.g., 12345 or 12345-6789)'),
  
  country: z
    .string()
    .min(2, 'Country is required')
    .default('US'),
  
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || phoneRegex.test(val.replace(/[\s\-\(\)]/g, '')),
      'Please enter a valid phone number'
    )
})

export const cartItemSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  product_name: z.string().min(1, 'Product name is required'),
  product_image: z.string().url('Invalid product image URL'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  size: z.string().min(1, 'Size is required'),
  unit_price: z.number().positive('Price must be positive')
})

export const checkoutSchema = z.object({
  shipping_address: addressSchema,
  
  billing_address: addressSchema.optional(),
  
  use_same_address: z.boolean().default(true),
  
  payment_method: z.enum(['credit_card', 'paypal', 'cash_on_delivery'], {
    errorMap: () => ({ message: 'Please select a valid payment method' })
  }).default('credit_card'),
  
  customer_notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .or(z.literal(''))
})

export const orderSubmissionSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  shipping_address: addressSchema,
  billing_address: addressSchema.optional(),
  payment_method: z.enum(['credit_card', 'paypal', 'cash_on_delivery']),
  customer_notes: z.string().optional(),
  cart_items: z.array(cartItemSchema).min(1, 'Cart cannot be empty')
})

// Type exports
export type AddressData = z.infer<typeof addressSchema>
export type CartItemData = z.infer<typeof cartItemSchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>
export type OrderSubmissionData = z.infer<typeof orderSubmissionSchema>

// Validation helpers
export const validateAddress = (address: unknown) => {
  return addressSchema.safeParse(address)
}

export const validateCheckoutForm = (data: unknown) => {
  return checkoutSchema.safeParse(data)
}

export const validateOrderSubmission = (data: unknown) => {
  return orderSubmissionSchema.safeParse(data)
}

// Custom validation functions
export const validateCartItems = (items: unknown[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    return { success: false, error: 'Cart cannot be empty' }
  }

  for (const item of items) {
    const result = cartItemSchema.safeParse(item)
    if (!result.success) {
      return { 
        success: false, 
        error: `Invalid cart item: ${result.error.issues[0].message}` 
      }
    }
  }

  return { success: true }
}

export const validateTotalAmount = (items: CartItemData[], expectedTotal: number) => {
  const calculatedTotal = items.reduce(
    (sum, item) => sum + (item.unit_price * item.quantity), 
    0
  )
  
  const tolerance = 0.01 // Allow for small floating point differences
  
  if (Math.abs(calculatedTotal - expectedTotal) > tolerance) {
    return {
      success: false,
      error: `Total amount mismatch. Expected: ${expectedTotal}, Calculated: ${calculatedTotal}`
    }
  }
  
  return { success: true }
}

// Error formatting helper
export const formatValidationErrors = (errors: z.ZodError) => {
  return errors.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message
  }))
}
