"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'payment_failed':
        return 'Your payment could not be processed. Please try again.';
      case 'missing_tracking_id':
        return 'Payment tracking information is missing.';
      case 'callback_error':
        return 'There was an error processing your payment callback.';
      default:
        return 'An unexpected error occurred during payment processing.';
    }
  };

  useEffect(() => {
    toast.error('Payment failed');
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
          <p className="text-muted-foreground">
            {getErrorMessage(error)}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>What happened?</strong><br />
              Your payment was not completed successfully. This could be due to:
            </p>
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
              <li>Insufficient funds</li>
              <li>Network connectivity issues</li>
              <li>Payment method declined</li>
              <li>Session timeout</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/checkout-v2" className="w-full">
              <Button className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Payment Again
              </Button>
            </Link>
            
            <Link href="/cart" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
              </Button>
            </Link>
            
            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              If you continue to experience issues, please contact our support team for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
