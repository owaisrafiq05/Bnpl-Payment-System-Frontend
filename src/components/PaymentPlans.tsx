"use client"

import React from "react"
import { usePaymentForm } from "../context/PaymentFormContext"
import type { PaymentPlan } from "../context/PaymentFormContext"
import { ArrowLeft, CheckCircle, Clock, Loader2 } from "lucide-react"
import HeroSection from "./HeroSection"
import { PaymentPlanService, type CredeeProductRequest } from "../services/paymentPlanService"
import { toast } from "sonner"

interface PaymentPlansProps {
  paymentPlans: {
    customerName: string
    principalAmount: number
    interestRate: string
    upfrontPayment: number
    remainingAmount: number
    availablePlans: PaymentPlan[]
  }
  onSelectPlan: (plan: PaymentPlan) => void
  onBack: () => void
  currentStep: number
}

const PaymentPlans: React.FC<PaymentPlansProps> = ({ paymentPlans, onSelectPlan, onBack }) => {
  const { state, dispatch } = usePaymentForm()
  const [isLoading, setIsLoading] = React.useState(false)

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handlePlanSelection = async (plan: PaymentPlan) => {
    try {
      setIsLoading(true)
      
      // Save selected plan to global state
      dispatch({ type: "SET_SELECTED_PLAN", payload: plan })

      // Check if this is a pay-in-full plan (duration = 1)
      if (plan.duration === 1) {
        // For pay-in-full plans, redirect to checkout page
        dispatch({ type: "SET_CURRENT_STEP", payload: 3 })
        onSelectPlan(plan)
        return
      }

      // For plans with interest, call the Credee API
      // Get the user's upfront payment from form data
      const userUpfrontPayment = parseFloat(state.formData.upfrontPayment) || 0
      const userTotalAmount = parseFloat(state.formData.amount) || 0
      const serviceAmount = userTotalAmount
      
      // Debug: Log the plan data to understand the structure
      console.log('Plan data:', plan)
      console.log('Form data:', state.formData)
      console.log('User upfront payment:', userUpfrontPayment)
      console.log('User total amount:', userTotalAmount)
      console.log('Calculated service amount:', serviceAmount)
      
      const credeeRequest: CredeeProductRequest = {
        downpayment_amount: userUpfrontPayment, // Use the user's input for upfront payment
        product_name: `${plan.duration} Month Plan`,
        service_amount: serviceAmount, // Use the total amount the user enters
        product_description: `Plan ID: ${plan.duration}`, // Using plan duration as plan ID
        terms: plan.duration.toString(),
        redirect_uri: "https://google.com/",
        show_description: 1
      }
      
      // Debug: Log the request payload
      console.log('Credee API Request:', credeeRequest)

      const response = await PaymentPlanService.createCredeeProduct(credeeRequest)
      
      // Debug: Log the full response to understand the structure
      console.log('Credee API Response:', response)
      
      // Always redirect to product link for interest plans
      if (response && response.data && response.data.product_link) {
        // Redirect to the product link
        window.location.href = response.data.product_link
      } else {
        // If no product link, show error but don't redirect to checkout
        console.error('No product link received. Full response:', response)
        toast.error('Failed to create payment link. Please try again.')
      }
    } catch (error) {
      console.error('Error handling plan selection:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to process plan selection')
      
      // For interest plans, don't redirect to checkout on error - let user try again
      // Only redirect to checkout for pay-in-full plans
    } finally {
      setIsLoading(false)
    }
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
        {/* Payment Summary */}
        {paymentPlans.upfrontPayment > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Payment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium text-gray-800 ml-2">{formatCurrency(paymentPlans.principalAmount)}</span>
              </div>
              <div>
                <span className="text-gray-600">Down Payment:</span>
                <span className="font-medium text-blue-600 ml-2">{formatCurrency(paymentPlans.upfrontPayment)}</span>
              </div>
              <div>
                <span className="text-gray-600">Remaining Amount:</span>
                <span className="font-medium text-gray-800 ml-2">{formatCurrency(paymentPlans.remainingAmount)}</span>
              </div>
            </div>
          </div>
        )}

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
                <div className="text-lg font-semibold text-gray-800">{formatCurrency(plan.totalAmount)}</div>
              </div>

              {/* Financial Details */}
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest:</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
              </div>

              <button 
                className="w-full py-2 px-4 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent mt-auto rounded-xl bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </div>
                ) : (
                  "Pay in Full"
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Installment Plans Section */}
        <div className="mb-8">
          <h2 className="text-xl text-center font-semibold mb-2 text-gray-800">Installment Plans</h2>
          <p className="text-center text-xs text-black mb-4">
            * Subject to final calculations - Estimated costs only
          </p>
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
                  {plan.upfrontPayment > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Upfront:</span>
                        <span className="font-medium text-blue-600">{formatCurrency(plan.upfrontPayment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="font-medium text-gray-800">{formatCurrency(plan.remainingAmount)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest:</span>
                    <span className={`font-medium ${isFullPayment ? "text-green-600" : "text-gray-800"}`}>
                      {isFullPayment ? "FREE" : formatCurrency(plan.interestAmount)}
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full py-2 px-4 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent mt-auto rounded-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                    isFullPayment
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : (
                    isFullPayment ? "Pay in Full" : "Select Plan"
                  )}
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