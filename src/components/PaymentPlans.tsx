"use client"

import type React from "react"
import { usePaymentForm } from "../context/PaymentFormContext"
import type { PaymentPlan } from "../context/PaymentFormContext"
import { ArrowLeft, CheckCircle, Clock } from "lucide-react"
import HeroSection from "./HeroSection"

interface PaymentPlansProps {
  paymentPlans: {
    customerName: string
    principalAmount: number
    interestRate: string
    availablePlans: PaymentPlan[]
  }
  onSelectPlan: (plan: PaymentPlan) => void
  onBack: () => void
  currentStep: number
}

const PaymentPlans: React.FC<PaymentPlansProps> = ({ paymentPlans, onSelectPlan, onBack }) => {
  const { dispatch } = usePaymentForm()

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handlePlanSelection = (plan: PaymentPlan) => {
    // Save selected plan to global state
    dispatch({ type: "SET_SELECTED_PLAN", payload: plan })

    // Navigate to checkout form (step 3)
    dispatch({ type: "SET_CURRENT_STEP", payload: 3 })

    // Call the onSelectPlan callback for any additional logic
    onSelectPlan(plan)
  }

  const sortedPlans = [...paymentPlans.availablePlans].sort((a, b) => {
    if (a.duration === 1) return 1 // Full payment goes last
    if (b.duration === 1) return -1 // Full payment goes last
    return a.duration - b.duration // Sort installments by duration
  })

  return (
    <div>
      <HeroSection backgroundUrl="/bg-img.png" title="Payment Plan" />
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Full Payment Section */}
        <h2 className="text-xl text-center font-semibold mb-4 text-gray-800">Full Payment Option</h2>
        <div className="flex justify-center mb-8">
          {sortedPlans.filter(plan => plan.duration === 1).map(plan => (
            <div key={plan.duration} className="bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md border-green-300 hover:border-green-400 w-80"
              onClick={() => handlePlanSelection(plan)}>
              <div className="mb-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  No Interest
                </span>
              </div>

              {/* Header with Icon and Title */}
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded flex items-center justify-center mr-3 bg-green-100">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Full Payment</h3>
                </div>
              </div>

              {/* Payment Amount */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">One-time Payment</div>
                <div className="text-lg font-semibold text-gray-800">{formatCurrency(plan.monthlyPayment)}</div>
              </div>

              {/* Financial Details */}
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium text-gray-800">{formatCurrency(plan.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest:</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
              </div>

              <button className="w-full py-2 px-4 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent mt-auto rounded-xl bg-green-600 hover:bg-green-700 text-white">
                Pay in Full
              </button>
            </div>
          ))}
        </div>

        {/* Installment Plans Section */}
        <div className="mb-8">
          <h2 className="text-xl text-center font-semibold mb-4 text-gray-800">Installment Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedPlans.filter(plan => plan.duration !== 1).map((plan) => {
              const isFullPayment = false;

            return (
              <div
                key={plan.duration}
                className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col h-full ${
                  isFullPayment ? "border-green-300 hover:border-green-400" : "border-gray-200 hover:border-blue-400"
                }`}
                onClick={() => handlePlanSelection(plan)}
              >
                {isFullPayment && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      No Interest
                    </span>
                  </div>
                )}

                {/* Header with Icon and Title */}
                <div className="flex items-center mb-4">
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center mr-3 ${
                      isFullPayment ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    {isFullPayment ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      {isFullPayment ? "Full Payment" : `${plan.duration} Months`}
                    </h3>
                  </div>
                </div>

                {/* Monthly Payment */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">
                    {isFullPayment ? "One-time Payment" : "Monthly Payment"}
                  </div>
                  <div className="text-lg font-semibold text-gray-800">{formatCurrency(plan.monthlyPayment)}</div>
                </div>

                {/* Financial Details */}
                <div className="space-y-2 mb-6 text-sm flex-grow">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium text-gray-800">{formatCurrency(plan.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest:</span>
                    <span className={`font-medium ${isFullPayment ? "text-green-600" : "text-gray-800"}`}>
                      {isFullPayment ? "FREE" : formatCurrency(plan.interestAmount)}
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full py-2 px-4 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent mt-auto rounded-xl ${
                    isFullPayment
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isFullPayment ? "Pay in Full" : "Select Plan"}
                </button>
              </div>
            )
          })}
        </div>
        </div>

        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 rounded border border-gray-300 text-gray-700 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Application
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export { PaymentPlans }
export default PaymentPlans
