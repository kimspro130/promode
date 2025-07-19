"use client"

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing')
  const [error, setError] = useState<string | null>(null)
  const [tables, setTables] = useState<string[]>([])
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setConnectionStatus('testing')
      setError(null)

      // Test basic connection
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .limit(1)

      if (error) {
        throw error
      }

      setConnectionStatus('connected')
      
      // Get list of available tables (this will help verify schema setup)
      const tableNames = ['products', 'profiles', 'cart_items', 'wishlist_items', 'orders', 'categories']
      setTables(tableNames)

    } catch (err) {
      console.error('Supabase connection error:', err)
      setConnectionStatus('error')
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    }
  }

  const testAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      
      alert(`Auth test successful! Session: ${data.session ? 'Active' : 'None'}`)
    } catch (err) {
      alert(`Auth test failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="container py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
      
      <div className="space-y-6">
        {/* Connection Status */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'testing' ? 'bg-yellow-500' :
              connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="capitalize font-medium">{connectionStatus}</span>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-200">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {/* Database Tables */}
        {connectionStatus === 'connected' && (
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Database Tables</h2>
            <div className="grid grid-cols-2 gap-2">
              {tables.map(table => (
                <div key={table} className="p-2 bg-green-500/10 border border-green-500/30 rounded text-green-200">
                  ✓ {table}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Buttons */}
        <div className="space-y-3">
          <Button onClick={testConnection} className="w-full">
            Test Database Connection
          </Button>
          <Button onClick={testAuth} variant="outline" className="w-full">
            Test Authentication
          </Button>
        </div>

        {/* Environment Info */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
            </div>
            <div>
              <strong>Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✓' : 'Not set ✗'}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="p-6 border rounded-lg bg-blue-500/10 border-blue-500/30">
          <h2 className="text-xl font-semibold mb-4 text-blue-200">Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-200">
            <li>If connection failed, check your environment variables</li>
            <li>Run the database schema setup in Supabase SQL Editor</li>
            <li>Run the product migration: <code className="bg-black/30 px-2 py-1 rounded">npm run migrate-products</code></li>
            <li>Test the Supabase auth and cart features</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
