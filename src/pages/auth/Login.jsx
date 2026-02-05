//Trang Đăng nhập 

import { useState } from 'react'; // Import useState để quản lý state cho form
import { Link, useNavigate } from 'react-router-dom'; // Import Link để chuyển trang, useNavigate để điều hướng

const Login = () => {
    const navigate = useNavigate(); 
    
    // STATE QUẢN LÝ DỮ LIỆU ĐĂNG NHẬP
    const [email, setEmail] = useState('');    // Lưu trữ email người dùng nhập
    const [password, setPassword] = useState(''); // Lưu trữ mật khẩu người dùng nhập

    // XỬ LÝ SỰ KIỆN ĐĂNG NHẬP
    const handleLogin = (e) => {
        e.preventDefault(); // Ngăn chặn trang load lại khi submit form

        // Lấy danh sách người dùng đã đăng ký từ localStorage
        const users = JSON.parse(localStorage.getItem('users_list') || '[]');//parse(string):chuyển chuỗi Json lấy từ localStorage ngược lại thành object/aray

        // Tìm kiếm người dùng khớp với Email và Mật khẩu đã nhập
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Nếu đúng: Lưu thông tin người dùng vào localStorage để duy trì phiên đăng nhập
            localStorage.setItem('currentUser', JSON.stringify(user)); //setItem:lưu dữ liệu
            
            // Cập nhật user_body_index từ thông tin người dùng đăng nhập
            const bodyIndex = JSON.parse(localStorage.getItem('user_body_index') || '{}'); //getItem:lấy dữ liệu
            localStorage.setItem('user_body_index', JSON.stringify({ //chuyển object/array thành chuỗi JSON để lưu
                ...bodyIndex,
                gender: user.gender === 'Nam' ? 'male' : 'female',
                age: user.age || ''
            }));

            // Phát sự kiện hệ thống để các component khác (Header, Sidebar...) cập nhật giao diện ngay lập tức
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new CustomEvent('userUpdate', { detail: user }));
            
            console.log("Đăng nhập thành công:", user);
            // Chuyển hướng người dùng về trang Thông tin cá nhân
            navigate('/account/profile'); 
        } else {
            // Nếu sai: Hiển thị thông báo lỗi
            alert("Email hoặc mật khẩu không chính xác!");
        }
    };

    return (
        <div style={styles.authWrapper}> {/* Khung bao quanh toàn bộ trang đăng nhập */}
            <div style={styles.authCard}> {/* Thẻ chứa form đăng nhập */}
                <h2 style={styles.authTitle}>Đăng nhập</h2>  {/* Tiêu đề trang đăng nhập */} 
                
                <form onSubmit={handleLogin} style={styles.authForm}> {/* Form đăng nhập */}
                    <div style={styles.inputGroup}>     {/* Nhóm nhập liệu cho email */}
                        <label style={styles.label}>Email</label>   {/* Nhãn cho ô nhập email */}
                        <input 
                            type="email" 
                            placeholder="Email" 
                            style={styles.input}  // Định dạng ô nhập
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required  
                        />
                    </div>

                    <div style={styles.inputGroup}>   {/* Nhóm nhập liệu cho mật khẩu */}
                        <label style={styles.label}>Mật khẩu</label>  {/* Nhãn cho ô nhập mật khẩu */}
                        <input 
                            type="password" 
                            placeholder="Nhập mật khẩu" 
                            style={styles.input} // Định dạng ô nhập
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required  
                        />
                    </div>

                    <div style={styles.buttonContainer}> {/* Khung chứa nút đăng nhập */}
                        <button type="submit" style={styles.submitBtn}>     {/* Nút gửi form */}
                            Đăng nhập
                        </button>
                    </div>
                </form>

                <p style={styles.footerText}> {/* Chữ ở dưới form đăng nhập */ }
                    Nếu chưa có tài khoản 
                    <Link to="/register" style={styles.link}> Đăng ký</Link> {/* Link đến trang đăng ký */}
                </p>
            </div>
        </div>
    );
};

const styles = {
    authWrapper: { // Khung bao quanh toàn bộ trang đăng nhập
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5', // Nền xám nhạt như trong ảnh
        fontFamily: 'sans-serif'
    },
    authCard: { // Thẻ chứa form đăng nhập
        width: '450px',
        padding: '60px 40px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)', // Đổ bóng rất nhẹ
        borderRadius: '4px'
    },
    authTitle: { // Tiêu đề trang đăng nhập
        fontSize: '28px', 
        fontWeight: 'bold', 
        marginBottom: '40px', 
        color: '#333',
        letterSpacing: '2px'
    },
    authForm: { // Form đăng nhập
        display: 'flex', 
        flexDirection: 'column', 
        gap: '25px', 
        textAlign: 'left' 
    },
    inputGroup: {   // Nhóm nhập liệu cho mỗi trường
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px' 
    },
    label: {    // Nhãn cho mỗi ô nhập liệu
        fontSize: '13px', 
        fontWeight: 'bold', 
        color: '#333' 
    },
    input: {   // Ô nhập liệu
        padding: '12px 15px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#fff'
    },
    buttonContainer: { // Khung chứa nút đăng nhập
        marginTop: '20px'
    },
    submitBtn: {    // Nút gửi form
        width: '100%',
        padding: '12px',
        backgroundColor: '#ffffff',
        border: '1px solid #333',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.3s ease'
    },
    footerText: {       // Chữ ở dưới form đăng nhập    
        marginTop: '30px', 
        fontSize: '13px', 
        color: '#333' 
    },
    link: {         // Định dạng link đến trang đăng ký
        color: '#ff66b2', // Màu hồng đặc trưng cho link chuyển trang
        textDecoration: 'none', 
        fontWeight: 'bold' 
    }
};

export default Login;