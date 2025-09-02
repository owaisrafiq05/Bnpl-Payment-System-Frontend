import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PaymentPlanService, type PlanDetailsResponse, type PaymentScheduleResponse } from '../services/paymentPlanService';
import { toast } from 'sonner';
import HeroSection from '../components/HeroSection';

const PlanDetails: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const [planDetails, setPlanDetails] = useState<PlanDetailsResponse | null>(null);
  const [schedule, setSchedule] = useState<PaymentScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlanData = async () => {
    if (!planId) {
      toast.error('Invalid plan ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [details, paymentSchedule] = await Promise.all([
        PaymentPlanService.getPlanDetails(planId),
        PaymentPlanService.getPlanSchedule(planId)
      ]);
      
      if (!details || !paymentSchedule) {
        throw new Error('Failed to fetch plan data');
      }

      setPlanDetails(details);
      setSchedule(paymentSchedule);
    } catch (error) {
      console.error('Error fetching plan data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch plan details');
      // Clear data on error
      setPlanDetails(null);
      setSchedule(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchPlanData, 30000);
    return () => clearInterval(interval);
  }, [planId]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!planDetails || !schedule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Plan Not Found</h2>
          <p className="text-gray-600 mt-2">The requested payment plan could not be found.</p>
        </div>
      </div>
    );
  }

  const progressPercentage = schedule?.summary
    ? (schedule.summary.completedPayments / schedule.summary.totalPayments) * 100
    : 0;

  return (
    <div>
      <HeroSection backgroundUrl="/bg-img.png" title="Payment Plan Details" />
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Payment Plan Details</h1>
              {planDetails?.paymentPlan?.customer && (
                <div className="mt-2 text-gray-600">
                  <p>{planDetails.paymentPlan.customer.name} • {planDetails.paymentPlan.customer.email}</p>
                  <p>Phone: {planDetails.paymentPlan.customer.phone}</p>
                </div>
              )}
            </div>
            {planDetails?.paymentPlan?.status && (
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                planDetails.paymentPlan.status === 'active' ? 'bg-green-100 text-green-800' :
                planDetails.paymentPlan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {planDetails.paymentPlan.status.charAt(0).toUpperCase() + planDetails.paymentPlan.status.slice(1)}
              </span>
            )}
          </div>
        </div>

        {/* Plan Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Plan Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Principal Amount</span>
                <span className="font-medium">
                  {planDetails?.paymentPlan?.principalAmount ? formatCurrency(planDetails.paymentPlan.principalAmount) : '-'}
                </span>
              </div>
              {planDetails?.paymentPlan?.upfrontPayment && planDetails.paymentPlan.upfrontPayment > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment</span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(planDetails.paymentPlan.upfrontPayment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining Amount</span>
                    <span className="font-medium">
                      {formatCurrency(planDetails.paymentPlan.remainingAmount)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Payment</span>
                <span className="font-medium">
                  {planDetails?.paymentPlan?.monthlyPayment ? formatCurrency(planDetails.paymentPlan.monthlyPayment) : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-medium">
                  {planDetails?.paymentPlan?.totalAmount ? formatCurrency(planDetails.paymentPlan.totalAmount) : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">
                  {planDetails?.paymentPlan?.duration ? `${planDetails.paymentPlan.duration} months` : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date</span>
                <span className="font-medium">
                  {planDetails?.paymentPlan?.startDate ? formatDate(planDetails.paymentPlan.startDate) : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date</span>
                <span className="font-medium">
                  {planDetails?.paymentPlan?.endDate ? formatDate(planDetails.paymentPlan.endDate) : '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress ({schedule?.summary?.completedPayments || 0}/{schedule?.summary?.totalPayments || 0} payments)</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed Payments</span>
                <span className="font-medium text-green-600">
                  {schedule?.summary?.completedPayments || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Payments</span>
                <span className="font-medium text-yellow-600">
                  {schedule?.summary?.pendingPayments || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Failed Payments</span>
                <span className="font-medium text-red-600">
                  {schedule?.summary?.failedPayments || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining Balance</span>
                <span className="font-medium">
                  {planDetails?.paymentPlan?.remainingBalance ? formatCurrency(planDetails.paymentPlan.remainingBalance) : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Payment Date</span>
                <span className="font-medium">
                  {schedule?.summary?.nextPaymentDate ? formatDate(schedule.summary.nextPaymentDate) : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Schedule</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedule?.schedule?.map((payment) => (
                  <tr key={payment.sequenceNumber} className={payment.status === 'completed' ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.sequenceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.isUpfrontPayment ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Upfront
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Monthly
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.scheduledDate ? formatDate(payment.scheduledDate) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.amount ? formatCurrency(payment.amount) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                        {payment.retryCount > 0 && (
                          <span className="ml-2 text-xs text-gray-500">
                            Retries: {payment.retryCount}
                          </span>
                        )}
                      </div>
                      {payment.status === 'failed' && (
                        <p className="mt-1 text-xs text-red-600 max-w-xs">
                          {payment.failureReason || 'Payment failed'}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.processedDate ? formatDate(payment.processedDate) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.amount ? formatCurrency(payment.amount) : '-'}
                    </td>
                  </tr>
                ))}
                {(!schedule?.schedule || schedule.schedule.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No payment schedule available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;
