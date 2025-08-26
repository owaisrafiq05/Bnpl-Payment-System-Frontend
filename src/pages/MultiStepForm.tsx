import React from 'react';
import { usePaymentForm } from '../context/PaymentFormContext';
import PaymentForm from '../components/PaymentForm';
import PaymentPlans from '../components/PaymentPlans';

const MultiStepForm: React.FC = () => {
  const { state, dispatch } = usePaymentForm();

  const handleSelectPlan = (plan: any) => {
    // Handle plan selection - you can add more logic here
    console.log('Selected plan:', plan);
    alert(`You selected the ${plan.duration}-month plan with monthly payment of $${plan.monthlyPayment}`);
  };

  const handleBackToForm = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 1 });
  };

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 1:
        return <PaymentForm />;
      case 2:
        return state.paymentPlans ? (
          <PaymentPlans
            paymentPlans={state.paymentPlans}
            onSelectPlan={handleSelectPlan}
            onBack={handleBackToForm}
            currentStep={state.currentStep}
          />
        ) : (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
              <p className="text-gray-600">No payment plans available. Please go back to the form.</p>
              <button
                onClick={handleBackToForm}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Back to Form
              </button>
            </div>
          </div>
        );
      default:
        return <PaymentForm />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentStep()}
    </div>
  );
};

export default MultiStepForm;
