import React, { useState, useEffect } from 'react';
import { Search, Download, Eye } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Mock data - Replace with actual API call
  useEffect(() => {
    const mockUsers: UserData[] = [
      {
        id: 'PLN001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        status: 'active',
        paymentType: '12_months',
        principalAmount: 5000,
        totalAmount: 5950,
        monthlyPayment: 495.83,
        remainingBalance: 4165,
        duration: 12,
        completedPayments: 6,
        totalPayments: 12,
        nextPaymentDate: '2024-02-15',
        createdDate: '2023-08-15',
        accountNumber: '****7890',
        routingNumber: '123456789',
        bankName: 'Chase Bank'
      },
      {
        id: 'PLN002',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '(555) 234-5678',
        status: 'completed',
        paymentType: 'single_payment',
        principalAmount: 3000,
        totalAmount: 3000,
        monthlyPayment: 3000,
        remainingBalance: 0,
        duration: 1,
        completedPayments: 1,
        totalPayments: 1,
        nextPaymentDate: '-',
        createdDate: '2023-06-10',
        accountNumber: '****2345',
        routingNumber: '987654321',
        bankName: 'Bank of America'
      },
      {
        id: 'PLN003',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        phone: '(555) 345-6789',
        status: 'pending',
        paymentType: '6_months',
        principalAmount: 7500,
        totalAmount: 7800,
        monthlyPayment: 1300,
        remainingBalance: 7500,
        duration: 6,
        completedPayments: 0,
        totalPayments: 6,
        nextPaymentDate: '2024-01-20',
        createdDate: '2024-01-05',
        accountNumber: '****5678',
        routingNumber: '456789123',
        bankName: 'Wells Fargo'
      },
      {
        id: 'PLN004',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        phone: '(555) 456-7890',
        status: 'failed',
        paymentType: '3_months',
        principalAmount: 4500,
        totalAmount: 4650,
        monthlyPayment: 1550,
        remainingBalance: 4232.25,
        duration: 3,
        completedPayments: 1,
        totalPayments: 3,
        nextPaymentDate: '2024-01-25',
        createdDate: '2023-12-25',
        accountNumber: '****9012',
        routingNumber: '789123456',
        bankName: 'Citibank'
      },
      {
        id: 'PLN005',
        name: 'David Brown',
        email: 'david.brown@example.com',
        phone: '(555) 567-8901',
        status: 'active',
        paymentType: '12_months',
        principalAmount: 6000,
        totalAmount: 7140,
        monthlyPayment: 595,
        remainingBalance: 5355,
        duration: 12,
        completedPayments: 5,
        totalPayments: 12,
        nextPaymentDate: '2024-02-10',
        createdDate: '2023-09-10',
        accountNumber: '****3456',
        routingNumber: '321654987',
        bankName: 'PNC Bank'
      },
      {
        id: 'PLN006',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        phone: '(555) 678-9012',
        status: 'completed',
        paymentType: 'single_payment',
        principalAmount: 2500,
        totalAmount: 2500,
        monthlyPayment: 2500,
        remainingBalance: 0,
        duration: 1,
        completedPayments: 1,
        totalPayments: 1,
        nextPaymentDate: '-',
        createdDate: '2023-11-20',
        accountNumber: '****1234',
        routingNumber: '654321987',
        bankName: 'TD Bank'
      },
      {
        id: 'PLN007',
        name: 'Robert Garcia',
        email: 'robert.garcia@example.com',
        phone: '(555) 789-0123',
        status: 'active',
        paymentType: '6_months',
        principalAmount: 8000,
        totalAmount: 8320,
        monthlyPayment: 1386.67,
        remainingBalance: 6933.33,
        duration: 6,
        completedPayments: 1,
        totalPayments: 6,
        nextPaymentDate: '2024-02-05',
        createdDate: '2024-01-05',
        accountNumber: '****5679',
        routingNumber: '987123654',
        bankName: 'US Bank'
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
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



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
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

                    {/* Payment Progress */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{user.completedPayments}/{user.totalPayments}</div>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(user.completedPayments / user.totalPayments) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Next: {formatDate(user.nextPaymentDate)}
                        </div>
                      </div>
                    </td>

                    {/* Bank Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{user.bankName}</div>
                        <div className="text-sm text-gray-500">Acc: {user.accountNumber}</div>
                        <div className="text-xs text-gray-400">Routing: {user.routingNumber}</div>
                      </div>
                    </td>

                    {/* Payment Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentTypeColor(user.paymentType)}`}>
                        {formatPaymentType(user.paymentType)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Download className="h-4 w-4" />
                      </button>
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
  );
};

export default AdminPortal;
