"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      toast.success('Payment successful!');
      // You can fetch order details here if needed
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          <p className="text-muted-foreground">
            Your payment has been processed successfully
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {orderId && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm font-medium">{orderId}</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Payment confirmed</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Package className="h-4 w-4 text-blue-600" />
              <span>Order is being processed</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <span className="text-muted-foreground">You will receive an email confirmation shortly</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/orders" className="w-full">
              <Button className="w-full">
                View Order Details
              </Button>
            </Link>
            
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Thank you for your purchase! If you have any questions, please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
