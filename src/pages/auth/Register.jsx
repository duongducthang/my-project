//Trang Đăng Ký

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { locations } from '../../constants/locations.js'; 
import axiosClient from '../../services/axiosClient';
import { persistAuth } from '../../utils/session';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ 
        userName: '',    
        fullName: '',    
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'fullName') {
            setFormData(prev => ({ ...prev, fullName: value, userName: prev.userName || value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleRegister = async (e) => {
        e.preventDefault(); 
        try {
            const payload = { 
                ...formData, 
                userName: formData.userName || formData.fullName || formData.email.split('@')[0] 
            };
            const res = await axiosClient.post('/auth/register', payload);
            
            persistAuth(res?.access_token, res?.user);
            
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new CustomEvent('userUpdate', { detail: res?.user }));
            
            navigate('/account/profile');
        } catch (err) {
            alert(err?.message || 'Đăng ký thất bại!');
        }
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
                            name="fullName" 
                            type="text" 
                            style={styles.input} 
                            placeholder="Nhập họ và tên đầy đủ"
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    
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

                    
                    <div style={styles.rowGrid}> 
                        <div style={styles.inputGroup}> 
                            <label style={styles.label}>
                                <span style={styles.required}>*</span> Mật khẩu 
                            </label>
                            <input 
                                name="password" //
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

                    <div style={styles.inputGroup}> 
                        <label style={styles.label}>Giới tính</label>
                        <select name="gender" style={styles.input} onChange={handleChange} value={formData.gender}> 
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>

                    
                    <div style={styles.inputGroup}> 
                        <label style={styles.label}>
                            <span style={styles.required}>*</span> Tỉnh/Thành phố 
                        </label>
                        <select name="province" style={styles.input} onChange={handleChange} required value={formData.province}>
                            <option value="">Chọn tỉnh/thành</option>
                            {locations.map(loc => ( 
                                <option key={loc.name} value={loc.name}>{loc.name}</option> 
                            ))}
                        </select>
                    </div>

                    {/* Quận/Huyện */}
                    <div style={styles.inputGroup}> 
                        <label style={styles.label}> 
                            <span style={styles.required}>*</span> Quận/Huyện 
                        </label>
                        <select name="district" style={styles.input} onChange={handleChange} required value={formData.district} disabled={!formData.province}> 
                            <option value="">Chọn quận/huyện</option> 
                            {districts.map(dist => (
                                <option key={dist} value={dist}>{dist}</option> 
                            ))}
                        </select>
                    </div>

                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Địa chỉ</label> 
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

                <p style={styles.footerText}> 
                    Người dùng đã đăng ký <Link to="/login" style={styles.link}>Đăng nhập</Link> 
                </p>
            </div>
        </div>
    );
};

const styles = {
    authWrapper: { 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '40px 0',
        fontFamily: 'sans-serif'
    },
    registerCard: {
        width: '600px',
        padding: '50px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        borderRadius: '4px'
    },
    welcomeText: { fontSize: '12px', color: '#888', marginBottom: '8px' }, 
    authTitle: { fontSize: '26px', fontWeight: 'bold', marginBottom: '40px', color: '#333' },
    authForm: { display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }, 
    rowGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }, 
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' }, 
    label: { fontSize: '13px', fontWeight: 'bold', color: '#333' }, 
    required: { color: 'red', marginRight: '4px' }, 
    input: { 
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
    submitBtn: { 
        marginTop: '20px',
        padding: '12px',
        backgroundColor: '#ffffff',
        border: '1px solid #333',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '14px'
    },
    footerText: { marginTop: '25px', fontSize: '13px', color: '#333' },
    link: { color: '#ff66b2', textDecoration: 'none', fontWeight: 'bold' }  
};

export default Register;