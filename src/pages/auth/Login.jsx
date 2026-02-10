//Trang Đăng nhập 

import { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 

const Login = () => {
    const navigate = useNavigate(); 
    
    // STATE QUẢN LÝ DỮ LIỆU ĐĂNG NHẬP
    const [email, setEmail] = useState('');   
    const [password, setPassword] = useState(''); 

    // XỬ LÝ SỰ KIỆN ĐĂNG NHẬP
    const handleLogin = (e) => {
        e.preventDefault(); 

        const users = JSON.parse(localStorage.getItem('users_list') || '[]');
        
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user)); 
            
            const bodyIndex = JSON.parse(localStorage.getItem('user_body_index') || '{}'); 
            localStorage.setItem('user_body_index', JSON.stringify({ 
                ...bodyIndex,
                gender: user.gender === 'Nam' ? 'male' : 'female',
                age: user.age || ''
            }));

            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new CustomEvent('userUpdate', { detail: user }));
            
            console.log("Đăng nhập thành công:", user);
            navigate('/account/profile'); 
        } else {
            alert("Email hoặc mật khẩu không chính xác!");
        }
    };

    return (
        <div style={styles.authWrapper}> 
            <div style={styles.authCard}> 
                <h2 style={styles.authTitle}>Đăng nhập</h2>  
                
                <form onSubmit={handleLogin} style={styles.authForm}> 
                    <div style={styles.inputGroup}>     
                        <label style={styles.label}>Email</label>  
                        <input 
                            type="email" 
                            placeholder="Email" 
                            style={styles.input} 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required  
                        />
                    </div>

                    <div style={styles.inputGroup}>  
                        <label style={styles.label}>Mật khẩu</label>  
                        <input 
                            type="password" 
                            placeholder="Nhập mật khẩu" 
                            style={styles.input} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required  
                        />
                    </div>

                    <div style={styles.buttonContainer}> 
                        <button type="submit" style={styles.submitBtn}>   
                            Đăng nhập
                        </button>
                    </div>
                </form>

                <p style={styles.footerText}> 
                    Nếu chưa có tài khoản 
                    <Link to="/register" style={styles.link}> Đăng ký</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    authWrapper: { 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5', 
        fontFamily: 'sans-serif'
    },
    authCard: { 
        width: '450px',
        padding: '60px 40px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)', 
        borderRadius: '4px'
    },
    authTitle: { 
        fontSize: '28px', 
        fontWeight: 'bold', 
        marginBottom: '40px', 
        color: '#333',
        letterSpacing: '2px'
    },
    authForm: {
        display: 'flex', 
        flexDirection: 'column', 
        gap: '25px', 
        textAlign: 'left' 
    },
    inputGroup: {   
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px' 
    },
    label: {    
        fontSize: '13px', 
        fontWeight: 'bold', 
        color: '#333' 
    },
    input: {  
        padding: '12px 15px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#fff'
    },
    buttonContainer: { 
        marginTop: '20px'
    },
    submitBtn: {    
        width: '100%',
        padding: '12px',
        backgroundColor: '#ffffff',
        border: '1px solid #333',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.3s ease'
    },
    footerText: {           
        marginTop: '30px', 
        fontSize: '13px', 
        color: '#333' 
    },
    link: {        
        color: '#ff66b2', 
        textDecoration: 'none', 
        fontWeight: 'bold' 
    }
};

export default Login;