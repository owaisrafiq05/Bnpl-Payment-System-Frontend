import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PaymentFormProvider } from './context/PaymentFormContext';
import MultiStepForm from './pages/MultiStepForm';
import './App.css';

function App() {
  return (
    <PaymentFormProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MultiStepForm />} />
          </Routes>
        </div>
      </Router>
    </PaymentFormProvider>
  );
}

export default App;
