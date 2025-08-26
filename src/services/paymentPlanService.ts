import type { PaymentPlansResponse } from '../context/PaymentFormContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface CalculatePaymentPlansRequest {
  principalAmount: number;
  customerName: string;
}

export interface CreatePaymentPlanRequest {
  selectedPlan: {
    duration: number;
    totalAmount: number;
    monthlyPayment: number;
    interestAmount: number;
  };
  customerName: string;
  email: string;
  phone: string;
  phoneExtension: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  routingNumber: string;
  accountNumber: string;
  bankName: string;
}

export interface CreatePaymentPlanResponse {
  success: boolean;
  data: {
    paymentPlanId: string;
    customerId: string;
    planDetails: {
      principalAmount: number;
      totalAmount: number;
      monthlyPayment: number;
      duration: number;
      interestRate: string;
      interestAmount: number;
      firstPaymentDate: string;
      lastPaymentDate: string;
    };
    message: string;
  };
}

export class PaymentPlanService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw new Error('API request failed: Unknown error');
    }
  }

  static async calculatePaymentPlans(
    request: CalculatePaymentPlansRequest
  ): Promise<PaymentPlansResponse> {
    const response = await this.makeRequest<{ success: boolean; data: PaymentPlansResponse }>(
      '/payment-plans/calculate',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    if (!response.success) {
      throw new Error('Failed to calculate payment plans');
    }

    return response.data;
  }

  static async createPaymentPlan(
    request: CreatePaymentPlanRequest
  ): Promise<CreatePaymentPlanResponse['data']> {
    const response = await this.makeRequest<CreatePaymentPlanResponse>(
      '/payment-plans',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    if (!response.success) {
      throw new Error('Failed to create payment plan');
    }

    return response.data;
  }
}
