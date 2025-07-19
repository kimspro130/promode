"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface CheckResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export default function SetupCheck() {
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const runChecks = async () => {
    setIsLoading(true);
    const results: CheckResult[] = [];

    // 1. Check Supabase connection
    try {
      const { data, error } = await supabase.from('products').select('count').limit(1);
      if (error) throw error;
      results.push({
        name: 'Supabase Connection',
        status: 'success',
        message: 'Connected successfully',
        details: 'Database connection is working'
      });
    } catch (error) {
      results.push({
        name: 'Supabase Connection',
        status: 'error',
        message: 'Connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // 2. Check products table
    try {
      const { data, error } = await supabase.from('products').select('*').limit(5);
      if (error) throw error;
      results.push({
        name: 'Products Table',
        status: 'success',
        message: `Found ${data?.length || 0} products`,
        details: 'Products table is accessible'
      });
    } catch (error) {
      results.push({
        name: 'Products Table',
        status: 'error',
        message: 'Table not accessible',
        details: 'Run the database setup script'
      });
    }

    // 3. Check profiles table
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) throw error;
      results.push({
        name: 'Profiles Table',
        status: 'success',
        message: 'Table exists',
        details: 'User profiles table is ready'
      });
    } catch (error) {
      results.push({
        name: 'Profiles Table',
        status: 'error',
        message: 'Table missing',
        details: 'Run the database setup script'
      });
    }

    // 4. Check orders table
    try {
      const { data, error } = await supabase.from('orders').select('count').limit(1);
      if (error) throw error;
      results.push({
        name: 'Orders Table',
        status: 'success',
        message: 'Table exists',
        details: 'Orders table is ready for analytics'
      });
    } catch (error) {
      results.push({
        name: 'Orders Table',
        status: 'error',
        message: 'Table missing',
        details: 'Run the database setup script'
      });
    }

    // 5. Check storage buckets
    const buckets = ['products', 'avatars', 'demo', 'documents'];
    for (const bucket of buckets) {
      try {
        const { data, error } = await supabase.storage.from(bucket).list('', { limit: 1 });
        if (error) throw error;
        results.push({
          name: `Storage: ${bucket}`,
          status: 'success',
          message: 'Bucket accessible',
          details: `${bucket} bucket is ready for uploads`
        });
      } catch (error) {
        results.push({
          name: `Storage: ${bucket}`,
          status: 'error',
          message: 'Bucket not found',
          details: `Create the '${bucket}' bucket in Supabase Storage`
        });
      }
    }

    // 6. Check authentication
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        results.push({
          name: 'Authentication',
          status: 'success',
          message: 'User authenticated',
          details: `Logged in as ${session.user.email}`
        });
      } else {
        results.push({
          name: 'Authentication',
          status: 'warning',
          message: 'Not authenticated',
          details: 'Sign in to test full functionality'
        });
      }
    } catch (error) {
      results.push({
        name: 'Authentication',
        status: 'error',
        message: 'Auth error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // 7. Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    let envVarsOk = true;
    const missingVars: string[] = [];

    requiredEnvVars.forEach(varName => {
      if (!process.env[varName]) {
        envVarsOk = false;
        missingVars.push(varName);
      }
    });

    if (envVarsOk) {
      results.push({
        name: 'Environment Variables',
        status: 'success',
        message: 'All required vars set',
        details: 'Supabase configuration is complete'
      });
    } else {
      results.push({
        name: 'Environment Variables',
        status: 'error',
        message: 'Missing variables',
        details: `Missing: ${missingVars.join(', ')}`
      });
    }

    setChecks(results);
    setIsLoading(false);

    // Show summary toast
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    if (errorCount === 0) {
      toast.success(`All ${successCount} checks passed! 🎉`);
    } else {
      toast.error(`${errorCount} issues found. Check the details below.`);
    }
  };

  useEffect(() => {
    runChecks();
  }, []);

  const getStatusIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: CheckResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const successCount = checks.filter(c => c.status === 'success').length;
  const errorCount = checks.filter(c => c.status === 'error').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">🔧 Setup Verification</h1>
        <p className="text-muted-foreground">
          Checking your Supabase configuration and database setup
        </p>
        
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="outline" className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>{successCount} Passed</span>
          </Badge>
          {errorCount > 0 && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <XCircle className="h-3 w-3 text-red-500" />
              <span>{errorCount} Failed</span>
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <AlertCircle className="h-3 w-3 text-yellow-500" />
              <span>{warningCount} Warnings</span>
            </Badge>
          )}
        </div>

        <Button 
          onClick={runChecks} 
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Re-run Checks</span>
        </Button>
      </div>

      {/* Setup Instructions */}
      {errorCount > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">
              Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Some components need to be set up. Follow these steps:
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="font-semibold">1. Database Setup:</div>
              <div className="bg-muted p-3 rounded-lg">
                <p>Copy and run the SQL script in your Supabase SQL Editor:</p>
                <code className="text-xs">scripts/setup-database.sql</code>
              </div>
              
              <div className="font-semibold">2. Storage Buckets:</div>
              <div className="bg-muted p-3 rounded-lg">
                <p>Create these buckets in Supabase Storage:</p>
                <ul className="text-xs space-y-1 mt-1">
                  <li>• products (public, 10MB limit)</li>
                  <li>• avatars (public, 5MB limit)</li>
                  <li>• demo (public, 10MB limit)</li>
                  <li>• documents (public, 50MB limit)</li>
                </ul>
              </div>
              
              <div className="font-semibold">3. Authentication:</div>
              <div className="bg-muted p-3 rounded-lg">
                <p>Enable providers in Supabase Auth settings:</p>
                <ul className="text-xs space-y-1 mt-1">
                  <li>• Email provider</li>
                  <li>• Google OAuth (optional)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Check Results */}
      <div className="grid gap-4 md:grid-cols-2">
        {checks.map((check, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center space-x-2">
                  {getStatusIcon(check.status)}
                  <span>{check.name}</span>
                </CardTitle>
                <Badge className={getStatusColor(check.status)}>
                  {check.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium mb-1">{check.message}</p>
              <p className="text-xs text-muted-foreground">{check.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Success Message */}
      {errorCount === 0 && checks.length > 0 && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                🎉 Setup Complete!
              </h3>
              <p className="text-green-600 dark:text-green-400">
                All systems are working correctly. Your PROMODE platform is ready!
              </p>
              <div className="flex justify-center space-x-2 pt-4">
                <Button asChild variant="outline">
                  <a href="/demo">Try Demo</a>
                </Button>
                <Button asChild>
                  <a href="/admin">Admin Dashboard</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentation Link */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              Check the complete setup guide for detailed instructions
            </p>
            <Button variant="outline" asChild>
              <a href="/docs/supabase-setup.md" target="_blank">
                View Setup Guide
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
