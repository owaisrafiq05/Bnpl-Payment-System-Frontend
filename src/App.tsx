import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PaymentFormProvider } from './context/PaymentFormContext';
import { AuthProvider } from './context/AuthContext';
import MultiStepForm from './pages/MultiStepForm';
import PlanDetails from './pages/PlanDetails';
import AdminPortal from './pages/AdminPortal';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'sonner';
import './App.css';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <PaymentFormProvider>
        <Router>
          <div className="App bg-[#FFFFFF]">
            <Navbar />
            <Routes>
              <Route path="/" element={
                <>
                  <MultiStepForm />
                </>
              } />
              <Route path="/plan-details/:planId" element={<PlanDetails />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPortal />
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster position="top-right" richColors />
          </div>
        </Router>
      </PaymentFormProvider>
    </AuthProvider>
  );
}

export default App;
