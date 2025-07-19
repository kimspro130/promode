import axios from 'axios';
import crypto from 'crypto';

interface PesapalConfig {
  consumerKey: string;
  consumerSecret: string;
  environment: 'sandbox' | 'production';
}

interface PaymentRequest {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  notification_id: string;
  billing_address: {
    email_address: string;
    phone_number: string;
    country_code: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    line_1: string;
    line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    zip_code: string;
  };
}

interface PesapalResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error?: {
    error_type: string;
    code: string;
    message: string;
    call_back_url: string;
  };
}

class PesapalClient {
  private config: PesapalConfig;
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(config: PesapalConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'sandbox' 
      ? 'https://cybqa.pesapal.com/pesapalv3/api'
      : 'https://pay.pesapal.com/v3/api';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(`${this.baseUrl}/Auth/RequestToken`, {
        consumer_key: this.config.consumerKey,
        consumer_secret: this.config.consumerSecret
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      this.accessToken = response.data.token;
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Pesapal access token:', error);
      throw new Error('Failed to authenticate with Pesapal');
    }
  }

  async registerIPN(url: string): Promise<string> {
    const token = await this.getAccessToken();
    
    try {
      const response = await axios.post(`${this.baseUrl}/URLSetup/RegisterIPN`, {
        url: url,
        ipn_notification_type: 'GET'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      return response.data.ipn_id;
    } catch (error) {
      console.error('Error registering IPN:', error);
      throw new Error('Failed to register IPN with Pesapal');
    }
  }

  async submitOrderRequest(paymentData: PaymentRequest): Promise<PesapalResponse> {
    const token = await this.getAccessToken();
    
    try {
      const response = await axios.post(`${this.baseUrl}/Transactions/SubmitOrderRequest`, paymentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error submitting order request:', error);
      throw new Error('Failed to submit order to Pesapal');
    }
  }

  async getTransactionStatus(orderTrackingId: string): Promise<any> {
    const token = await this.getAccessToken();
    
    try {
      const response = await axios.get(`${this.baseUrl}/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw new Error('Failed to get transaction status from Pesapal');
    }
  }
}

// Initialize Pesapal client
export const pesapalClient = new PesapalClient({
  consumerKey: process.env.PESAPAL_CONSUMER_KEY || '',
  consumerSecret: process.env.PESAPAL_CONSUMER_SECRET || '',
  environment: (process.env.PESAPAL_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
});

export type { PaymentRequest, PesapalResponse };
