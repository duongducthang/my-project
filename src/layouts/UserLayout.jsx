import { useState, useEffect } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import AvatarImg from '../assets/img/Avatar.svg';
import logoImg from '../assets/img/logo.png';

const UserLayout = ({ children }) => {
  // QUẢN LÝ THÔNG TIN NGƯỜI DÙNG
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem('currentUser'); 
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    };

    loadUser(); 

    window.addEventListener('storage', loadUser);
    window.addEventListener('userUpdate', loadUser);

    return () => {  
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('userUpdate', loadUser);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      {/* --- PHẦN HEADER --- */}
      <header className="sticky top-0 z-50 bg-[#4d554e] text-white shadow-md w-full">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center px-4 md:px-10 py-3 md:py-4 gap-4">
          {/* Khu vực Logo và Tên trang */}
          <Link to="/dashboard" className="flex items-center gap-2 no-underline hover:opacity-90 shrink-0 min-w-0">
             <div className="w-10 h-10 md:w-14 lg:w-16 md:h-14 lg:h-16 rounded-full flex items-center justify-center">
                <img src={logoImg} alt="Logo" className="w-full h-full rounded-full object-cover" />
             </div>
             <span className="text-sm sm:text-base md:text-lg lg:text-xl tracking-wide font-['Itim'] text-white truncate">HEALTHY FOOD</span>
          </Link>

          {/* Nút Menu Mobile */}
          <button 
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>

          {/* Menu Điều hướng chính (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10 font-medium">
             <NavLink 
               to="/blog" 
               className={({ isActive }) => isActive ? "text-[#BF9528]" : "hover:text-[#BF9528] transition-colors"}
             >
               Blog
             </NavLink>
             
             <NavLink 
               to="/bmi" 
               className={({ isActive }) => isActive ? "text-[#BF9528]" : "hover:text-[#BF9528] transition-colors"}
             >
               Chỉ số cơ thể
             </NavLink>

             <NavLink 
               to="/calorie" 
               className={({ isActive }) => isActive ? "text-[#BF9528]" : "hover:text-[#BF9528] transition-colors"}
             >
               Chỉ số calo
             </NavLink>

             <NavLink 
               to="/calorie-tracker" 
               className={({ isActive }) => isActive ? "text-[#BF9528]" : "hover:text-[#BF9528] transition-colors"}
             >
               Tính toán calo
             </NavLink>

             <NavLink 
               to="/dashboard" 
               className={({ isActive }) => isActive ? "text-[#BF9528]" : "hover:text-[#BF9528] transition-colors"}
             >
               Dashboard
             </NavLink>
          </nav>

          {/* Khu vực Thông tin cá nhân / Đăng nhập (Desktop) */}
          <div className="hidden md:block">
            <NavLink 
              to="/account/profile" 
              className={({ isActive }) => 
                `flex items-center gap-3 no-underline transition-colors shrink-0 ${isActive ? "text-[#BF9528]" : "text-white hover:text-[#BF9528]"}`
              }
            >
                <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden">
                    <img 
                        src={user?.avatar || AvatarImg} 
                        alt="User Avatar" 
                        className="w-full h-full object-cover" 
                    />
                </div>
                 <span className="font-medium hidden lg:inline">
                    {user ? (user.userName || user.fullName) : 'Đăng nhập'}
                 </span>
            </NavLink>
          </div>
        </div>

        {/* Menu Mobile (Dropdown) */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] border-t border-white/10' : 'max-h-0'}`}>
          <nav className="flex flex-col p-4 gap-4 bg-[#4d554e]">
             <NavLink 
               to="/blog" 
               onClick={() => setIsMenuOpen(false)}
               className={({ isActive }) => `px-4 py-2 rounded-lg ${isActive ? "bg-[#BF9528] text-white" : "hover:bg-white/10 text-white"}`}
             >
               Blog
             </NavLink>
             
             <NavLink 
               to="/bmi" 
               onClick={() => setIsMenuOpen(false)}
               className={({ isActive }) => `px-4 py-2 rounded-lg ${isActive ? "bg-[#BF9528] text-white" : "hover:bg-white/10 text-white"}`}
             >
               Chỉ số cơ thể
             </NavLink>

             <NavLink 
               to="/calorie" 
               onClick={() => setIsMenuOpen(false)}
               className={({ isActive }) => `px-4 py-2 rounded-lg ${isActive ? "bg-[#BF9528] text-white" : "hover:bg-white/10 text-white"}`}
             >
               Chỉ số calo
             </NavLink>

             <NavLink 
               to="/calorie-tracker" 
               onClick={() => setIsMenuOpen(false)}
               className={({ isActive }) => `px-4 py-2 rounded-lg ${isActive ? "bg-[#BF9528] text-white" : "hover:bg-white/10 text-white"}`}
             >
               Tính toán calo
             </NavLink>

             <NavLink 
               to="/dashboard" 
               onClick={() => setIsMenuOpen(false)}
               className={({ isActive }) => `px-4 py-2 rounded-lg ${isActive ? "bg-[#BF9528] text-white" : "hover:bg-white/10 text-white"}`}
             >
               Dashboard
             </NavLink>

             <div className="h-px bg-white/10 my-2"></div>

             <NavLink 
              to="/account/profile" 
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive ? "bg-[#BF9528] text-white" : "text-white hover:bg-white/10"}`
              }
            >
                <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden">
                    <img 
                        src={user?.avatar || AvatarImg} 
                        alt="User Avatar" 
                        className="w-full h-full object-cover" 
                    />
                </div>
                 <span className="font-medium">
                    {user ? (user.userName || user.fullName) : 'Đăng nhập'}
                 </span>
            </NavLink>
          </nav>
        </div>
      </header>

      {/* --- PHẦN NỘI DUNG CHÍNH --- */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-0 md:px-4">
        {/* Hiển thị 'children' nếu được truyền trực tiếp, hoặc dùng 'Outlet' cho Router */}
        <div className="w-full h-full">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default UserLayout;