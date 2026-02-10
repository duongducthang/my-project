//Trang Account-Đăng xuất-Chỉnh sửa Profile

import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import UserLayout from './UserLayout'; 
import avatarImg from '../assets/img/Avatar.svg';
import iconImg from '../assets/icon/icon1.svg';

const AccountLayout = () => {
    const location = useLocation();  
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = () => {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            } else {
                navigate('/login');
            }
        };

        loadUser();

        window.addEventListener('storage', loadUser);
        window.addEventListener('userUpdate', loadUser); 

        return () => {
            window.removeEventListener('storage', loadUser);
            window.removeEventListener('userUpdate', loadUser);
        };
    }, [navigate]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <UserLayout>
            <style>{`
                .body-wrapper { 
                    display: flex; 
                    max-width: 1200px; 
                    margin: 20px auto; 
                    width: 100%; 
                    min-height: calc(100vh - 80px); 
                    background-color: #fff; 
                    border-radius: 8px; 
                    overflow: hidden; 
                }
                @media (max-width: 992px) {
                    .body-wrapper { flex-direction: column !important; margin: 10px auto !important; padding: 0 !important; width: calc(100% - 20px) !important; }
                    .sidebar-container { width: 100% !important; border-right: none !important; border-bottom: 1px solid #f0f0f0 !important; padding: 15px !important; }
                    .main-content-container { padding: 15px !important; width: 100% !important; }
                    .nav-menu { display: flex !important; flex-wrap: wrap !important; gap: 8px !important; margin-left: 0 !important; }
                    .menu-item { width: calc(50% - 4px) !important; margin-bottom: 0 !important; }
                    .user-info-box { margin-bottom: 15px !important; padding-bottom: 15px !important; }
                    .menu-title { font-size: 13px !important; margin-bottom: 10px !important; }
                }
                @media (max-width: 576px) {
                    .menu-item { width: 100% !important; }
                }
            `}</style>
            <div className="body-wrapper">
                {/* --- SIDEBAR BÊN TRÁI --- */}
                <aside style={styles.sidebar} className="sidebar-container"> 
                    <div style={styles.userInfo} className="user-info-box">
                        <img src={user?.avatar || avatarImg} alt="Avatar" style={styles.avatar} />
                        <div>
                            <div style={styles.userName}>{user ? user.userName || user.fullName : 'Guest'}</div>
                            <Link to="/account/profile" style={styles.editProfileLink}>Sửa hồ sơ</Link> 
                        </div>
                    </div>

                    <nav style={styles.nav} className="nav-container">
                        <div style={styles.menuTitle}> 
                            <span style={{ display: 'inline-flex', alignItems: 'center' }}> 
                                <img src={iconImg} style={{ width: '18px', marginRight: '5px' }} />
                                Tài khoản của tôi
                            </span>
                        </div>
                        <ul style={styles.menuList} className="nav-menu"> 
                            <li className="menu-item">
                                <Link to="/account/profile" style={{...styles.link, backgroundColor: isActive('/account/profile') ? '#f0f0f0' : 'transparent', fontWeight: isActive('/account/profile') ? '600' : '400', padding: '10px'}}>Hồ sơ</Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/account/address" style={{...styles.link, backgroundColor: isActive('/account/address') ? '#f0f0f0' : 'transparent', fontWeight: isActive('/account/address') ? '600' : '400', padding: '10px'}}>Địa chỉ</Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/account/change-password" style={{...styles.link, backgroundColor: isActive('/account/change-password') ? '#f0f0f0' : 'transparent', fontWeight: isActive('/account/change-password') ? '600' : '400', padding: '10px'}}>Đổi mật khẩu</Link>
                            </li>
                            <li className="menu-item">
                                <a href="/login" onClick={handleLogout} style={{...styles.link, color: '#c94a4a', textDecoration: 'none', padding: '10px'}}> 
                                    Đăng xuất
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* --- NỘI DUNG CHÍNH --- */}
                <main style={styles.mainContent} className="main-content-container"> 
                    <Outlet />  
                </main>
            </div>
        </UserLayout>
    );
};

// Styles
const styles = {
    bodyWrapper: { display: 'flex', maxWidth: '1200px', margin: '20px auto', width: '100%', minHeight: 'calc(100vh - 80px)', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }, 
    sidebar: { width: '250px', padding: '30px 20px', borderRight: '1px solid #f0f0f0', background: '#fafafa' },
    userInfo: { display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }, 
    avatar: { width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' },
    userName: { fontWeight: '700', fontSize: '15px', color: '#262626' },
    editProfileLink: { fontSize: '13px', color: '#138CE3', textDecoration: 'none', hover: {color: '#007bff'} }, 
    nav: {},
    menuTitle: { fontSize: '14px', marginBottom: '5px', color: '#00000',fontWeight:'bold'},
    menuList: { listStyle: 'none', padding: 0, margin: 0,marginLeft:'10px'},
    link: { display: 'block', padding: '10px 15px', textDecoration: 'none', color: '#555', fontSize: '14px', borderRadius: '6px', marginBottom: '5px' },
    activeLink: { display: 'block', padding: '10px 15px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', color: '#138CE3', marginBottom: '5px' },
    mainContent: { flex: 1, padding: '30px 40px' }
};

export default AccountLayout;