import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import UserLayout from './layouts/UserLayout';       // Layout chỉ có Header (cho Blog, BMI...)
import AccountLayout from './layouts/AccountLayout'; // Layout có Header + Sidebar (cho Profile...)

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Blog from './pages/dashboard/Blog';
import BMICalculator from './pages/dashboard/BMICalculator';
import CalorieCalculator from './pages/dashboard/CalorieCalculator';
import Profile from './pages/profile/Profile';
import Address from './pages/dashboard/Address';
import ChangePassword from './pages/dashboard/ChangePassword';
import Dashboard from './pages/dashboard/Dashboard';
import CalorieTracker from './pages/dashboard/CalorieTracker';

function App() {
    return (
        <Router>
            <Routes>
                {/* --- NHÓM 1: KHÔNG LAYOUT (Login/Register) --- */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* --- NHÓM 2: USER LAYOUT (Chỉ có Header, KHÔNG Sidebar) --- */}
                {/* Dành cho các trang tính năng chính, cần màn hình rộng */}
                <Route element={<UserLayout />}>
                    <Route path="/" element={<Navigate to="/blog" />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/bmi" element={<BMICalculator />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/calorie" element={<CalorieCalculator />} />
                    <Route path="/calorie-tracker" element={<CalorieTracker />} />
                    {/* Thêm các trang khác không cần sidebar ở đây */}
                </Route>

                {/* --- NHÓM 3: ACCOUNT LAYOUT (Có Header + Sidebar) --- */}
                {/* Dành riêng cho các trang cài đặt tài khoản */}
                <Route path="/account" element={<AccountLayout />}>
                    <Route index element={<Navigate to="profile" />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="address" element={<Address />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;