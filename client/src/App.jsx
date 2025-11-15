// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./about/page";         // Make sure this path is correct
import PaymentForm from "./Payments/PaymentPage"; // Make sure this exists

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment" element={<PaymentForm />} />
      </Routes>
    </Router>
  );
}

export default App;
