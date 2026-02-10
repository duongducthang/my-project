//Trang Đăng Ký

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { locations } from '../../constants/locations.js'; 

const Register = () => {
    const navigate = useNavigate();
    
    // STATE QUẢN LÝ DỮ LIỆU ĐĂNG KÝ
    const [formData, setFormData] = useState({ 
        userName: '',    
        birthday: '',    
        email: '',       
        password: '',    
        phone: '',       
        gender: 'Nam',   
        province: '', 
        district: '',  
        address: ''    
    });

    const [districts, setDistricts] = useState([]);

    // SIDE EFFECTS - Cập nhật danh sách quận/huyện khi tỉnh/thành thay đổi
    useEffect(() => {
        if (formData.province) {
            const selectedLocation = locations.find(loc => loc.name === formData.province);
            setDistricts(selectedLocation ? selectedLocation.districts : []);
            setFormData(prev => ({ ...prev, district: '' }));
        } else {
            setDistricts([]);
            setFormData(prev => ({ ...prev, district: '' }));
        }
    }, [formData.province]);

    // XỬ LÝ SỰ KIỆN
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = (e) => {
        e.preventDefault();
        
        const users = JSON.parse(localStorage.getItem('users_list') || '[]');
        
        if (users.find(u => u.email === formData.email)) {
            alert("Email này đã được đăng ký!");
            return;
        }

        let userAge = '';
        if (formData.birthday) {
            const birthDate = new Date(formData.birthday);
            const today = new Date();
            userAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                userAge--;
            }
        
            if (userAge < 0) userAge = 0;
        }

        const newUser = { 
            ...formData, 
            id: Date.now(),
            age: userAge
        };
        users.push(newUser);

        localStorage.setItem('users_list', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser)); 

        const bodyIndex = JSON.parse(localStorage.getItem('user_body_index') || '{}');
        localStorage.setItem('user_body_index', JSON.stringify({
            ...bodyIndex,
            gender: formData.gender === 'Nam' ? 'male' : 'female',
            age: userAge
        }));

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('userUpdate', { detail: newUser }));

        console.log("Đăng ký thành công:", newUser);
        navigate('/account/profile');
    };

    return (
        <div style={styles.authWrapper}> 
            <div style={styles.registerCard}> 
                <p style={styles.welcomeText}>Welcome!</p> 
                <h2 style={styles.authTitle}>Đăng ký tài khoản</h2>
                
                <form onSubmit={handleRegister} style={styles.authForm}>  
                    <div style={styles.inputGroup}> 
                        <label style={styles.label}> 
                            <span style={styles.required}>*</span> Họ và tên
                        </label>
                        <input 
                            name="userName" 
                            type="text" 
                            style={styles.input} 
                            placeholder="Họ và tên"
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    {/* Hàng 2: Ngày sinh & Email */}
                    <div style={styles.rowGrid}> 

                        <div style={styles.inputGroup}> 
                            <label style={styles.label}>Ngày sinh</label> 
                            <input 
                                name="birthday"
                                type="date" 
                                style={styles.input}   
                                max={new Date().toISOString().split("T")[0]} 
                                value={formData.birthday}   
                                onChange={handleChange}                
                            />
                        </div>

                        <div style={styles.inputGroup}> 
                            <label style={styles.label}> 
                                <span style={styles.required}>*</span> Email  
                            </label>
                            <input 
                                name="email"
                                type="email" 
                                placeholder="Nhập Email" 
                                style={styles.input}  
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>

                    {/* Hàng 3: Mật khẩu & Số điện thoại */}
                    <div style={styles.rowGrid}> 
                        <div style={styles.inputGroup}> 
                            <label style={styles.label}> 
                                <span style={styles.required}>*</span> Mật khẩu 
                            </label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="Nhập mật khẩu" 
                                style={styles.input} 
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <div style={styles.inputGroup}> 
                            <label style={styles.label}> 
                                <span style={styles.required}>*</span> Số điện thoại 
                            </label>
                            <input 
                                name="phone"
                                type="text" 
                                placeholder="Nhập số điện thoại" 
                                style={styles.input} 
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>

                    {/* Giới tính */}
                    <div style={styles.inputGroup}> { /* Nhóm nhập liệu cho giới tính */ }
                        <label style={styles.label}>Giới tính</label> { /* Nhãn cho ô nhập giới tính */ }
                        <select name="gender" style={styles.input} onChange={handleChange} value={formData.gender}> { /* Ô chọn giới tính */ }
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>

                    {/* Tỉnh thành */}
                    <div style={styles.inputGroup}> { /* Nhóm nhập liệu cho tỉnh/thành */ }
                        <label style={styles.label}> { /* Nhãn cho ô nhập tỉnh/thành */ }
                            <span style={styles.required}>*</span> Tỉnh/Thành phố 
                        </label>
                        <select name="province" style={styles.input} onChange={handleChange} required value={formData.province}> {/* Ô chọn tỉnh/thành */ }
                            <option value="">Chọn tỉnh/thành</option>
                            {locations.map(loc => ( // Lặp qua danh sách locations để tạo các option
                                <option key={loc.name} value={loc.name}>{loc.name}</option> // Tên tỉnh/thành của option
                            ))}
                        </select>
                    </div>

                    {/* Quận/Huyện */}
                    <div style={styles.inputGroup}> { /* Nhóm nhập liệu cho quận/huyện */ }
                        <label style={styles.label}> { /* Nhãn cho ô nhập quận/huyện */ }
                            <span style={styles.required}>*</span> Quận/Huyện 
                        </label>
                        <select name="district" style={styles.input} onChange={handleChange} required value={formData.district} disabled={!formData.province}> { /* Ô chọn quận/huyện, vô hiệu hóa nếu chưa chọn tỉnh/thành */ }
                            <option value="">Chọn quận/huyện</option> { /* Option mặc định */ }
                            {districts.map(dist => ( // Lặp qua danh sách quận/huyện để tạo các option */}
                                <option key={dist} value={dist}>{dist}</option> // Tên quận/huyện của option
                            ))}
                        </select>
                    </div>

                    {/* Địa chỉ chi tiết */}
                    <div style={styles.inputGroup}> {/* Nhóm nhập liệu cho địa chỉ chi tiết */ }
                        <label style={styles.label}>Địa chỉ</label> { /* Nhãn cho ô nhập địa chỉ chi tiết */ }
                        <input 
                            name="address"
                            type="text" 
                            placeholder="Số nhà, tên đường..." 
                            style={styles.input} 
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" style={styles.submitBtn}>Đăng ký</button> 
                </form>

                <p style={styles.footerText}> { /* Chữ ở dưới form đăng ký */ }
                    Người dùng đã đăng ký <Link to="/login" style={styles.link}>Đăng nhập</Link> {/* Link đến trang đăng nhập */ }
                </p>
            </div>
        </div>
    );
};

const styles = {
    authWrapper: { // Khung bao quanh toàn bộ trang đăng ký
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '40px 0',
        fontFamily: 'sans-serif'
    },
    registerCard: {// Thẻ chứa form đăng ký
        width: '600px',
        padding: '50px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        borderRadius: '4px'
    },
    welcomeText: { fontSize: '12px', color: '#888', marginBottom: '8px' }, // Chữ nhỏ phía trên tiêu đề
    authTitle: { fontSize: '26px', fontWeight: 'bold', marginBottom: '40px', color: '#333' },// Tiêu đề trang đăng ký
    authForm: { display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }, // Form đăng ký
    rowGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }, // Khung grid cho 2 ô nằm ngang
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' }, // Nhóm nhập liệu cho mỗi trường
    label: { fontSize: '13px', fontWeight: 'bold', color: '#333' }, // Nhãn cho mỗi ô nhập liệu
    required: { color: 'red', marginRight: '4px' }, // Dấu sao đỏ cho trường bắt buộc
    input: { // Ô nhập liệu
        padding: '10px 12px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: '100%',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        appearance: 'auto'
    },
    submitBtn: { // Nút gửi form
        marginTop: '20px',
        padding: '12px',
        backgroundColor: '#ffffff',
        border: '1px solid #333',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '14px'
    },
    footerText: { marginTop: '25px', fontSize: '13px', color: '#333' }, // Chữ ở dưới form đăng ký
    link: { color: '#ff66b2', textDecoration: 'none', fontWeight: 'bold' }  // Định dạng link đến trang đăng nhập
};

export default Register;