import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PaymentPlanService, type PaymentPlanData } from '../services/paymentPlanService';
import HeroSection from '../components/HeroSection';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'completed' | 'failed' | 'pending';
  paymentType: 'single_payment' | '3_months' | '6_months' | '12_months';
  principalAmount: number;
  totalAmount: number;
  monthlyPayment: number;
  remainingBalance: number;
  duration: number;
  completedPayments: number;
  totalPayments: number;
  nextPaymentDate: string;
  createdDate: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
}

const AdminPortal: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const navigate = useNavigate();

  // Fetch real data from API
  useEffect(() => {
    const fetchPaymentPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await PaymentPlanService.getAllPaymentPlans(1, 100);
        
        // Debug: Log the actual API response structure
        console.log('API Response:', response);
        console.log('First plan data:', response.data[0]);
        
        // Check if response has data array
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid API response format: missing data array');
        }

        // Transform API data to UserData format
        const transformedUsers: UserData[] = response.data.map((plan: PaymentPlanData, index: number) => {
          try {
          // Safely handle bank details with fallbacks
          const bankDetails = plan.customerId?.bankDetails || {};
          const accountNumber = bankDetails.accountNumber || 'N/A';
          const maskedAccountNumber = accountNumber !== 'N/A' ? `****${accountNumber.slice(-4)}` : 'N/A';
          
          // Calculate next payment date (for active plans)
          let nextPaymentDate = '-';
          if (plan.status === 'active' && 
              plan.completedPayments !== undefined && 
              plan.totalPayments !== undefined && 
              plan.startDate &&
              plan.completedPayments < plan.totalPayments) {
            const startDate = new Date(plan.startDate);
            const nextPaymentMonth = startDate.getMonth() + plan.completedPayments + 1;
            const nextPayment = new Date(startDate.getFullYear(), nextPaymentMonth, startDate.getDate());
            nextPaymentDate = nextPayment.toISOString().split('T')[0];
          }

          // Map plan duration to payment type
          const getPaymentType = (duration: number): string => {
            switch (duration) {
              case 1: return 'single_payment';
              case 3: return '3_months';
              case 6: return '6_months';
              case 12: return '12_months';
              default: return `${duration}_months`;
            }
          };

          return {
            id: plan._id,
            name: plan.customerId?.name || 'Unknown',
            email: plan.customerId?.email || 'N/A',
            phone: plan.customerId?.phone || 'N/A',
            status: plan.status as 'active' | 'completed' | 'failed' | 'pending',
            paymentType: getPaymentType(plan.planDuration || 1) as 'single_payment' | '3_months' | '6_months' | '12_months',
            principalAmount: plan.principalAmount || 0,
            totalAmount: plan.totalAmountWithInterest || 0,
            monthlyPayment: plan.monthlyPayment || 0,
            remainingBalance: plan.remainingBalance || 0,
            duration: plan.planDuration || 0,
            completedPayments: plan.completedPayments || 0,
            totalPayments: plan.totalPayments || 0,
            nextPaymentDate,
            createdDate: plan.createdAt ? plan.createdAt.split('T')[0] : 'N/A',
            accountNumber: maskedAccountNumber,
            routingNumber: bankDetails.routingNumber || 'N/A',
            bankName: bankDetails.bankName || 'N/A'
          };
          } catch (transformError) {
            console.error(`Error transforming plan ${index}:`, transformError, plan);
            // Return a fallback user object for this plan
            return {
              id: plan._id || `plan-${index}`,
              name: 'Error Loading User',
              email: 'N/A',
              phone: 'N/A',
              status: 'pending' as const,
              paymentType: 'single_payment' as const,
              principalAmount: 0,
              totalAmount: 0,
              monthlyPayment: 0,
              remainingBalance: 0,
              duration: 0,
              completedPayments: 0,
              totalPayments: 0,
              nextPaymentDate: '-',
              createdDate: 'N/A',
              accountNumber: 'N/A',
              routingNumber: 'N/A',
              bankName: 'N/A'
            };
          }
        });

        setUsers(transformedUsers);
      } catch (err) {
        console.error('Error fetching payment plans:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch payment plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentPlans();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    if (dateString === '-') return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPaymentType = (paymentType: string): string => {
    switch (paymentType) {
      case 'single_payment':
        return 'Single Payment';
      case '3_months':
        return '3 Months';
      case '6_months':
        return '6 Months';
      case '12_months':
        return '12 Months';
      default:
        return paymentType;
    }
  };

  const getPaymentTypeColor = (paymentType: string): string => {
    switch (paymentType) {
      case 'single_payment':
        return 'bg-green-100 text-green-800';
      case '3_months':
        return 'bg-blue-100 text-blue-800';
      case '6_months':
        return 'bg-yellow-100 text-yellow-800';
      case '12_months':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter users based on search and payment type
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPaymentType = paymentTypeFilter === 'all' || user.paymentType === paymentTypeFilter;
    
    return matchesSearch && matchesPaymentType;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle row click to navigate to plan details
  const handleRowClick = (planId: string) => {
    navigate(`/plan-details/${planId}`);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-md w-full">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroSection backgroundUrl="/bg-img.png" title="Admin Portal" />
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Portal</h1>
              <p className="text-gray-600 mt-1">Manage payment plans and user accounts</p>
            </div>

          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or plan ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                />
              </div>
              
              <select
                value={paymentTypeFilter}
                onChange={(e) => setPaymentTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Payment Types</option>
                <option value="single_payment">Single Payment</option>
                <option value="3_months">3 Months</option>
                <option value="6_months">6 Months</option>
                <option value="12_months">12 Months</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {currentUsers.length} of {filteredUsers.length} users
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financial Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(user.id)}
                  >
                    {/* User Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                        <div className="text-xs text-gray-400">ID: {user.id}</div>
                      </div>
                    </td>

                    {/* Plan Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{user.duration} months</div>
                        <div className="text-sm text-gray-500">Monthly: {formatCurrency(user.monthlyPayment)}</div>
                        <div className="text-xs text-gray-400">Created: {formatDate(user.createdDate)}</div>
                      </div>
                    </td>

                    {/* Financial Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Principal: {formatCurrency(user.principalAmount)}</div>
                        <div className="text-sm text-gray-500">Total: {formatCurrency(user.totalAmount)}</div>
                        <div className="text-sm text-gray-500">Remaining: {formatCurrency(user.remainingBalance)}</div>
                      </div>
                    </td>

                    {/* Payment Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentTypeColor(user.paymentType)}`}>
                        {formatPaymentType(user.paymentType)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
                  <span className="font-medium">{filteredUsers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
