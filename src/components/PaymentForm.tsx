import React, { useState, useEffect } from 'react';
import { usePaymentForm } from '../context/PaymentFormContext';
import { PaymentPlanService } from '../services/paymentPlanService';
import { toast } from 'sonner';

const PaymentForm: React.FC = () => {
  const { state, dispatch } = usePaymentForm();
  const [amount, setAmount] = useState('');
  const [clientName, setClientName] = useState('');
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync local state with global state
  useEffect(() => {
    setAmount(state.formData.amount);
    setClientName(state.formData.clientName);
    setNote(state.formData.note);
  }, [state.formData]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        payload: { amount, clientName, note }
      });

      // Call API to calculate payment plans
      const response = await PaymentPlanService.calculatePaymentPlans({
        principalAmount: parseFloat(amount),
        customerName: clientName
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
      case 'note':
        setNote(value);
        break;
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Form
          </h1>
          <p className="text-gray-600">
            Enter payment details to calculate available plans
          </p>
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
                className={`w-full pl-8 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
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
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                errors.clientName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter client name"
            />
            {errors.clientName && (
              <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>
            )}
          </div>

          {/* Note Field */}
          <div>
            {!showNote ? (
              <button
                type="button"
                onClick={() => setShowNote(true)}
                className="text-blue-600 hover:text-blue-700 text-sm underline"
              >
                + Add a note
              </button>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  rows={3}
                  placeholder="Enter any additional notes..."
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Calculating Plans...
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
    </div>
  );
};

export default PaymentForm;
