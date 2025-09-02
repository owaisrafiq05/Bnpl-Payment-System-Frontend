import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';

// Types
export interface PaymentFormData {
  amount: string;
  clientName: string;
  note: string;
  upfrontPayment: string;
}

export interface PaymentPlan {
  duration: number;
  totalAmount: number;
  monthlyPayment: number;
  interestAmount: number;
  description: string;
  upfrontPayment: number;
  remainingAmount: number;
}

export interface PaymentPlansResponse {
  customerName: string;
  principalAmount: number;
  interestRate: string;
  upfrontPayment: number;
  remainingAmount: number;
  availablePlans: PaymentPlan[];
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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

export interface PaymentFormState {
  formData: PaymentFormData;
  paymentPlans: PaymentPlansResponse | null;
  selectedPlan: PaymentPlan | null;
  checkoutData: CheckoutFormData;
  isLoading: boolean;
  error: string | null;
  currentStep: number;
}

// Action types
export type PaymentFormAction =
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<PaymentFormData> }
  | { type: 'SET_PAYMENT_PLANS'; payload: PaymentPlansResponse }
  | { type: 'SET_SELECTED_PLAN'; payload: PaymentPlan }
  | { type: 'UPDATE_CHECKOUT_DATA'; payload: Partial<CheckoutFormData> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'RESET_FORM' };

// Initial state
const initialState: PaymentFormState = {
  formData: {
    amount: '',
    clientName: '',
    note: '',
    upfrontPayment: '',
  },
  paymentPlans: null,
  selectedPlan: null,
  checkoutData: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    routingNumber: '',
    accountNumber: '',
    bankName: '',
  },
  isLoading: false,
  error: null,
  currentStep: 1,
};

// Reducer function
const paymentFormReducer = (state: PaymentFormState, action: PaymentFormAction): PaymentFormState => {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
    case 'SET_PAYMENT_PLANS':
      return {
        ...state,
        paymentPlans: action.payload,
        error: null,
      };
    case 'SET_SELECTED_PLAN':
      return {
        ...state,
        selectedPlan: action.payload,
        error: null,
      };
    case 'UPDATE_CHECKOUT_DATA':
      return {
        ...state,
        checkoutData: {
          ...state.checkoutData,
          ...action.payload,
        },
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

// Context
const PaymentFormContext = createContext<{
  state: PaymentFormState;
  dispatch: React.Dispatch<PaymentFormAction>;
} | null>(null);

// Provider component
export const PaymentFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentFormReducer, initialState);

  return (
    <PaymentFormContext.Provider value={{ state, dispatch }}>
      {children}
    </PaymentFormContext.Provider>
  );
};

// Custom hook to use the context
export const usePaymentForm = () => {
  const context = useContext(PaymentFormContext);
  if (!context) {
    throw new Error('usePaymentForm must be used within a PaymentFormProvider');
  }
  return context;
};
