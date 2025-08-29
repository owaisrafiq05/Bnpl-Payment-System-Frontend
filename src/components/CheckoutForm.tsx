import React, { useState, useEffect } from 'react';
import { usePaymentForm } from '../context/PaymentFormContext';
import { PaymentPlanService } from '../services/paymentPlanService';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import HeroSection from './HeroSection';

const CheckoutForm: React.FC = () => {
  const { state, dispatch } = usePaymentForm();
  const [selectedPayment, setSelectedPayment] = useState('echeck');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoIdFile, setPhotoIdFile] = useState<File | null>(null);
  const [signatureData, setSignatureData] = useState<string>('');
  const [signatureCanvas, setSignatureCanvas] = useState<HTMLCanvasElement | null>(null);
  const [inactivityTimer, setInactivityTimer] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // Form validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation rules
//   const validationRules = {
//     customerName: { required: true, minLength: 2 },
//     email: { required: true, email: true },
//     phone: { required: true, pattern: /^\d{10}$/ },
//     address1: { required: true },
//     city: { required: true },
//     state: { required: true, length: 2 },
//     zip: { required: true, pattern: /^\d{5}$/ },
//     routingNumber: { required: true, pattern: /^\d{9}$/ },
//     accountNumber: { required: true, minLength: 4 }
//   };

  // Initialize form data from global state
  useEffect(() => {
    if (state.formData.clientName) {
      const [firstName, ...lastNameParts] = state.formData.clientName.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      
      dispatch({
        type: 'UPDATE_CHECKOUT_DATA',
        payload: {
          firstName: firstName || '',
          lastName: lastName || '',
        }
      });
    }
  }, [state.formData.clientName, dispatch]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!state.checkoutData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!state.checkoutData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!state.checkoutData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.checkoutData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!state.checkoutData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(state.checkoutData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!state.checkoutData.address1?.trim()) {
      newErrors.address1 = 'Address is required';
    }
    if (!state.checkoutData.city?.trim()) {
      newErrors.city = 'City is required';
    }
    if (!state.checkoutData.state?.trim()) {
      newErrors.state = 'State is required';
    }
    if (!state.checkoutData.zip?.trim()) {
      newErrors.zip = 'ZIP code is required';
    }
    if (!state.checkoutData.routingNumber?.trim()) {
      newErrors.routingNumber = 'Routing number is required';
    } else if (!/^\d{9}$/.test(state.checkoutData.routingNumber)) {
      newErrors.routingNumber = 'Routing number must be exactly 9 digits';
    }
    if (!state.checkoutData.accountNumber?.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }
    if (!state.checkoutData.bankName?.trim()) {
      newErrors.bankName = 'Bank name is required';
    }
    if (!photoIdFile) {
      newErrors.photoId = 'Photo ID is required';
    }
    if (!signatureData) {
      newErrors.signature = 'Digital signature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof state.checkoutData, value: string) => {
    let processedValue = value;

    // Real-time input validation and formatting
    switch (field) {
      case 'phone':
        // Only allow digits
        processedValue = value.replace(/\D/g, '').slice(0, 10);
        break;
      case 'zip':
        // Only allow digits
        processedValue = value.replace(/\D/g, '').slice(0, 5);
        break;
      case 'routingNumber':
        // Only allow digits
        processedValue = value.replace(/\D/g, '').slice(0, 9);
        break;
      case 'accountNumber':
        // Only allow digits
        processedValue = value.replace(/\D/g, '');
        break;
      case 'city':
        // Only allow letters and spaces
        processedValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
      case 'state':
        // Only allow letters and convert to uppercase
        processedValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2);
        break;
      case 'firstName':
      case 'lastName':
        // Only allow letters, spaces, hyphens, and apostrophes
        processedValue = value.replace(/[^a-zA-Z\s'-]/g, '');
        break;
    }

    dispatch({
      type: 'UPDATE_CHECKOUT_DATA',
      payload: { [field]: processedValue }
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoIdUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF) or PDF');
        return;
      }
      
      setPhotoIdFile(file);
      console.log('Photo ID uploaded:', file.name, file.size, file.type);
      toast.success(`Photo ID "${file.name}" uploaded successfully`);
      
      // Clear error when file is uploaded
      if (errors.photoId) {
        setErrors(prev => ({ ...prev, photoId: '' }));
      }
    }
  };

  const handleSignatureChange = (signature: string) => {
    setSignatureData(signature);
    
    // Clear error when signature is added
    if (errors.signature) {
      setErrors(prev => ({ ...prev, signature: '' }));
    }
    
    // Clear existing timer
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    
    // Set new timer for 3 seconds of inactivity
    const timer = setTimeout(() => {
      console.log('Signature data after 3 seconds of inactivity:', signature);
      console.log('Signature length (characters):', signature.length);
      console.log('Signature timestamp:', new Date().toISOString());
    }, 3000);
    
    setInactivityTimer(timer);
  };

  const clearSignature = () => {
    if (signatureCanvas) {
      const ctx = signatureCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
      }
    }
    setSignatureData('');
    
    // Clear timer when signature is cleared
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      setInactivityTimer(null);
    }
    
    console.log('Signature cleared');
  };

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, [inactivityTimer]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (!state.selectedPlan) {
      toast.error('No payment plan selected');
      return;
    }

    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress('Preparing submission...');
    
    try {
      // Create FormData for file upload support
      const formData = new FormData();
      
      // Check if this is a full payment (duration = 1) or installment plan
      const isFullPayment = state.selectedPlan.duration === 1;
      
      if (isFullPayment) {
        // For full payment API - use totalAmount field
        formData.append('totalAmount', state.selectedPlan.totalAmount.toString());
      } else {
        // For installment payment API - use selectedPlan object
        formData.append('selectedPlan', JSON.stringify({
          duration: state.selectedPlan.duration,
          totalAmount: state.selectedPlan.totalAmount,
          monthlyPayment: state.selectedPlan.monthlyPayment,
          interestAmount: state.selectedPlan.interestAmount
        }));
      }
      
      // Add customer data (same for both APIs)
      formData.append('customerName', state.formData.clientName);
      formData.append('email', state.checkoutData.email || '');
      formData.append('phone', state.checkoutData.phone || '');
      formData.append('phoneExtension', '');
      formData.append('address1', state.checkoutData.address1 || '');
      formData.append('address2', state.checkoutData.address2 || '');
      formData.append('city', state.checkoutData.city || '');
      formData.append('state', state.checkoutData.state || '');
      formData.append('zip', state.checkoutData.zip || '');
      formData.append('country', state.checkoutData.country || 'US');
      formData.append('routingNumber', state.checkoutData.routingNumber || '');
      formData.append('accountNumber', state.checkoutData.accountNumber || '');
      formData.append('bankName', state.checkoutData.bankName || '');
      
      // Add files if present
      if (photoIdFile) {
        setUploadProgress('Processing photo ID...');
        formData.append('photoId', photoIdFile);
        console.log('Adding Photo ID file to submission:', photoIdFile.name);
      }
      
      // Convert signature canvas to blob and add if present
      if (signatureData && signatureCanvas) {
        try {
          setUploadProgress('Processing digital signature...');
          // Convert canvas data URL to blob synchronously
          const dataURL = signatureCanvas.toDataURL('image/png', 0.8);
          const response = await fetch(dataURL);
          const blob = await response.blob();
          formData.append('digitalSignature', blob, 'signature.png');
          console.log('Adding digital signature to submission');
        } catch (signatureError) {
          console.warn('Could not convert signature to blob:', signatureError);
          console.warn('Could not process digital signature, continuing without it');
        }
      }

      setUploadProgress('Submitting payment plan...');
      
      if (isFullPayment) {
        // Use full payment API for immediate payment processing
        await PaymentPlanService.processFullPayment(formData);
        toast.success('Full payment processed successfully!');
      } else {
        // Use regular installment payment API
        await PaymentPlanService.createPaymentPlanWithFiles(formData);
        toast.success('Payment plan created successfully!');
      }
      
      // Redirect to the admin portal
      window.location.href = `/admin`;
      
      
    } catch (error) {
      console.error('Error creating payment plan:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create payment plan');
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!state.selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <p className="text-gray-600">No payment plan selected. Please go back to select a plan.</p>
          <button
            onClick={() => dispatch({ type: 'SET_CURRENT_STEP', payload: 2 })}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroSection backgroundUrl="/bg-img.png" title="Checkout" />
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Coupon Section */}
        <div className="bg-blue-400 text-white p-4 rounded-t-lg mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm">📋</span>
            <span className="text-sm font-medium">Have a coupon?</span>
            <button 
              onClick={() => setShowCoupon(!showCoupon)}
              className="text-sm underline hover:no-underline"
            >
              Click here to enter your code
            </button>
          </div>
          {showCoupon && (
            <div className="mt-4 flex gap-2">
              <input 
                type="text" 
                placeholder="Coupon code"
                className="flex-1 px-3 py-2 text-black rounded"
              />
              <button className="bg-white text-blue-400 px-4 py-2 rounded font-medium">
                Apply
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Billing Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Billing details</h2>
            
            <div className="space-y-6">
              {/* First Name & Last Name */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={state.checkoutData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={state.checkoutData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Upload Photo ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photo ID <span className="text-red-500">*</span>
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${
                  photoIdFile ? 'border-green-300 bg-green-50' : errors.photoId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handlePhotoIdUpload}
                    className="hidden"
                    id="photo-id-upload"
                  />
                  <label htmlFor="photo-id-upload" className="cursor-pointer">
                    {photoIdFile ? (
                      <div className="text-green-600">
                        <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">{photoIdFile.name}</span>
                        <p className="text-xs text-gray-500 mt-1">
                          {(photoIdFile.size / 1024 / 1024).toFixed(2)} MB • Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm font-medium text-gray-600">Select File or Drag & Drop</span>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, PDF up to 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
                {errors.photoId && (
                  <p className="text-red-500 text-xs mt-1">{errors.photoId}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country / Region <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    value={state.checkoutData.country || 'US'}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="US">United States (US)</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street address <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="House number and street name"
                    value={state.checkoutData.address1 || ''}
                    onChange={(e) => handleInputChange('address1', e.target.value)}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                      errors.address1 ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <input 
                    type="text" 
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    value={state.checkoutData.address2 || ''}
                    onChange={(e) => handleInputChange('address2', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                {errors.address1 && (
                  <p className="text-red-500 text-xs mt-1">{errors.address1}</p>
                )}
              </div>

              {/* Town / City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Town / City <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={state.checkoutData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              {/* State / County */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State / County <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    value={state.checkoutData.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none bg-white ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select State</option>
                    <option value="AK">Alaska</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>

              {/* Postcode / ZIP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode / ZIP <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={state.checkoutData.zip || ''}
                  onChange={(e) => handleInputChange('zip', e.target.value)}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                    errors.zip ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.zip && (
                  <p className="text-red-500 text-xs mt-1">{errors.zip}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  value={state.checkoutData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  value={state.checkoutData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Your Order */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Your order</h2>
            
            {/* Order Summary */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Product</span>
                <span className="font-medium text-gray-700">Subtotal</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>
                  {state.selectedPlan.duration === 1 
                    ? 'Full Payment (Immediate)' 
                    : `$${state.selectedPlan.monthlyPayment} × ${state.selectedPlan.duration} months`
                  }
                </span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(state.formData.amount ? parseFloat(state.formData.amount) : 0)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>Interest ({state.selectedPlan.duration === 1 ? '0%' : state.paymentPlans?.interestRate || '19%'})</span>
                <span className={`font-semibold ${state.selectedPlan.duration === 1 ? 'text-green-600' : 'text-gray-800'}`}>
                  {formatCurrency(state.selectedPlan.interestAmount)}
                  {state.selectedPlan.duration === 1 && ' 🎉'}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>{formatCurrency(state.selectedPlan.totalAmount)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              {/* eCheck */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="echeck"
                    checked={selectedPayment === 'echeck'}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">eCheck</span>
                </label>

                {selectedPayment === 'echeck' && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-gray-700 mb-4">Pay by Electronic Check.</p>
                    
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Routing number
                          </label>
                          <input 
                            type="text" 
                            value={state.checkoutData.routingNumber || ''}
                            onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                              errors.routingNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.routingNumber && (
                            <p className="text-red-500 text-xs mt-1">{errors.routingNumber}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account number
                          </label>
                          <input 
                            type="text" 
                            value={state.checkoutData.accountNumber || ''}
                            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                              errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.accountNumber && (
                            <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank name
                        </label>
                        <input 
                          type="text" 
                          value={state.checkoutData.bankName || ''}
                          onChange={(e) => handleInputChange('bankName', e.target.value)}
                          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                            errors.bankName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.bankName && (
                          <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
                        )}
                      </div>

                      <div className='flex flex-col space-y-2 sm:flex-row items-center justify-between sm:space-x-2'>
                        <p className="text-xs text-gray-600">
                          Routing and Account number details
                        </p>
                        <img src="./abanumber.gif" alt="" />
                      </div>

                      
                    </div>
                  </div>
                )}
              </div>

              {/* Pay by Zelle */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="zelle"
                    checked={selectedPayment === 'zelle'}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Pay by Zelle</span>
                </label>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="mt-8 p-4 bg-gray-50 rounded text-sm text-gray-600">
              <p className="mb-4">
                Your personal data will be used to process your order, support your 
                experience throughout this website, and for other purposes described 
                in our privacy policy.
              </p>
              
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the website{' '}
                  <a href="#" className="text-blue-600 underline hover:no-underline">
                    terms and conditions
                  </a>{' '}
                  <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            {/* E-Signature */}
            <div className='mt-8'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ✍️ Your Digital Signature <span className="text-red-500">*</span>
                </label>
                <div className={`bg-white border-2 rounded-lg p-4 ${
                  errors.signature ? 'border-red-300' : 'border-gray-300'
                }`}>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg min-h-[150px] relative">
                    <canvas
                      ref={(canvas) => {
                        if (canvas && canvas !== signatureCanvas) {
                          setSignatureCanvas(canvas);
                          const ctx = canvas.getContext('2d');
                          let isDrawing = false;
                          let lastX = 0;
                          let lastY = 0;

                          // Set canvas size
                          const rect = canvas.getBoundingClientRect();
                          canvas.width = rect.width;
                          canvas.height = 150;

                          // Set drawing context properties
                          if (ctx) {
                            ctx.strokeStyle = '#000';
                            ctx.lineWidth = 2;
                            ctx.lineCap = 'round';
                            ctx.lineJoin = 'round';
                            ctx.imageSmoothingEnabled = true;
                          }

                          const getEventPos = (e: MouseEvent | TouchEvent) => {
                            const rect = canvas.getBoundingClientRect();
                            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
                            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
                            return {
                              x: (clientX - rect.left) * (canvas.width / rect.width),
                              y: (clientY - rect.top) * (canvas.height / rect.height)
                            };
                          };

                          const startDrawing = (e: MouseEvent | TouchEvent) => {
                            e.preventDefault();
                            isDrawing = true;
                            const pos = getEventPos(e);
                            lastX = pos.x;
                            lastY = pos.y;
                            
                            if (ctx) {
                              ctx.beginPath();
                              ctx.moveTo(lastX, lastY);
                            }
                          };

                          const draw = (e: MouseEvent | TouchEvent) => {
                            e.preventDefault();
                            if (!isDrawing || !ctx) return;
                            
                            const pos = getEventPos(e);
                            
                            ctx.lineTo(pos.x, pos.y);
                            ctx.stroke();
                            
                            lastX = pos.x;
                            lastY = pos.y;
                          };

                          const stopDrawing = (e: MouseEvent | TouchEvent) => {
                            e.preventDefault();
                            if (!isDrawing) return;
                            isDrawing = false;
                            
                            if (ctx) {
                              ctx.closePath();
                            }

                            // Get signature data and handle it after drawing stops
                            const signatureDataUrl = canvas.toDataURL();
                            handleSignatureChange(signatureDataUrl);
                          };

                          // Mouse events
                          canvas.addEventListener('mousedown', startDrawing);
                          canvas.addEventListener('mousemove', draw);
                          canvas.addEventListener('mouseup', stopDrawing);
                          canvas.addEventListener('mouseleave', stopDrawing);

                          // Touch events for mobile
                          canvas.addEventListener('touchstart', startDrawing);
                          canvas.addEventListener('touchmove', draw);
                          canvas.addEventListener('touchend', stopDrawing);
                          canvas.addEventListener('touchcancel', stopDrawing);
                        }
                      }}
                      className="w-full h-[150px] cursor-crosshair"
                      style={{ touchAction: 'none' }}
                    />
                    {!signatureData && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-gray-400 text-sm">Sign with mouse, touch, or stylus</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                    >
                      Clear Signature
                    </button>
                    <p className="text-xs text-gray-500">Sign with mouse, touch, or stylus</p>
                  </div>
                </div>
                {errors.signature && (
                  <p className="text-red-500 text-xs mt-1">{errors.signature}</p>
                )}
              </div>

            {/* Upload Progress */}
            {uploadProgress && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-700">{uploadProgress}</span>
                </div>
              </div>
            )}

            {/* Place Order Button */}
            <button 
              onClick={handleSubmit}
              disabled={!termsAccepted || isSubmitting}
              className={`w-full mt-6 py-3 px-6 rounded font-medium transition-colors ${
                termsAccepted && !isSubmitting
                  ? (state.selectedPlan.duration === 1 ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700') + ' text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 
                (uploadProgress || (state.selectedPlan.duration === 1 ? 'Processing Full Payment...' : 'Creating Payment Plan...')) : 
                (state.selectedPlan.duration === 1 ? 'Pay Full Amount Now' : 'Place order')
              }
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CheckoutForm;
