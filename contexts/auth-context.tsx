"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { sendEmail, generateVerificationEmail } from "@/lib/email-service"

// Define the shape of our user object
export interface User {
  id?: string
  email: string
  name: string
  picture?: string
  isAuthenticated: boolean
  isVerified: boolean
}

// Define the shape of our auth context
interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>
  logout: () => void
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string }>
  resendVerificationCode: (email: string) => Promise<{ success: boolean; error?: string }>
  isAuthenticated: boolean
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Mock database for storing users and verification codes
const mockUsers: Record<
  string,
  {
    id: string
    name: string
    email: string
    password: string
    isVerified: boolean
    verificationCode?: string
    verificationExpiry?: number
  }
> = {}

// Generate random verification code
const generateVerificationCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Mock API calls for authentication
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers[email.toLowerCase()]

  if (!user || user.password !== password) {
    throw new Error("Invalid credentials")
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email address before logging in")
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isAuthenticated: true,
    isVerified: true,
  }
}

const mockSignup = async (
  name: string,
  email: string,
  password: string,
): Promise<{ user: User; needsVerification: boolean }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const emailLower = email.toLowerCase()

  if (mockUsers[emailLower]) {
    throw new Error("User already exists with this email")
  }

  const verificationCode = generateVerificationCode()
  const verificationExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes

  // Create user
  const newUser = {
    id: Date.now().toString(),
    name,
    email: emailLower,
    password,
    isVerified: false,
    verificationCode,
    verificationExpiry,
  }

  mockUsers[emailLower] = newUser

  // Send verification email
  try {
    const emailData = {
      to: email,
      subject: "Verify your PROMODE account",
      html: generateVerificationEmail(name, verificationCode, email),
      customerName: name,
    }

    const emailSent = await sendEmail(emailData)

    if (!emailSent) {
      console.warn("Failed to send verification email, but user was created")
    }
  } catch (error) {
    console.error("Error sending verification email:", error)
    // Don't fail signup if email fails, just log the error
  }

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      isAuthenticated: false,
      isVerified: false,
    },
    needsVerification: true,
  }
}

const mockVerifyEmail = async (email: string, code: string): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers[email.toLowerCase()]

  if (!user) {
    throw new Error("User not found")
  }

  if (!user.verificationCode || !user.verificationExpiry) {
    throw new Error("No verification code found")
  }

  if (Date.now() > user.verificationExpiry) {
    throw new Error("Verification code has expired")
  }

  if (user.verificationCode !== code.toUpperCase()) {
    throw new Error("Invalid verification code")
  }

  // Mark user as verified
  user.isVerified = true
  user.verificationCode = undefined
  user.verificationExpiry = undefined

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isAuthenticated: true,
    isVerified: true,
  }
}

const mockResendVerificationCode = async (email: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers[email.toLowerCase()]

  if (!user) {
    throw new Error("User not found")
  }

  if (user.isVerified) {
    throw new Error("User is already verified")
  }

  const verificationCode = generateVerificationCode()
  const verificationExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes

  user.verificationCode = verificationCode
  user.verificationExpiry = verificationExpiry

  // Send verification email
  const emailData = {
    to: user.email,
    subject: "Verify your PROMODE account",
    html: generateVerificationEmail(user.name, verificationCode, user.email),
    customerName: user.name,
  }

  const emailSent = await sendEmail(emailData)

  if (!emailSent) {
    throw new Error("Failed to send verification email")
  }
}

const mockForgotPassword = async (email: string): Promise<void> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you would send a password reset email
  if (!email.includes("@")) {
    throw new Error("Invalid email address")
  }
}

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          // Only set user if they are verified
          if (parsedUser.isVerified) {
            setUser(parsedUser)
          }
        }
      } catch (err) {
        console.error("Error checking authentication status:", err)
      } finally {
        setIsLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    setError(null)
    try {
      const loggedInUser = await mockLogin(email, password)
      setUser(loggedInUser)
      localStorage.setItem("user", JSON.stringify(loggedInUser))
      return { success: true }
    } catch (err: any) {
      setError(err.message || "Failed to login")
      return { success: false, error: err.message || "Failed to login" }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; needsVerification?: boolean }> => {
    setIsLoading(true)
    setError(null)
    try {
      const { user: newUser, needsVerification } = await mockSignup(name, email, password)
      // Don't set user in state until they verify their email
      return { success: true, needsVerification }
    } catch (err: any) {
      setError(err.message || "Failed to sign up")
      return { success: false, error: err.message || "Failed to sign up" }
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmail = async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    setError(null)
    try {
      const verifiedUser = await mockVerifyEmail(email, code)
      setUser(verifiedUser)
      localStorage.setItem("user", JSON.stringify(verifiedUser))
      return { success: true }
    } catch (err: any) {
      setError(err.message || "Failed to verify email")
      return { success: false, error: err.message || "Failed to verify email" }
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerificationCode = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    setError(null)
    try {
      await mockResendVerificationCode(email)
      return { success: true }
    } catch (err: any) {
      setError(err.message || "Failed to resend verification code")
      return { success: false, error: err.message || "Failed to resend verification code" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    setError(null)
    try {
      await mockForgotPassword(email)
      return { success: true }
    } catch (err: any) {
      setError(err.message || "Failed to process password reset")
      return { success: false, error: err.message || "Failed to process password reset" }
    } finally {
      setIsLoading(false)
    }
  }

  // Make the auth object available to any child component that calls useAuth()
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        signup,
        logout,
        forgotPassword,
        verifyEmail,
        resendVerificationCode,
        isAuthenticated: !!user && user.isVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
