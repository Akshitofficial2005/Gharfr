declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export class RazorpayService {
  private static instance: RazorpayService;
  private razorpayKey = 'rzp_test_1DP5mmOlF5G5ag'; // Test key

  static getInstance(): RazorpayService {
    if (!RazorpayService.instance) {
      RazorpayService.instance = new RazorpayService();
    }
    return RazorpayService.instance;
  }

  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async createOrder(amount: number, currency = 'INR'): Promise<any> {
    try {
      // In production, this should call your backend API
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Razorpay expects amount in paise
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      // Mock order for demo
      return {
        id: 'order_' + Date.now(),
        amount: amount * 100,
        currency,
        status: 'created'
      };
    }
  }

  async initiatePayment(options: {
    amount: number;
    pgName: string;
    bookingId: string;
    userDetails: {
      name: string;
      email: string;
      phone: string;
    };
    onSuccess: (response: any) => void;
    onFailure: (error: any) => void;
  }): Promise<void> {
    const scriptLoaded = await this.loadRazorpayScript();
    
    if (!scriptLoaded) {
      options.onFailure(new Error('Razorpay SDK failed to load'));
      return;
    }

    try {
      const order = await this.createOrder(options.amount);

      const razorpayOptions: RazorpayOptions = {
        key: this.razorpayKey,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Ghar - PG Booking',
        description: `Booking for ${options.pgName}`,
        order_id: order.id,
        handler: (response: any) => {
          this.verifyPayment(response)
            .then(() => options.onSuccess(response))
            .catch((error) => options.onFailure(error));
        },
        prefill: {
          name: options.userDetails.name,
          email: options.userDetails.email,
          contact: options.userDetails.phone,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: () => {
            options.onFailure(new Error('Payment cancelled by user'));
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (error) {
      options.onFailure(error);
    }
  }

  async verifyPayment(response: any): Promise<boolean> {
    try {
      // In production, verify payment signature on backend
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Payment verification failed');
      }

      return true;
    } catch (error) {
      // Mock verification for demo
      console.log('Payment verification (mock):', response);
      return true;
    }
  }
}

export default RazorpayService;