import React, { useState, useEffect } from 'react';
import { usePaymentForm } from '../context/PaymentFormContext';
import { PaymentPlanService } from '../services/paymentPlanService';
import StepIndicator from './StepIndicator';

const PaymentForm: React.FC = () => {
  const { state, dispatch } = usePaymentForm();
  const [amount, setAmount] = useState(state.formData.amount);
  const [clientName, setClientName] = useState(state.formData.clientName);
  const [note, setNote] = useState(state.formData.note);
  const [showNoteInput, setShowNoteInput] = useState(false);
  
  // Validation states
  const [amountError, setAmountError] = useState('');
  const [clientNameError, setClientNameError] = useState('');
  const [noteError, setNoteError] = useState('');
  
  // Form validity state
  const [isFormValid, setIsFormValid] = useState(false);

  // Update local state when global state changes
  useEffect(() => {
    setAmount(state.formData.amount);
    setClientName(state.formData.clientName);
    setNote(state.formData.note);
  }, [state.formData]);

  // Real-time validation for amount
  useEffect(() => {
    if (amount === '') {
      setAmountError('');
    } else if (!/^\d+(\.\d{0,2})?$/.test(amount)) {
      setAmountError('Please enter a valid amount (e.g., 100 or 100.50)');
    } else if (parseFloat(amount) <= 0) {
      setAmountError('Amount must be greater than 0');
    } else if (parseFloat(amount) > 999999.99) {
      setAmountError('Amount cannot exceed $999,999.99');
    } else {
      setAmountError('');
    }
  }, [amount]);

  // Real-time validation for client name
  useEffect(() => {
    if (clientName === '') {
      setClientNameError('');
    } else if (clientName.length < 2) {
      setClientNameError('Name must be at least 2 characters long');
    } else if (clientName.length > 50) {
      setClientNameError('Name cannot exceed 50 characters');
    } else if (!/^[a-zA-Z\s'-]+$/.test(clientName)) {
      setClientNameError('Name can only contain letters, spaces, hyphens, and apostrophes');
    } else {
      setClientNameError('');
    }
  }, [clientName]);

  // Real-time validation for note (only when note is being entered)
  useEffect(() => {
    if (note === '') {
      setNoteError('');
    } else if (note.length > 200) {
      setNoteError('Note cannot exceed 200 characters');
    } else {
      setNoteError('');
    }
  }, [note]);

  // Check overall form validity (note is optional)
  useEffect(() => {
    const isValid = amount !== '' && 
                   clientName !== '' && 
                   amountError === '' && 
                   clientNameError === '' && 
                   noteError === '';
    setIsFormValid(isValid);
  }, [amount, clientName, amountError, clientNameError, noteError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        // Save form data to global state
        dispatch({
          type: 'UPDATE_FORM_DATA',
          payload: { amount, clientName, note }
        });
        
        // Set loading state
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        // Call API to calculate payment plans
        const paymentPlans = await PaymentPlanService.calculatePaymentPlans({
          principalAmount: parseFloat(amount),
          customerName: clientName,
        });
        
        // Save payment plans to global state
        dispatch({ type: 'SET_PAYMENT_PLANS', payload: paymentPlans });
        
        // Navigate to payment plan selection
        dispatch({ type: 'SET_CURRENT_STEP', payload: 2 });
        
      } catch (error) {
        console.error('Error calculating payment plans:', error);
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Failed to calculate payment plans' 
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length <= 2) {
      setAmount(cleanValue);
    }
  };

  const toggleNoteInput = () => {
    setShowNoteInput(!showNoteInput);
    if (!showNoteInput) {
      setNote('');
      setNoteError('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Step Indicator */}
        <StepIndicator currentStep={state.currentStep} />
        
        {/* Header Section */}
        <div className="text-left mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Pay Your Price
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter an amount and pay securely
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                $
              </div>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter Amount"
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 ${
                  amountError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {amountError && (
              <p className="text-red-500 text-sm mt-1">{amountError}</p>
            )}
          </div>

          {/* Client Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Full name"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 ${
                clientNameError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {clientNameError && (
              <p className="text-red-500 text-sm mt-1">{clientNameError}</p>
            )}
          </div>

          {/* Note Section */}
          <div>
            {!showNoteInput ? (
              <button
                type="button"
                onClick={toggleNoteInput}
                className="text-gray-600 hover:text-blue-700 text-sm font-medium hover:underline cursor-pointer"
              >
                Add a note
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Add a note
                  </label>
                  <button
                    type="button"
                    onClick={toggleNoteInput}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter a note (optional)"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 ${
                    noteError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {noteError && (
                  <p className="text-red-500 text-sm">{noteError}</p>
                )}
              </div>
            )}
          </div>

          {/* Error Display */}
          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{state.error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || state.isLoading}
            className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 ${
              isFormValid && !state.isLoading
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            {state.isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>Proceed to secure payment</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
