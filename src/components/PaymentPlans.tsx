import React from 'react';
import { usePaymentForm } from '../context/PaymentFormContext';
import type { PaymentPlan } from '../context/PaymentFormContext';
import { CreditCard, CheckCircle } from 'lucide-react';

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
}) => {
  const { dispatch } = usePaymentForm();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handlePlanSelection = (plan: PaymentPlan) => {
    // Save selected plan to global state
    dispatch({ type: 'SET_SELECTED_PLAN', payload: plan });
    
    // Navigate to checkout form (step 3)
    dispatch({ type: 'SET_CURRENT_STEP', payload: 3 });
    
    // Call the onSelectPlan callback for any additional logic
    onSelectPlan(plan);
  };

  const handleFullPaymentSelection = () => {
    // Create a special plan object for full payment
    const fullPaymentPlan: PaymentPlan = {
      duration: 1,
      description: 'Full Payment - No Interest',
      monthlyPayment: paymentPlans.principalAmount,
      totalAmount: paymentPlans.principalAmount,
      interestAmount: 0
    };

    // Save the full payment plan to global state
    dispatch({ type: 'SET_SELECTED_PLAN', payload: fullPaymentPlan });
    
    // Navigate to checkout form (step 3)
    dispatch({ type: 'SET_CURRENT_STEP', payload: 3 });
    
    // Call the onSelectPlan callback
    onSelectPlan(fullPaymentPlan);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Payment Options</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Installment Plans */}
            {paymentPlans.availablePlans.map((plan) => (
              <div
                key={plan.duration}
                className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => handlePlanSelection(plan)}
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

            {/* Full Payment Card */}
            <div
              className="border-2 border-green-200 bg-green-50 rounded-lg p-6 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer relative"
              onClick={handleFullPaymentSelection}
            >
              <div className="absolute top-2 right-2">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  BEST VALUE
                </span>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-green-600 mr-2" />
                  <div className="text-3xl font-bold text-green-600">
                    FULL
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-4">Pay in Full - No Interest</div>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-600">One-time Payment</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatCurrency(paymentPlans.principalAmount)}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-600">Total Amount</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatCurrency(paymentPlans.principalAmount)}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-600">Interest Amount</p>
                    <p className="text-sm font-semibold text-green-600">
                      $0.00 🎉
                    </p>
                  </div>
                  
                  <div className="bg-green-100 rounded-lg p-2 border border-green-300">
                    <p className="text-xs text-green-700 font-semibold">
                      Save {formatCurrency(paymentPlans.availablePlans[0]?.interestAmount || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8">
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
