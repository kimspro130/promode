"use client";

import { useState } from "react";
import { useSupabaseAuth } from "@/contexts/supabase-auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SalesDashboard from "@/components/analytics/sales-dashboard";
import FileUpload from "@/components/file-upload";
import AuthModal from "@/components/auth/auth-modal";
import { 
  BarChart3, 
  Upload, 
  Users, 
  Settings, 
  Shield,
  Database,
  Image as ImageIcon,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");

  // Mock admin check - in a real app, you'd check user roles
  const isAdmin = user?.email?.includes('admin') || user?.email?.includes('test');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle>Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please sign in to access the admin dashboard
            </p>
            <Button onClick={() => setShowAuthModal(true)} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
        
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              You don't have permission to access this area.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileUpload = (url: string, path: string) => {
    toast.success(`File uploaded successfully! URL: ${url}`);
    console.log('Uploaded file:', { url, path });
  };

  const handleUploadError = (error: string) => {
    toast.error(`Upload failed: ${error}`);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || user?.email}
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Shield className="h-3 w-3" />
          <span>Admin</span>
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Real-time</div>
            <p className="text-xs text-muted-foreground">
              Sales & performance data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">File Storage</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Supabase</div>
            <p className="text-xs text-muted-foreground">
              Secure file uploads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authentication</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">OAuth</div>
            <p className="text-xs text-muted-foreground">
              Email & Google auth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PostgreSQL</div>
            <p className="text-xs text-muted-foreground">
              Powered by Supabase
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4" />
            <span>File Storage</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <SalesDashboard />
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Product Images Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload product images to the 'products' bucket
                </p>
              </CardHeader>
              <CardContent>
                <FileUpload
                  bucket="products"
                  path="images"
                  accept="image/*"
                  maxSize={10}
                  onUpload={handleFileUpload}
                  onError={handleUploadError}
                  multiple={true}
                  preview={true}
                />
              </CardContent>
            </Card>

            {/* User Avatars Upload */}
            <Card>
              <CardHeader>
                <CardTitle>User Avatars</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload user profile pictures to the 'avatars' bucket
                </p>
              </CardHeader>
              <CardContent>
                <FileUpload
                  bucket="avatars"
                  path="profiles"
                  accept="image/*"
                  maxSize={5}
                  onUpload={handleFileUpload}
                  onError={handleUploadError}
                  multiple={false}
                  preview={true}
                />
              </CardContent>
            </Card>

            {/* Documents Upload */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Documents & Files</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload any type of file to the 'documents' bucket
                </p>
              </CardHeader>
              <CardContent>
                <FileUpload
                  bucket="documents"
                  path="uploads"
                  accept="*/*"
                  maxSize={50}
                  onUpload={handleFileUpload}
                  onError={handleUploadError}
                  multiple={true}
                  preview={false}
                />
              </CardContent>
            </Card>
          </div>

          {/* Storage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Storage Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Supabase Storage Buckets</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Make sure you have created these buckets in your Supabase dashboard:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• <code className="bg-background px-1 rounded">products</code> - For product images</li>
                  <li>• <code className="bg-background px-1 rounded">avatars</code> - For user profile pictures</li>
                  <li>• <code className="bg-background px-1 rounded">documents</code> - For general file uploads</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Usage Examples</h4>
                <div className="text-sm space-y-2">
                  <p>
                    <strong>Upload:</strong> <code>supabase.storage.from('bucket').upload(path, file)</code>
                  </p>
                  <p>
                    <strong>Get URL:</strong> <code>supabase.storage.from('bucket').getPublicUrl(path)</code>
                  </p>
                  <p>
                    <strong>Delete:</strong> <code>supabase.storage.from('bucket').remove([path])</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Current User</h4>
                  <p className="text-sm text-muted-foreground">
                    Email: {user?.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Name: {user?.name || 'Not set'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ID: {user?.id}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Available Auth Methods</h4>
                  <ul className="text-sm space-y-1">
                    <li>✅ Email/Password authentication</li>
                    <li>✅ Google OAuth</li>
                    <li>✅ Session management</li>
                    <li>✅ Profile management</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Features Enabled</h4>
                  <ul className="text-sm space-y-1">
                    <li>✅ Real-time analytics with Recharts</li>
                    <li>✅ File upload with Supabase Storage</li>
                    <li>✅ Authentication with Supabase Auth</li>
                    <li>✅ PostgreSQL database</li>
                    <li>✅ Mobile-responsive design</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Tech Stack</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Next.js 14 with App Router</li>
                    <li>• Supabase (Auth, Database, Storage)</li>
                    <li>• Recharts for analytics</li>
                    <li>• Tailwind CSS + shadcn/ui</li>
                    <li>• TypeScript</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
