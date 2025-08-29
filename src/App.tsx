import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PaymentFormProvider } from './context/PaymentFormContext';
import MultiStepForm from './pages/MultiStepForm';
import PlanDetails from './pages/PlanDetails';
import AdminPortal from './pages/AdminPortal';
import { Toaster } from 'sonner';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';

function App() {
  return (
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
            <Route path="/admin" element={<AdminPortal />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </PaymentFormProvider>
  );
}

export default App;
