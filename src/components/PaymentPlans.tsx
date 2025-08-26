import React from 'react';
import type { PaymentPlan } from '../context/PaymentFormContext';
import StepIndicator from './StepIndicator';

interface PaymentPlansProps {
  paymentPlans: {
    customerName: string;
    principalAmount: number;
    interestRate: string;
    availablePlans: PaymentPlan[];
  };
  onSelectPlan: (plan: PaymentPlan) => void;
  onBack: () => void;
  currentStep: number;
}

const PaymentPlans: React.FC<PaymentPlansProps> = ({
  paymentPlans,
  onSelectPlan,
  onBack,
  currentStep,
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Choose Your Payment Plan
          </h1>
          <p className="text-gray-600">
            Select a payment plan that works best for you
          </p>
        </div>

        {/* Summary Section */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="text-lg font-semibold text-gray-800">{paymentPlans.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Principal Amount</p>
              <p className="text-lg font-semibold text-gray-800">
                {formatCurrency(paymentPlans.principalAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interest Rate</p>
              <p className="text-lg font-semibold text-gray-800">{paymentPlans.interestRate}</p>
            </div>
          </div>
        </div>

        {/* Payment Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {paymentPlans.availablePlans.map((plan) => (
            <div
              key={plan.duration}
              className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => onSelectPlan(plan)}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {plan.duration}
                </div>
                <div className="text-sm text-gray-600 mb-4">{plan.description}</div>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Monthly Payment</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatCurrency(plan.monthlyPayment)}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Total Amount</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatCurrency(plan.totalAmount)}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Interest Amount</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatCurrency(plan.interestAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition duration-200"
          >
            Back to Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPlans;
