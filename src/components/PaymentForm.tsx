import React, { useState, useEffect } from 'react';

const PaymentForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [clientName, setClientName] = useState('');
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  
  // Validation states
  const [amountError, setAmountError] = useState('');
  const [clientNameError, setClientNameError] = useState('');
  const [noteError, setNoteError] = useState('');
  
  // Form validity state
  const [isFormValid, setIsFormValid] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      // Handle form submission logic here
      console.log({ amount, clientName, note });
      alert('Form submitted successfully!');
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
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Pay Your Price
          </h1>
          <p className="text-gray-600">
            Enter an amount and pay securely.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div>
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
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline cursor-pointer"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 ${
              isFormValid
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
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
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
