"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ClimbingBoxLoader } from "react-spinners"

export default function VerifyEmailPage() {
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const { verifyEmail, resendVerificationCode, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/account")
    }
  }, [isAuthenticated, router])

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push("/signup")
    }
  }, [email, router])

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const result = await verifyEmail(email, verificationCode)
      if (result.success) {
        router.push("/account")
      } else {
        setError(result.error || "Verification failed. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    setError("")
    setIsSubmitting(true)

    try {
      const result = await resendVerificationCode(email)
      if (result.success) {
        setResendCooldown(60) // 60 second cooldown
        setError("") // Clear any previous errors
      } else {
        setError(result.error || "Failed to resend verification code.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClimbingBoxLoader color="#ffffff" speedMultiplier={2} />
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="container py-16 max-w-md">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Verify Your Email</h1>

      <div className="bg-secondary/30 rounded-lg p-8">
        <div className="mb-6 text-center">
          <p className="text-muted-foreground mb-2">We've sent a verification code to:</p>
          <p className="font-semibold">{email}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please check your email and enter the 6-digit code below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="verificationCode">Verification Code</Label>
            <Input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
              className="bg-background/50 text-center text-lg tracking-widest"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || verificationCode.length !== 6}>
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground mb-2">Didn't receive the code?</p>
          <Button
            variant="outline"
            onClick={handleResendCode}
            disabled={isSubmitting || resendCooldown > 0}
            className="w-full"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : isSubmitting ? "Sending..." : "Resend Code"}
          </Button>
        </div>
      </div>
    </div>
  )
}
