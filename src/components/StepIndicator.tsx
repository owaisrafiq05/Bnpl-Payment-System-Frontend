import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps = 3 }) => {
  const getStepLabel = (stepNumber: number): string => {
    switch (stepNumber) {
      case 1:
        return 'Payment Details';
      case 2:
        return 'Select Plan';
      case 3:
        return 'Checkout';
      default:
        return `Step ${stepNumber}`;
    }
  };

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 transition-all duration-200 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <span className={`text-xs mt-2 text-center ${
                isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}>
                {getStepLabel(stepNumber)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
