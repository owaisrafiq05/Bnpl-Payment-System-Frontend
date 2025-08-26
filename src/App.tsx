
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MultiStepForm from './pages/MultiStepForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MultiStepForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
