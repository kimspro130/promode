"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Call Shopify API to request password reset
      const response = await fetch("https://akaal-thrifts.myshopify.com/api/2023-10/graphql.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": "88af2c78c31031b364d1d2d6cc5ddb45",
        },
        body: JSON.stringify({
          query: `
            mutation customerRecover($email: String!) {
              customerRecover(email: $email) {
                customerUserErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            email,
          },
        }),
      })

      const result = await response.json()

      if (result.data?.customerRecover?.customerUserErrors?.length > 0) {
        setError(result.data.customerRecover.customerUserErrors[0].message)
      } else {
        setIsSubmitted(true)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="container py-16 max-w-md">
        <div className="bg-secondary/30 rounded-lg p-8 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Password Reset Email Sent</h1>
          <p className="text-muted-foreground mb-6">
            If an account exists for {email}, you will receive a password reset email shortly.
          </p>
          <Button asChild>
            <Link href="/login">Return to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16 max-w-md">
      <h1 className="text-3xl md:text-4xl font-bold mb-8"></h1>
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Reset Password</h1>

      <div className="bg-secondary/30 rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200">{error}</div>}

          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="bg-background/50"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>

          <div className="text-center">
            <Link href="/login" className="text-primary hover:underline text-sm">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
