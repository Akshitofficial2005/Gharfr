// Payment Gateway Integration Service
import { AnalyticsService } from './analyticsService';

export interface PaymentOption {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet' | 'emi';
  icon: string;
  enabled: boolean;
  processingFee?: number; // percentage
}

export interface PaymentBreakdown {
  baseRent: number;
  accessoryCharges: number;
  platformFee: number;
  gst: number;
  processingFee: number;
  total: number;
}

export interface PaymentRequest {
  bookingId: string;
  studentId: string;
  pgId: string;
  amount: number;
  breakdown: PaymentBreakdown;
  paymentMethod: string;
  description: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  message: string;
  receiptUrl?: string;
}

class PaymentService {
  private static instance: PaymentService;
  private razorpayKey: string = process.env.REACT_APP_RAZORPAY_KEY || 'demo_key';
  private stripeKey: string = process.env.REACT_APP_STRIPE_KEY || 'demo_key';

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Get available payment options
  getPaymentOptions(): PaymentOption[] {
    return [
      {
        id: 'upi',
        name: 'UPI',
        type: 'upi',
        icon: '💳',
        enabled: true,
        processingFee: 0
      },
      {
        id: 'credit_card',
        name: 'Credit Card',
        type: 'credit_card',
        icon: '💳',
        enabled: true,
        processingFee: 2.5
      },
      {
        id: 'debit_card',
        name: 'Debit Card',
        type: 'debit_card',
        icon: '💳',
        enabled: true,
        processingFee: 1.5
      },
      {
        id: 'net_banking',
        name: 'Net Banking',
        type: 'net_banking',
        icon: '🏦',
        enabled: true,
        processingFee: 1.0
      },
      {
        id: 'paytm',
        name: 'Paytm Wallet',
        type: 'wallet',
        icon: '📱',
        enabled: true,
        processingFee: 0
      },
      {
        id: 'emi',
        name: 'EMI Options',
        type: 'emi',
        icon: '📊',
        enabled: true,
        processingFee: 3.0
      }
    ];
  }

  // Calculate payment breakdown
  calculateBreakdown(baseRent: number, accessories: number, platformFeePercent: number = 2): PaymentBreakdown {
    const subtotal = baseRent + accessories;
    const platformFee = Math.round((subtotal * platformFeePercent) / 100);
    const gst = Math.round(((subtotal + platformFee) * 18) / 100);
    const processingFee = 0; // Will be added based on payment method selection
    const total = subtotal + platformFee + gst + processingFee;

    return {
      baseRent,
      accessoryCharges: accessories,
      platformFee,
      gst,
      processingFee,
      total
    };
  }

  // Initiate Razorpay Payment
  async initiateRazorpayPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // In real implementation, this would call your backend API
      const options = {
        key: this.razorpayKey,
        amount: paymentRequest.amount * 100, // Razorpay expects amount in paisa
        currency: 'INR',
        name: 'Ghar PG',
        description: paymentRequest.description,
        order_id: `order_${paymentRequest.bookingId}`,
        handler: (response: any) => {
          return this.handlePaymentSuccess(response, paymentRequest);
        },
        prefill: {
          name: 'Student Name',
          email: 'student@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3B82F6'
        }
      };

      // Track payment initiation
      AnalyticsService.getInstance().track('payment_initiated', {
        bookingId: paymentRequest.bookingId,
        amount: paymentRequest.amount,
        method: 'razorpay'
      });

      // In real app, you would load Razorpay SDK and call:
      // const rzp = new window.Razorpay(options);
      // rzp.open();

      // For demo purposes, simulate success
      return this.simulatePayment(paymentRequest);

    } catch (error) {
      AnalyticsService.getInstance().track('payment_failed', {
        bookingId: paymentRequest.bookingId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        success: false,
        status: 'failed',
        message: 'Payment failed. Please try again.'
      };
    }
  }

  // Handle payment success
  private async handlePaymentSuccess(response: any, paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // In real implementation, verify payment with backend
      const verification = await this.verifyPayment(response.razorpay_payment_id, response.razorpay_order_id);
      
      if (verification.success) {
        AnalyticsService.getInstance().track('payment_completed', {
          bookingId: paymentRequest.bookingId,
          paymentId: response.razorpay_payment_id,
          amount: paymentRequest.amount
        });

        return {
          success: true,
          paymentId: response.razorpay_payment_id,
          transactionId: response.razorpay_order_id,
          status: 'completed',
          message: 'Payment successful!',
          receiptUrl: `/receipts/${response.razorpay_payment_id}`
        };
      }

      return {
        success: false,
        status: 'failed',
        message: 'Payment verification failed'
      };

    } catch (error) {
      return {
        success: false,
        status: 'failed',
        message: 'Payment processing error'
      };
    }
  }

  // Verify payment with backend
  private async verifyPayment(paymentId: string, orderId: string): Promise<{ success: boolean }> {
    // In real implementation, call backend verification API
    // For demo, always return success
    return { success: true };
  }

  // Simulate payment for demo
  private async simulatePayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 90% success rate for demo
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      const paymentId = `pay_${Date.now()}`;
      const transactionId = `txn_${Date.now()}`;

      AnalyticsService.getInstance().track('payment_completed', {
        bookingId: paymentRequest.bookingId,
        paymentId,
        amount: paymentRequest.amount
      });

      return {
        success: true,
        paymentId,
        transactionId,
        status: 'completed',
        message: 'Payment successful!',
        receiptUrl: `/receipts/${paymentId}`
      };
    } else {
      AnalyticsService.getInstance().track('payment_failed', {
        bookingId: paymentRequest.bookingId,
        error: 'Simulated failure'
      });

      return {
        success: false,
        status: 'failed',
        message: 'Payment failed. Please try again.'
      };
    }
  }

  // Generate GST-compliant receipt
  async generateReceipt(paymentId: string): Promise<string> {
    // In real implementation, generate PDF receipt
    // For demo, return a URL
    return `/api/receipts/${paymentId}`;
  }

  // Process refund
  async processRefund(paymentId: string, amount: number, reason: string): Promise<PaymentResponse> {
    try {
      // In real implementation, call payment gateway refund API
      AnalyticsService.getInstance().track('refund_initiated', {
        paymentId,
        amount,
        reason
      });

      // Simulate refund processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        paymentId: `rfnd_${Date.now()}`,
        status: 'completed',
        message: 'Refund processed successfully. It will reflect in 5-7 business days.'
      };

    } catch (error) {
      return {
        success: false,
        status: 'failed',
        message: 'Refund processing failed. Please contact support.'
      };
    }
  }

  // Set up auto-debit for monthly payments
  async setupAutoDebit(studentId: string, bankDetails: any): Promise<{ success: boolean; mandateId?: string }> {
    try {
      // In real implementation, integrate with NPCI Auto Debit
      AnalyticsService.getInstance().track('auto_debit_setup', {
        studentId
      });

      return {
        success: true,
        mandateId: `mandate_${Date.now()}`
      };

    } catch (error) {
      return {
        success: false
      };
    }
  }
}

export const paymentService = PaymentService.getInstance();
