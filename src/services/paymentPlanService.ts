import type { PaymentPlansResponse } from '../context/PaymentFormContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface CalculatePaymentPlansRequest {
  principalAmount: number;
  customerName: string;
  upfrontPayment?: number;
}

export interface CreatePaymentPlanRequest {
  selectedPlan: {
    duration: number;
    totalAmount: number;
    monthlyPayment: number;
    interestAmount: number;
    upfrontPayment: number;
    remainingAmount: number;
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
      upfrontPayment: number;
      remainingAmount: number;
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
      '/payment-plans?testMode=true',
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

  static async createPaymentPlanWithFiles(
    formData: FormData
  ): Promise<CreatePaymentPlanResponse['data']> {
    const url = `${API_BASE_URL}/payment-plans?testMode=true`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Don't set Content-Type header - let browser set it with boundary
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json() as CreatePaymentPlanResponse;
      
      if (!result.success) {
        throw new Error('Failed to create payment plan');
      }

      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw new Error('API request failed: Unknown error');
    }
  }

  static async processFullPayment(
    formData: FormData
  ): Promise<CreatePaymentPlanResponse['data']> {
    const url = `${API_BASE_URL}/payment-plans/full-payment?testMode=true`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Don't set Content-Type header - let browser set it with boundary
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json() as CreatePaymentPlanResponse;
      
      if (!result.success) {
        throw new Error('Failed to process full payment');
      }

      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw new Error('API request failed: Unknown error');
    }
  }

  static async getPlanDetails(planId: string): Promise<PlanDetailsResponse> {
    const response = await this.makeRequest<{ success: boolean; data: PlanDetailsResponse }>(
      `/payment-plans/${planId}/details`
    );

    if (!response.success) {
      throw new Error('Failed to fetch plan details');
    }

    return response.data;
  }

  static async getPlanSchedule(planId: string): Promise<PaymentScheduleResponse> {
    const response = await this.makeRequest<{ success: boolean; data: PaymentScheduleResponse }>(
      `/payment-plans/${planId}/schedule`
    );

    if (!response.success) {
      throw new Error('Failed to fetch payment schedule');
    }

    return response.data;
  }

  static async getAllPaymentPlans(page: number = 1, limit: number = 100): Promise<PaymentPlansListResponse> {
    const response = await this.makeRequest<PaymentPlansListResponse>(
      `/payment-plans?page=${page}&limit=${limit}`
    );

    if (!response.success) {
      throw new Error('Failed to fetch payment plans');
    }

    return response;
  }
}

// Types for plan details and schedule
export interface PlanDetailsResponse {
  paymentPlan: {
    id: string;
    customer: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    };
    principalAmount: number;
    totalAmount: number;
    monthlyPayment: number;
    duration: number;
    completedPayments: number;
    remainingBalance: number;
    status: 'active' | 'completed' | 'defaulted';
    startDate: string;
    endDate: string;
    upfrontPayment: number;
    remainingAmount: number;
  };
  paymentSchedule: Array<{
    id: string;
    sequenceNumber: number;
    scheduledDate: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    processedDate?: string;
    failureReason?: string;
    isUpfrontPayment: boolean;
  }>;
}

export interface PaymentScheduleResponse {
  summary: {
    totalPayments: number;
    completedPayments: number;
    pendingPayments: number;
    failedPayments: number;
    nextPaymentDate: string;
  };
  schedule: Array<{
    sequenceNumber: number;
    scheduledDate: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    processedDate?: string;
    retryCount: number;
    greenMoneyCheckId: string | null;
    isUpfrontPayment: boolean;
  }>;
}

export interface PaymentPlanData {
  _id: string;
  customerId?: {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      address1: string;
      address2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    bankDetails?: {
      routingNumber?: string;
      accountNumber?: string;
      bankName?: string;
    };
  };
  principalAmount?: number;
  interestRate?: number;
  totalAmountWithInterest?: number;
  monthlyPayment?: number;
  planDuration?: number;
  startDate?: string;
  endDate?: string;
  totalPayments?: number;
  completedPayments?: number;
  remainingBalance?: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface PaymentPlansListResponse {
  success: boolean;
  count: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: PaymentPlanData[];
}
