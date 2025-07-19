"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { ClimbingBoxLoader } from "react-spinners"
import { User, Package, LogOut } from "lucide-react"

export default function AccountPage() {
  const { isAuthenticated, customer, logout, loading } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClimbingBoxLoader color="#ffffff" speedMultiplier={2} />
      </div>
    )
  }

  if (!isAuthenticated || !customer) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8"></h1>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">My Account</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-secondary/30 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-xl">
                  {customer.firstName} {customer.lastName}
                </h2>
                <p className="text-muted-foreground text-sm">{customer.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#orders" className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-red-400" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Section */}
          <section id="profile" className="bg-secondary/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">First Name</h3>
                <p>{customer.firstName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Name</h3>
                <p>{customer.lastName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{customer.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <p>{customer.phone || "Not provided"}</p>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </div>
          </section>

          {/* Orders Section */}
          <section id="orders" className="bg-secondary/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order History</h2>
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">When you place an order, it will appear here.</p>
              <Button asChild>
                <a href="/shop">Start Shopping</a>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
