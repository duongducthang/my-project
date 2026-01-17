import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ScrollToTop from '../components/common/ScrollToTop';
import ErrorToast from '../components/ErrorToast';
import { CartProvider } from '../contexts/CartContext';
import UserLayout from '../layouts/UserLayout';
import LoginPage from '../pages/auth/Login';
import RegisterPage from '../pages/auth/Register';
import DashboardPage from '../pages/dashboard/Dashboard';
import MenuPage from '../pages/order/Menu';
import CheckoutPage from '../pages/order/Checkout';

function App() {
  return (
    <CartProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop behavior="instant" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<UserLayout />}>
            <Route index element={<Navigate to="/menu" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            {/* TODO: Add your routes here */}
          </Route>
        </Routes>

        <ErrorToast />
      </Router>
    </CartProvider>
  );
}

export default App;
