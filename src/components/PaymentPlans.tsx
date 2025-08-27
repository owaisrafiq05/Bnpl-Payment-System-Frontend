import React, { useState } from 'react';
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
  
  // State for full payment form
  const [fullPaymentData, setFullPaymentData] = useState({
    bankName: '',
    routingNumber: '',
    accountNumber: '',
  });
  const [fullPaymentErrors, setFullPaymentErrors] = useState<Record<string, string>>({});
  const [isSubmittingFullPayment, setIsSubmittingFullPayment] = useState(false);

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

  const handleFullPaymentInputChange = (field: keyof typeof fullPaymentData, value: string) => {
    let processedValue = value;

    // Input validation and formatting
    switch (field) {
      case 'routingNumber':
        // Only allow digits
        processedValue = value.replace(/\D/g, '').slice(0, 9);
        break;
      case 'accountNumber':
        // Only allow digits
        processedValue = value.replace(/\D/g, '');
        break;
      case 'bankName':
        // Allow letters, spaces, and common bank characters
        processedValue = value.replace(/[^a-zA-Z\s&.-]/g, '');
        break;
    }

    setFullPaymentData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    // Clear error when user starts typing
    if (fullPaymentErrors[field]) {
      setFullPaymentErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateFullPaymentForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!fullPaymentData.bankName.trim()) {
      errors.bankName = 'Bank name is required';
    }
    if (!fullPaymentData.routingNumber.trim()) {
      errors.routingNumber = 'Routing number is required';
    } else if (!/^\d{9}$/.test(fullPaymentData.routingNumber)) {
      errors.routingNumber = 'Routing number must be exactly 9 digits';
    }
    if (!fullPaymentData.accountNumber.trim()) {
      errors.accountNumber = 'Account number is required';
    }

    setFullPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFullPaymentSubmit = async () => {
    if (!validateFullPaymentForm()) {
      return;
    }

    setIsSubmittingFullPayment(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Full Payment Data:', {
        customerName: paymentPlans.customerName,
        amount: paymentPlans.principalAmount,
        bankDetails: fullPaymentData,
        paymentType: 'full_payment_greenpay'
      });
      
      alert('Full payment submitted successfully!');
      
    } catch (error) {
      console.error('Error processing full payment:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setIsSubmittingFullPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Choose Your Payment Option
          </h1>
          <p className="text-gray-600">
            Select a payment plan that works best for you or pay in full with no interest
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

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Plans */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Installment Plans</h2>
              </div>
              
              {/* Payment Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {paymentPlans.availablePlans.map((plan) => (
                  <div
                    key={plan.duration}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => handlePlanSelection(plan)}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {plan.duration}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">{plan.description}</div>
                      
                      <div className="space-y-2">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-600">Monthly Payment</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {formatCurrency(plan.monthlyPayment)}
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-600">Total Amount</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {formatCurrency(plan.totalAmount)}
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-600">Interest Amount</p>
                          <p className="text-xs font-semibold text-gray-800">
                            {formatCurrency(plan.interestAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Full Payment Option */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Pay in Full</h2>
              </div>
              
              {/* Full Payment Highlight */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <div className="text-green-600 font-semibold mb-2">🎉 No Interest!</div>
                  <div className="text-lg font-bold text-gray-800 mb-1">
                    {formatCurrency(paymentPlans.principalAmount)}
                  </div>
                  <div className="text-sm text-gray-600">Pay the full amount today</div>
                  <div className="text-xs text-green-600 mt-2">
                    Save {formatCurrency(paymentPlans.availablePlans[0]?.interestAmount || 0)} in interest
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{paymentPlans.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatCurrency(paymentPlans.principalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest:</span>
                    <span className="font-medium text-green-600">$0.00</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(paymentPlans.principalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* GreenPay Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">GreenPay Bank Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullPaymentData.bankName}
                    onChange={(e) => handleFullPaymentInputChange('bankName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      fullPaymentErrors.bankName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter bank name"
                  />
                  {fullPaymentErrors.bankName && (
                    <p className="text-red-500 text-xs mt-1">{fullPaymentErrors.bankName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Routing Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullPaymentData.routingNumber}
                    onChange={(e) => handleFullPaymentInputChange('routingNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      fullPaymentErrors.routingNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="9-digit routing number"
                    maxLength={9}
                  />
                  {fullPaymentErrors.routingNumber && (
                    <p className="text-red-500 text-xs mt-1">{fullPaymentErrors.routingNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullPaymentData.accountNumber}
                    onChange={(e) => handleFullPaymentInputChange('accountNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      fullPaymentErrors.accountNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter account number"
                  />
                  {fullPaymentErrors.accountNumber && (
                    <p className="text-red-500 text-xs mt-1">{fullPaymentErrors.accountNumber}</p>
                  )}
                </div>

                <button
                  onClick={handleFullPaymentSubmit}
                  disabled={isSubmittingFullPayment}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isSubmittingFullPayment
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSubmittingFullPayment ? 'Processing...' : 'Pay Full Amount'}
                </button>

                <div className="text-xs text-gray-500 text-center">
                  🔒 Secured by GreenPay • No fees • Instant processing
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
