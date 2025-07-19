import { NextRequest, NextResponse } from 'next/server';
import { pesapalClient } from '@/lib/pesapal';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      amount,
      currency = 'KES',
      description,
      customerEmail,
      customerPhone,
      customerName,
      orderId
    } = body;

    // Validate required fields
    if (!amount || !customerEmail || !customerName || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Split customer name
    const nameParts = customerName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Prepare payment request
    const paymentRequest = {
      id: orderId,
      currency: currency,
      amount: parseFloat(amount),
      description: description || `Payment for order ${orderId}`,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/pesapal/callback`,
      notification_id: process.env.PESAPAL_IPN_ID || '',
      billing_address: {
        email_address: customerEmail,
        phone_number: customerPhone || '',
        country_code: 'KE',
        first_name: firstName,
        last_name: lastName,
        line_1: 'N/A',
        city: 'Nairobi',
        state: 'Nairobi',
        postal_code: '00100',
        zip_code: '00100'
      }
    };

    // Submit order to Pesapal
    const pesapalResponse = await pesapalClient.submitOrderRequest(paymentRequest);

    if (pesapalResponse.error) {
      return NextResponse.json(
        { error: pesapalResponse.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      order_tracking_id: pesapalResponse.order_tracking_id,
      redirect_url: pesapalResponse.redirect_url,
      merchant_reference: pesapalResponse.merchant_reference
    });

  } catch (error) {
    console.error('Pesapal payment error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}
