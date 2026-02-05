//Trang đổi mật khẩu-Profile

import { useState, useEffect } from 'react';

const ChangePassword = () => {
    //  STATE QUẢN LÝ DỮ LIỆU VÀ GIAO DIỆN
    const [formData, setFormData] = useState({
        currentPassword: '', // Mật khẩu hiện tại người dùng nhập
        newPassword: '',     // Mật khẩu mới muốn thay đổi
        confirmPassword: ''  // Nhập lại mật khẩu mới để xác nhận
    });

    // Trạng thái hiển thị mật khẩu (ẩn/hiện) cho từng ô nhập liệu
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [error, setError] = useState('');      // Thông báo lỗi nếu có
    const [success, setSuccess] = useState('');  // Thông báo thành công
    const [isLoading, setIsLoading] = useState(false); // Trạng thái đang xử lý (loading)
    const [currentUser, setCurrentUser] = useState(null); // Thông tin người dùng hiện tại

    // SIDE EFFECTS - Tải dữ liệu từ localStorage khi trang được nạp
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    //  XỬ LÝ SỰ KIỆN
    // Cập nhật giá trị khi người dùng nhập vào các ô input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');   // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
        setSuccess(''); // Xóa thông báo thành công
    };

    // Hàm xử lý khi nhấn nút Lưu (Đổi mật khẩu)
    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn trang web load lại
        
        // KIỂM TRA DỮ LIỆU ĐẦU VÀO (Validation)
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('Vui lòng điền đầy đủ tất cả các trường.');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không trùng khớp.');
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
            return;
        }

        // KIỂM TRA MẬT KHẨU HIỆN TẠI CÓ ĐÚNG KHÔNG
        if (!currentUser || formData.currentPassword !== currentUser.password) {
            setError('Mật khẩu hiện tại không chính xác.');
            return;
        }

        // THỰC HIỆN CẬP NHẬT (Giả lập gửi lên server với setTimeout)
        setIsLoading(true);
        setTimeout(() => {
            // Cập nhật thông tin người dùng đang đăng nhập
            const updatedUser = { ...currentUser, password: formData.newPassword };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);

            // Cập nhật lại danh sách tất cả người dùng trong hệ thống
            const users = JSON.parse(localStorage.getItem('users_list') || '[]');
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], password: formData.newPassword };
                localStorage.setItem('users_list', JSON.stringify(users));
            }

            setIsLoading(false);
            setSuccess('Đổi mật khẩu thành công!');
            // Xóa trắng các ô nhập liệu sau khi thành công
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }, 1000);
    };

    // Hàm chuyển đổi trạng thái ẩn/hiện mật khẩu
    const toggleVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // --- PHẦN ICON SVG (Được đơn giản hóa bằng cách gộp chung thành một component) ---
    const IconMat = ({ hienThi }) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {hienThi ? (
                // Icon Mắt Mở - Hiển thị mật khẩu
                <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </>
            ) : (
                // Icon Mắt Đóng - Ẩn mật khẩu
                <>
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                </>
            )}
        </svg>
    );

    return (
        <div style={{ maxWidth: '600px' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
                Đổi mật khẩu
            </h3>
            
            <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Hiển thị thông báo lỗi hoặc thành công */}
                {error && <div style={{ color: '#d32f2f', backgroundColor: '#fdecea', padding: '10px', borderRadius: '4px', fontSize: '13px' }}>{error}</div>}
                {success && <div style={{ color: '#2e7d32', backgroundColor: '#edf7ed', padding: '10px', borderRadius: '4px', fontSize: '13px' }}>{success}</div>}

                {/* Ô nhập Mật khẩu hiện tại */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '14px' }}><span style={{ color: 'red' }}>*</span> Mật khẩu hiện tại</label>
                    <div style={{ position: 'relative' }}>
                        <input 
                            name="currentPassword"
                            type={showPassword.current ? "text" : "password"} 
                            placeholder="Mật khẩu hiện tại" 
                            value={formData.currentPassword}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', paddingRight: '40px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} 
                        />
                        <span 
                            onClick={() => toggleVisibility('current')}
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#888' }}
                        >
                            <IconMat hienThi={showPassword.current} />
                        </span>
                    </div>
                </div>

                {/* Ô nhập Mật khẩu mới */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '14px' }}><span style={{ color: 'red' }}>*</span> Mật khẩu mới</label>
                    <div style={{ position: 'relative' }}>
                        <input 
                            name="newPassword"
                            type={showPassword.new ? "text" : "password"} 
                            placeholder="Mật khẩu mới" 
                            value={formData.newPassword}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', paddingRight: '40px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} 
                        />
                        <span 
                            onClick={() => toggleVisibility('new')}
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#888' }}
                        >
                            <IconMat hienThi={showPassword.new} />
                        </span>
                    </div>
                </div>

                {/* Ô xác nhận mật khẩu mới */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '14px' }}><span style={{ color: 'red' }}>*</span> Xác nhận mật khẩu mới</label>
                    <div style={{ position: 'relative' }}>
                        <input 
                            name="confirmPassword"
                            type={showPassword.confirm ? "text" : "password"} 
                            placeholder="Xác nhận mật khẩu mới" 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', paddingRight: '40px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} 
                        />
                        <span 
                            onClick={() => toggleVisibility('confirm')}
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#888' }}
                        >
                            <IconMat hienThi={showPassword.confirm} />
                        </span>
                    </div>
                </div>

                {/* Nút submit */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        style={{ 
                            padding: '8px 25px', 
                            background: isLoading ? '#f5f5f5' : '#fff', 
                            color: isLoading ? '#999' : '#ff66b2', 
                            border: `1px solid ${isLoading ? '#ddd' : '#ff66b2'}`, 
                            borderRadius: '4px', 
                            fontWeight: 'bold', 
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isLoading ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;