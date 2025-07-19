import { NextRequest, NextResponse } from 'next/server';
import { pesapalClient } from '@/lib/pesapal';
import { createSupabaseBrowserClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderTrackingId = searchParams.get('OrderTrackingId');
    const merchantReference = searchParams.get('OrderMerchantReference');

    if (!orderTrackingId) {
      return NextResponse.redirect(
        new URL('/checkout/failed?error=missing_tracking_id', request.url)
      );
    }

    // Get transaction status from Pesapal
    const transactionStatus = await pesapalClient.getTransactionStatus(orderTrackingId);

    // Update order status in database
    const supabase = createSupabaseBrowserClient();
    
    if (transactionStatus.payment_status_description === 'Completed') {
      // Payment successful
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_method: 'pesapal',
          updated_at: new Date().toISOString()
        })
        .eq('id', merchantReference);

      return NextResponse.redirect(
        new URL(`/checkout/success?order=${merchantReference}`, request.url)
      );
    } else if (transactionStatus.payment_status_description === 'Failed') {
      // Payment failed
      await supabase
        .from('orders')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', merchantReference);

      return NextResponse.redirect(
        new URL('/checkout/failed?error=payment_failed', request.url)
      );
    } else {
      // Payment pending or other status
      return NextResponse.redirect(
        new URL(`/checkout/pending?order=${merchantReference}`, request.url)
      );
    }

  } catch (error) {
    console.error('Pesapal callback error:', error);
    return NextResponse.redirect(
      new URL('/checkout/failed?error=callback_error', request.url)
    );
  }
}

export async function POST(request: NextRequest) {
  // Handle IPN notifications
  try {
    const body = await request.json();
    const { OrderTrackingId, OrderMerchantReference } = body;

    if (!OrderTrackingId) {
      return NextResponse.json({ error: 'Missing OrderTrackingId' }, { status: 400 });
    }

    // Get transaction status
    const transactionStatus = await pesapalClient.getTransactionStatus(OrderTrackingId);

    // Update order in database
    const supabase = createSupabaseBrowserClient();
    
    let status = 'pending';
    if (transactionStatus.payment_status_description === 'Completed') {
      status = 'paid';
    } else if (transactionStatus.payment_status_description === 'Failed') {
      status = 'failed';
    }

    await supabase
      .from('orders')
      .update({
        status: status,
        payment_method: 'pesapal',
        updated_at: new Date().toISOString()
      })
      .eq('id', OrderMerchantReference);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Pesapal IPN error:', error);
    return NextResponse.json({ error: 'IPN processing failed' }, { status: 500 });
  }
}
