import { Outlet, Link } from 'react-router-dom';
import iconImg from '../assets/icon/icon2.svg';
import logoImg from '../assets/img/logo.png';

const UserLayout = ({ children }) => { // Thêm prop 'children'
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="flex justify-between items-center px-10 py-4 bg-[#4a554a] text-white shadow-md">
        {/* 1. Logo Section */}
        <Link to="/dashboard" className="flex items-center gap-2 no-underline hover:opacity-90">
           <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img src={logoImg} alt="Logo" className="w-10 h-10 rounded-full" />
           </div>
           <span className="text-xl tracking-wide text-white">HEALTHY FOOD</span>
        </Link>

        {/* 2. Navigation Menu */}
        <nav className="flex items-center gap-10 font-medium">
           <Link to="/blog" className="hover:text-[#c5d86d] transition-colors">Blog</Link>
           <Link to="/bmi" className="hover:text-[#c5d86d] transition-colors">Chỉ số cơ thể</Link>
           <Link to="/calorie" className="hover:text-[#c5d86d] transition-colors">Chỉ số calo</Link>
           <Link to="/calorie-tracker" className="hover:text-[#c5d86d] transition-colors">Tính toán calo</Link>
           <Link to="/dashboard" className="hover:text-[#c5d86d] transition-colors">Dashboard</Link>
        </nav>

        {/* 3. User Profile Section */}
        <Link to="/account/profile" className="flex items-center gap-3 text-white hover:text-[#c5d86d] transition-colors no-underline">
           
            <div className="w-7 h-7 ">
                <img 
                    src={iconImg} 
                    alt="User Avatar" 
                    className="w-full h-full object-cover" 
                />
            </div>
             <span className="font-medium">aaaaa</span>
        </Link>
      </header>

      {/* MAIN CONTENT */}
      {/* Ưu tiên render 'children' (từ AccountLayout) nếu có, nếu không thì render Outlet */}
      <main className="flex-1">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default UserLayout;