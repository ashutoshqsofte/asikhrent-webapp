import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Component/Dashboard';
import AddPayment from './Component/AddPayment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-payment" element={<AddPayment />} />
      </Routes>
    </Router>
  );
}

export default App;
