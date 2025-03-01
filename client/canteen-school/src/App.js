import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import StudentsPage from "./pages/Students";
import MenusPage from "./pages/Menus";
import OrdersPage from "./pages/Orders";
import PaymentDuesPage from "./pages/PaymentDues";
import LandingPage from "./pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/menus" element={<MenusPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/payment_dues" element={<PaymentDuesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;