import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';       
import AccountLayout from './layouts/AccountLayout'; 
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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<UserLayout />}>
                    <Route path="/" element={<Navigate to="/blog" />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/bmi" element={<BMICalculator />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/calorie" element={<CalorieCalculator />} />
                    <Route path="/calorie-tracker" element={<CalorieTracker />} />
                </Route>

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