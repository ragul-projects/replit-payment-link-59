// Mock Payment Service - simulates real UPI payment functionality
import { PaymentData, CreatePaymentRequest } from '@/types';

class PaymentService {
  private payments: Map<string, PaymentData> = new Map();

  constructor() {
    // Load existing payments from localStorage
    const stored = localStorage.getItem('upi_payments');
    if (stored) {
      try {
        const paymentsArray = JSON.parse(stored);
        this.payments = new Map(paymentsArray);
      } catch (error) {
        console.error('Failed to load stored payments:', error);
      }
    }
  }

  private saveToStorage() {
    try {
      const paymentsArray = Array.from(this.payments.entries());
      localStorage.setItem('upi_payments', JSON.stringify(paymentsArray));
    } catch (error) {
      console.error('Failed to save payments:', error);
    }
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `UPI${timestamp.slice(-8)}${random}`;
  }

  private generateQRCode(upiLink: string): string {
    // In a real app, this would generate an actual QR code
    // For demo purposes, we'll create a simple base64 placeholder
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    canvas.width = 200;
    canvas.height = 200;
    
    // Create a simple pattern that looks like a QR code
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 200; i += 10) {
      for (let j = 0; j < 200; j += 10) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i, j, 8, 8);
        }
      }
    }
    
    // Add corner markers
    ctx.fillStyle = '#000000';
    ctx.fillRect(10, 10, 30, 30);
    ctx.fillRect(160, 10, 30, 30);
    ctx.fillRect(10, 160, 30, 30);
    
    return canvas.toDataURL().split(',')[1];
  }

  async createPayment(request: CreatePaymentRequest): Promise<PaymentData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const orderId = this.generateOrderId();
    const upiId = 'merchant@upi'; // Mock UPI ID
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(request.customerName)}&am=${request.amount}&cu=INR&tn=Payment%20for%20${encodeURIComponent(request.customerName)}&tr=${orderId}`;
    
    const payment: PaymentData = {
      orderId,
      amount: request.amount,
      customerName: request.customerName,
      email: request.email,
      qrCode: this.generateQRCode(upiLink),
      upiLink,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
    };

    this.payments.set(orderId, payment);
    this.saveToStorage();

    // Simulate random payment completion after some time
    setTimeout(() => {
      this.simulatePaymentUpdate(orderId);
    }, 5000 + Math.random() * 15000);

    return payment;
  }

  async getPaymentStatus(orderId: string): Promise<PaymentData | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    const payment = this.payments.get(orderId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }

  async getAllPayments(): Promise<PaymentData[]> {
    return Array.from(this.payments.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  private simulatePaymentUpdate(orderId: string) {
    const payment = this.payments.get(orderId);
    if (!payment || payment.status !== 'pending') return;

    // 80% chance of success, 20% chance of failure
    const isSuccess = Math.random() > 0.2;
    payment.status = isSuccess ? 'success' : 'failed';
    
    this.payments.set(orderId, payment);
    this.saveToStorage();

    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('paymentStatusUpdate', {
      detail: { orderId, status: payment.status }
    }));
  }

  // Method to manually trigger payment completion (for demo purposes)
  async completePayment(orderId: string, status: 'success' | 'failed' = 'success'): Promise<PaymentData> {
    const payment = this.payments.get(orderId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.status = status;
    this.payments.set(orderId, payment);
    this.saveToStorage();

    window.dispatchEvent(new CustomEvent('paymentStatusUpdate', {
      detail: { orderId, status }
    }));

    return payment;
  }
}

export const paymentService = new PaymentService();