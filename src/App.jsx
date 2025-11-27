import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
import ErrorToast from './components/ErrorToast';
import UserLayout from './layouts/UserLayout';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import DashboardPage from './pages/dashboard/Dashboard';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop behavior="instant" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<UserLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          {/* TODO: Add your routes here */}
        </Route>
      </Routes>

      <ErrorToast />
    </Router>
  );
}

export default App;
