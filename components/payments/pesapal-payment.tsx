"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, CreditCard, Smartphone, Building } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

const paymentSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PesapalPaymentProps {
  amount: number;
  currency?: string;
  orderId: string;
  description?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export default function PesapalPayment({
  amount,
  currency = 'KES',
  orderId,
  description,
  onSuccess,
  onError
}: PesapalPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      customerName: user?.fullName || '',
      customerEmail: user?.emailAddresses?.[0]?.emailAddress || '',
      customerPhone: user?.phoneNumbers?.[0]?.phoneNumber || '',
    }
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handlePayment = async (data: PaymentFormData) => {
    setIsProcessing(true);

    try {
      const response = await fetch('/api/payments/pesapal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
          orderId,
          ...data
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Payment failed');
      }

      if (result.success && result.redirect_url) {
        toast.success('Redirecting to Pesapal...');
        
        // Redirect to Pesapal payment page
        window.location.href = result.redirect_url;
        
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        throw new Error('Invalid response from payment gateway');
      }

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast.error(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pay with Pesapal
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Secure payment powered by Pesapal
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Payment Amount */}
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Amount to Pay</p>
          <p className="text-2xl font-bold text-primary">
            {formatAmount(amount)}
          </p>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="flex flex-col items-center gap-1 p-2 border rounded">
            <Smartphone className="h-4 w-4" />
            <span>M-Pesa</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 border rounded">
            <CreditCard className="h-4 w-4" />
            <span>Cards</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 border rounded">
            <Building className="h-4 w-4" />
            <span>Banks</span>
          </div>
        </div>

        {/* Customer Information Form */}
        <form onSubmit={handleSubmit(handlePayment)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Full Name</Label>
            <Input
              id="customerName"
              {...register('customerName')}
              placeholder="Enter your full name"
              disabled={isProcessing}
            />
            {errors.customerName && (
              <p className="text-sm text-destructive">{errors.customerName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email Address</Label>
            <Input
              id="customerEmail"
              type="email"
              {...register('customerEmail')}
              placeholder="Enter your email"
              disabled={isProcessing}
            />
            {errors.customerEmail && (
              <p className="text-sm text-destructive">{errors.customerEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input
              id="customerPhone"
              {...register('customerPhone')}
              placeholder="e.g., +254700000000"
              disabled={isProcessing}
            />
            {errors.customerPhone && (
              <p className="text-sm text-destructive">{errors.customerPhone.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isProcessing}
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay {formatAmount(amount)}
              </>
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center">
          You will be redirected to Pesapal to complete your payment securely.
        </p>
      </CardContent>
    </Card>
  );
}
