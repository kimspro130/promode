"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthModal from "@/components/auth/auth-modal";
import FileUpload from "@/components/file-upload";
import { useSupabaseAuth } from "@/contexts/supabase-auth-context";
import { 
  Database, 
  Upload, 
  BarChart3, 
  Shield, 
  Chrome,
  Mail,
  Smartphone,
  Zap,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function DemoPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated } = useSupabaseAuth();

  const handleFileUpload = (url: string, path: string) => {
    toast.success(`File uploaded! URL: ${url.substring(0, 50)}...`);
  };

  const features = [
    {
      icon: Shield,
      title: "Authentication",
      description: "Email/password & Google OAuth with Supabase Auth",
      demo: "Click the user icon in navbar to try it!",
      color: "bg-blue-500",
    },
    {
      icon: Upload,
      title: "File Storage",
      description: "Upload files with supabase.storage.from('bucket').upload(...)",
      demo: "Try the file upload below",
      color: "bg-green-500",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Combine orders with Recharts to visualize sales",
      demo: "Visit /admin to see the dashboard",
      color: "bg-purple-500",
    },
    {
      icon: Database,
      title: "PostgreSQL Database",
      description: "Powered by Supabase with real-time capabilities",
      demo: "All data is stored securely",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">🚀 PROMODE Feature Demo</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience the power of Supabase with authentication, file storage, and analytics
        </p>
        
        {isAuthenticated ? (
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-500">
              Welcome, {user?.name || user?.email}!
            </span>
          </div>
        ) : (
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Try Authentication
          </Button>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${feature.color}`} />
            <CardHeader>
              <div className="flex items-center space-x-2">
                <feature.icon className="h-6 w-6" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
              <Badge variant="secondary" className="text-xs">
                {feature.demo}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Authentication Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Authentication Demo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email/Password Auth</span>
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Secure email/password registration</li>
                <li>• Email verification</li>
                <li>• Password reset functionality</li>
                <li>• Session management</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center space-x-2">
                <Chrome className="h-4 w-4" />
                <span>Google OAuth</span>
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• One-click Google sign-in</li>
                <li>• Automatic profile creation</li>
                <li>• Secure OAuth flow</li>
                <li>• Profile picture sync</li>
              </ul>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => setShowAuthModal(true)}
              variant="outline"
            >
              Try Authentication
            </Button>
            {isAuthenticated && (
              <Link href="/account">
                <Button variant="outline">
                  View Profile
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Storage Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>File Storage Demo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Upload files directly to Supabase Storage with drag & drop, progress tracking, and automatic URL generation.
          </p>
          
          <div className="bg-muted p-4 rounded-lg">
            <code className="text-sm">
              supabase.storage.from('demo').upload(path, file)
            </code>
          </div>
          
          <FileUpload
            bucket="demo"
            path="uploads"
            accept="image/*,application/pdf,.txt,.doc,.docx"
            maxSize={10}
            onUpload={handleFileUpload}
            onError={(error) => toast.error(error)}
            multiple={true}
            preview={true}
          />
        </CardContent>
      </Card>

      {/* Analytics Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Analytics Demo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Real-time sales analytics powered by Recharts with data from your Supabase database.
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">$12,345</div>
              <div className="text-blue-100">Total Revenue</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">156</div>
              <div className="text-green-100">Orders</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">89</div>
              <div className="text-purple-100">Customers</div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link href="/admin">
              <Button variant="outline">
                View Full Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline"
              onClick={() => toast.info("Analytics update every 5 minutes")}
            >
              <Zap className="h-4 w-4 mr-2" />
              Real-time Updates
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Responsive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Mobile-First Design</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            All features are optimized for mobile devices with touch-friendly interfaces and responsive layouts.
          </p>
          <Badge variant="outline">
            Try resizing your browser window!
          </Badge>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Tech Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold">Frontend</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Next.js 14 (App Router)</li>
                <li>• React 18</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• shadcn/ui components</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Backend</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Supabase (PostgreSQL)</li>
                <li>• Supabase Auth</li>
                <li>• Supabase Storage</li>
                <li>• Real-time subscriptions</li>
                <li>• Row Level Security</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Features</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Recharts analytics</li>
                <li>• React Hook Form</li>
                <li>• Zod validation</li>
                <li>• Sonner notifications</li>
                <li>• Mobile responsive</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
