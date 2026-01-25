import { Outlet, Link, useLocation } from 'react-router-dom';
import UserLayout from './UserLayout'; // Import UserLayout để kế thừa Header
import avatarImg from '../assets/img/Avatar.svg';
import iconImg from '../assets/icon/icon1.svg';

const AccountLayout = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);

    return (
        // Bọc toàn bộ bằng UserLayout để có header chung
        <UserLayout>
            <div style={styles.bodyWrapper}>
                {/* --- SIDEBAR BÊN TRÁI --- */}
                <aside style={styles.sidebar}>
                    <div style={styles.userInfo}>
                        <img src={avatarImg} alt="Avatar" style={styles.avatar} />
                        <div>
                            <div style={styles.userName}>aaaaa</div>
                            <Link to="/account/profile" style={styles.editProfileLink}>Sửa hồ sơ</Link>
                        </div>
                    </div>

                    <nav style={styles.nav}>
                        <div style={styles.menuTitle}>
                            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <img src={iconImg} style={{ width: '18px', marginRight: '5px' }} />
                                Tài khoản của tôi
                            </span>
                        </div>
                        <ul style={styles.menuList}>
                            <li>
                                <Link to="/account/profile" style={isActive('/account/profile') ? styles.activeLink : styles.link}>
                                    Hồ sơ
                                </Link>
                            </li>
                            <li>
                                <Link to="/account/address" style={isActive('/account/address') ? styles.activeLink : styles.link}>
                                    Địa chỉ
                                </Link>
                            </li>
                            <li>
                                <Link to="/account/change-password" style={isActive('/account/change-password') ? styles.activeLink : styles.link}>
                                    Đổi mật khẩu
                                </Link>
                            </li>
                        </ul>
                        
                        {/* Nút Đăng xuất */}
                        <div style={{marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #f0f0f0'}}>
                             <Link to="/login" style={{...styles.link, color: '#c94a4a'}}>
                                Đăng xuất
                            </Link>
                        </div>
                    </nav>
                </aside>

                {/* --- NỘI DUNG CHÍNH --- */}
                <main style={styles.mainContent}>
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
    userName: { fontWeight: '600', fontSize: '15px', color: '#222' },
    editProfileLink: { fontSize: '13px', color: '#888', textDecoration: 'none', hover: {color: '#007bff'} },
    nav: {},
    menuTitle: { fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' },
    menuList: { listStyle: 'none', padding: 0, margin: 0 },
    link: { display: 'block', padding: '10px 15px', textDecoration: 'none', color: '#555', fontSize: '14px', borderRadius: '6px', marginBottom: '5px' },
    activeLink: { display: 'block', padding: '10px 15px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', backgroundColor: '#e9f5ff', color: '#007bff', borderRadius: '6px', marginBottom: '5px' },
    mainContent: { flex: 1, padding: '30px 40px' }
};

export default AccountLayout;