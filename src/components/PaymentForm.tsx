import React, { useState, useEffect } from 'react';
import { usePaymentForm } from '../context/PaymentFormContext';
import { PaymentPlanService } from '../services/paymentPlanService';
import { toast } from 'sonner';
import HeroSection from './HeroSection';

const PaymentForm: React.FC = () => {
  const { state, dispatch } = usePaymentForm();
  const [amount, setAmount] = useState('');
  const [clientName, setClientName] = useState('');
  const [upfrontPayment, setUpfrontPayment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [autoSubmitSuccess, setAutoSubmitSuccess] = useState(false);

  // Parse URL parameters and auto-fill form
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlAmount = urlParams.get('amount');
    const urlClientName = urlParams.get('client_name');
    const urlDownPayment = urlParams.get('down_payment');

    // If URL parameters exist, use them to auto-fill the form
    if (urlAmount || urlClientName || urlDownPayment) {
      // Validate URL parameters before setting
      const newErrors: Record<string, string> = {};
      
      if (urlAmount && (isNaN(parseFloat(urlAmount)) || parseFloat(urlAmount) <= 0)) {
        newErrors.amount = 'Invalid amount in URL parameter';
      }
      
      if (urlDownPayment && (isNaN(parseFloat(urlDownPayment)) || parseFloat(urlDownPayment) < 0)) {
        newErrors.upfrontPayment = 'Invalid down payment in URL parameter';
      }
      
      if (urlDownPayment && urlAmount && parseFloat(urlDownPayment) >= parseFloat(urlAmount)) {
        newErrors.upfrontPayment = 'Down payment must be less than total amount';
      }
      
      setErrors(newErrors);
      
      // Only proceed if no validation errors
      if (Object.keys(newErrors).length === 0) {
        if (urlAmount) setAmount(urlAmount);
        if (urlClientName) setClientName(urlClientName);
        if (urlDownPayment) setUpfrontPayment(urlDownPayment);
        
        setIsAutoFilled(true);
      }
    } else {
      // Sync with global state if no URL parameters
      setAmount(state.formData.amount);
      setClientName(state.formData.clientName);
      setUpfrontPayment(state.formData.upfrontPayment);
    }
  }, [state.formData]);

  // Auto-submit form when URL parameters are present
  useEffect(() => {
    if (isAutoFilled && amount && clientName) {
      // Small delay to ensure form is properly filled
      const timer = setTimeout(() => {
        handleAutoSubmit();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isAutoFilled, amount, clientName]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    // Validate upfront payment
    if (upfrontPayment.trim() && (isNaN(parseFloat(upfrontPayment)) || parseFloat(upfrontPayment) < 0)) {
      newErrors.upfrontPayment = 'Please enter a valid down payment amount';
    } else if (upfrontPayment.trim() && parseFloat(upfrontPayment) >= parseFloat(amount)) {
      newErrors.upfrontPayment = 'Down payment must be less than the total amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAutoSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Update global state
      dispatch({
        type: 'UPDATE_FORM_DATA',
        payload: { amount, clientName, upfrontPayment }
      });

      // Call API to calculate payment plans
      const response = await PaymentPlanService.calculatePaymentPlans({
        principalAmount: parseFloat(amount),
        customerName: clientName,
        upfrontPayment: upfrontPayment.trim() ? parseFloat(upfrontPayment) : 0
      });

      // Save payment plans to global state
      dispatch({
        type: 'SET_PAYMENT_PLANS',
        payload: response
      });

      // Navigate to step 2
      dispatch({
        type: 'SET_CURRENT_STEP',
        payload: 2
      });

      // Show success message for auto-submit
      if (isAutoFilled) {
        setAutoSubmitSuccess(true);
        toast.success('Payment plans calculated successfully! Redirecting to plan selection...');
      }

    } catch (error) {
      console.error('Error calculating payment plans:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to calculate payment plans');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Update global state
      dispatch({
        type: 'UPDATE_FORM_DATA',
        payload: { amount, clientName, upfrontPayment }
      });

      // Call API to calculate payment plans
      const response = await PaymentPlanService.calculatePaymentPlans({
        principalAmount: parseFloat(amount),
        customerName: clientName,
        upfrontPayment: upfrontPayment.trim() ? parseFloat(upfrontPayment) : 0
      });

      // Save payment plans to global state
      dispatch({
        type: 'SET_PAYMENT_PLANS',
        payload: response
      });

      // Navigate to step 2
      dispatch({
        type: 'SET_CURRENT_STEP',
        payload: 2
      });

    } catch (error) {
      console.error('Error calculating payment plans:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to calculate payment plans');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Update local state
    switch (field) {
      case 'amount':
        setAmount(value);
        break;
      case 'clientName':
        setClientName(value);
        break;
      case 'upfrontPayment':
        setUpfrontPayment(value);
        break;
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div><HeroSection backgroundUrl="/bg-img.png" title="Make a Payment" />
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 flex-col">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Form
          </h1>
          <p className="text-gray-600">
            {isAutoFilled ? 'Auto-filling form from URL parameters...' : 'Enter payment details to calculate available plans'}
          </p>
          {isAutoFilled && (
            <div className="mt-2 flex items-center justify-center">
              {autoSubmitSuccess ? (
                <div className="flex items-center text-green-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Redirecting to payment plans...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-blue-600">Processing payment plans...</span>
                </div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="text"
                value={amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                disabled={isAutoFilled && isSubmitting}
                className={`w-full pl-8 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                } ${isAutoFilled && isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Client Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              disabled={isAutoFilled && isSubmitting}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                errors.clientName ? 'border-red-500' : 'border-gray-300'
              } ${isAutoFilled && isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Enter client name"
            />
            {errors.clientName && (
              <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>
            )}
          </div>

          {/* Upfront Payment Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="text"
                value={upfrontPayment}
                onChange={(e) => handleInputChange('upfrontPayment', e.target.value)}
                disabled={isAutoFilled && isSubmitting}
                className={`w-full pl-8 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  errors.upfrontPayment ? 'border-red-500' : 'border-gray-300'
                } ${isAutoFilled && isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="0.00"
              />
            </div>
            {errors.upfrontPayment && (
              <p className="text-red-500 text-xs mt-1">{errors.upfrontPayment}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Pay a portion upfront to reduce your monthly payments
            </p>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || (isAutoFilled && isSubmitting)}
            className={`w-full py-3 px-6 rounded font-medium transition-colors rounded-xl ${
              isSubmitting || (isAutoFilled && isSubmitting)
                ? 'bg-gray-400 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isAutoFilled ? 'Auto-calculating Plans...' : 'Calculating Plans...'}
              </div>
            ) : (
              'Calculate Payment Plans'
            )}
          </button>
        </form>

        {state.error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {state.error}
          </div>
        )}
      </div>

      {/* Back to Application Button */}
      <div className="mt-6 flex justify-start">
        <a
          href="https://ironclad.law/"
          className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 rounded border border-gray-300 text-gray-700 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent rounded-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Application
        </a>
      </div>
    </div>
  </div>
  );
};

export default PaymentForm;
