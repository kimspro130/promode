"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ClimbingBoxLoader } from "react-spinners"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/account")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        router.push("/account")
      } else {
        setError(result.error || "Login failed. Please check your credentials.")
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

  // If already authenticated, don't render the form
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="container py-8 md:py-16 px-4 max-w-md mx-auto">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center">Login</h1>

      <div className="bg-secondary/30 rounded-lg p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {error && (
            <div className="p-3 md:p-4 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm md:text-base">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm md:text-base">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-12 md:h-10 text-base md:text-sm touch-target"
              autoComplete="email"
              inputMode="email"
              required
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-sm md:text-base">Password</Label>
              <Link href="/forgot-password" className="text-xs md:text-sm text-primary hover:underline touch-target py-1">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background/50 pr-12 h-12 md:h-10 text-base md:text-sm touch-target"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground touch-target p-2 -m-2"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} className="md:w-[18px] md:h-[18px]" /> : <Eye size={20} className="md:w-[18px] md:h-[18px]" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 md:h-10 text-base md:text-sm touch-target"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-4 md:mt-6 text-center">
          <p className="text-muted-foreground text-sm md:text-base">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline touch-target py-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
