//Trang Profile

import { useState, useRef, useEffect } from 'react';
import avatarImg from '../../assets/img/Avatar.svg';

const Profile = () => {
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    day: '',
    month: '',
    year: ''
  });

  useEffect(() => {
    const loadUserData = () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        
        let userGender = userData.gender || '';
        if (userGender === 'male') userGender = 'Nam';
        if (userGender === 'female') userGender = 'Nữ';

        setFormData({
          id: userData.id || '',
          fullName: userData.fullName || userData.userName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          gender: userGender,
          day: userData.birthday ? userData.birthday.split('-')[2] : '',
          month: userData.birthday ? userData.birthday.split('-')[1] : '', 
          year: userData.birthday ? userData.birthday.split('-')[0] : ''
        });

        if (userData.avatar) {
          setAvatar(userData.avatar);
        }
      }
    };

    loadUserData();

    window.addEventListener('storage', loadUserData);
    window.addEventListener('userUpdate', loadUserData);

    return () => {
      window.removeEventListener('storage', loadUserData);
      window.removeEventListener('userUpdate', loadUserData);
    };
  }, []);

  const [avatar, setAvatar] = useState(avatarImg); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleAvatarChange = (e) => {// 
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
  
      setError('');
      setSuccess('');

      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn đúng định dạng hình ảnh.');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Họ tên không được để trống.';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Email không đúng định dạng.';
    
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone)) return 'Số điện thoại không hợp lệ.';
    
    if (!formData.gender) return 'Vui lòng chọn giới tính.';
    if (!formData.day || !formData.month || !formData.year) return 'Vui lòng điền đầy đủ ngày sinh.';
    
    const birthDate = new Date(`${formData.year}-${formData.month}-${formData.day}`);
    if (birthDate > new Date()) return 'Ngày sinh không được ở tương lai.';
    
    return null;
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (error) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      const birthDate = new Date(`${formData.year}-${formData.month}-${formData.day}`);
      const today = new Date();
      let userAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        userAge--;
      }
      if (userAge < 0) userAge = 0;

      const updatedUser = {
        ...formData,
        userName: formData.fullName,
        birthday: `${formData.year}-${formData.month}-${formData.day}`,
        age: userAge,
        avatar: avatar
      };

    
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      const bodyIndex = JSON.parse(localStorage.getItem('user_body_index') || '{}');
      localStorage.setItem('user_body_index', JSON.stringify({
        ...bodyIndex,
        age: userAge,
        gender: formData.gender === 'Nam' ? 'male' : (formData.gender === 'Nữ' ? 'female' : 'other'),
        updatedAt: new Date().toISOString()
      }));

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('userUpdate', { detail: updatedUser }));

    
      const users = JSON.parse(localStorage.getItem('users_list') || '[]');
      const userIndex = users.findIndex(u => (updatedUser.id && u.id === updatedUser.id) || u.email === updatedUser.email);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        localStorage.setItem('users_list', JSON.stringify(users));
      }

      setSuccess('Cập nhật hồ sơ thành công!');
      console.log('Updated data:', updatedUser);
    }, 1000);
  };

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

  return (
    <div className="profile-wrapper">
      <style>{`
        .profile-wrapper {
          font-family: "Inter", sans-serif;
          background-color: #fff;
          padding: 0;
        }

        .profile-main {
          background: #fff;
          padding: 20px 0;
        }

        .header-title {
          font-size: 1.1rem;
          margin: 0 0 10px 0;
          color: #333;
          font-weight: bold;
        }

        .hr-divider {
          border: 0;
          border-top: 1px solid #eee;
          margin-bottom: 30px;
        }

        .alert {
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        .alert-error { background-color: #fdecea; color: #d32f2f; }
        .alert-success { background-color: #edf7ed; color: #2e7d32; }

        .form-grid {
          display: flex;
          gap: 50px;
        }

        /* Avatar Section */
        .upload-col {
          width: 200px;
          display: flex;
          flex-direction: column;
        }

        .avatar-label {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 15px;
          color: #333;
        }

        .avatar-large-preview {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 1px solid #eee;
          margin-bottom: 15px;
          overflow: hidden;
          margin-left: auto;
          margin-right: auto;
        }

        .avatar-large-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .btn-select-img {
          background: #fff;
          border: 1px solid #ff66b2;
          color: #ff66b2;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          width: fit-content;
          margin: 0 auto;
        }

        /* Info Section */
        .info-col {
          flex: 1;
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-group label {
          display: block;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 8px;
          color: #333;
        }

        .req { color: red; margin-right: 4px; }

        .input-field {
          width: 100%;
          max-width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          outline: none;
          font-size: 14px;
          box-sizing: border-box;
          background-color: #fff;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        /* Không áp dụng icon mũi tên cho input text */
        input.input-field {
          background-image: none;
        }
        
        .input-field:focus {
          border-color: #ff66b2;
        }

        .input-field::placeholder {
            color: #9ca3af;
        }

        .date-selects {
          display: flex;
          gap: 15px;
        }
        
        .date-select-wrapper {
            position: relative;
            flex: 1;
        }

        .btn-update {
          background: #fff;
          border: 1px solid #ff66b2;
          color: #ff66b2;
          padding: 8px 35px;
          font-weight: bold;
          border-radius: 4px;
          cursor: ${isLoading ? 'not-allowed' : 'pointer'};
          float: right;
          margin-top: 20px;
          transition: 0.2s;
          opacity: ${isLoading ? 0.7 : 1};
        }

        .btn-update:hover {
          background: ${isLoading ? '#fff' : '#fff5f7'};
        }

        @media (max-width: 768px) {
          .form-grid { flex-direction: column; gap: 30px; }
          .upload-col { width: 100%; margin-bottom: 0; align-items: center; }
          .avatar-label { align-self: flex-start; }
          .info-col { width: 100%; }
          .date-selects { gap: 8px; }
          .btn-update { width: 100%; float: none; margin-top: 20px; }
        }

        @media (max-width: 480px) {
          .profile-main { padding: 15px 0; }
          .header-title { font-size: 1rem; }
          .avatar-large-preview { width: 120px; height: 120px; }
          .input-field { padding: 10px; font-size: 13px; }
          .date-selects { flex-direction: column; gap: 10px; }
          .btn-update { padding: 10px 0; font-size: 14px; }
        }
      `}</style>

      <div className="profile-main">
        <h2 className="header-title">Hồ sơ</h2>
        <hr className="hr-divider" />

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleUpdate} className="form-grid">
          {/* Cột Upload ảnh */}
          <div className="upload-col">
            <label className="avatar-label"><span className="req">*</span> Ảnh hồ sơ</label>
            <div className="avatar-large-preview">
              <img src={avatar} alt="Avatar Preview" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              style={{ display: 'none' }} 
              accept="image/*"
            />
            <button type="button" className="btn-select-img" onClick={handleSelectFile}>Chọn ảnh</button>
          </div>

          {/* Cột thông tin */}
          <div className="info-col">
            <div className="input-group">
              <label><span className="req">*</span> Họ và tên</label>
              <input 
                className="input-field" 
                name="fullName"
                type="text" 
                placeholder="Họ và tên" 
                value={formData.fullName} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label><span className="req">*</span> Email</label>
              <input 
                className="input-field" 
                name="email"
                type="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label><span className="req">*</span> Số điện thoại</label>
              <input 
                className="input-field" 
                name="phone"
                type="text" 
                placeholder="Số điện thoại" 
                value={formData.phone} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label><span className="req">*</span> Giới tính</label>
              
              <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{
                    color: formData.gender ? "#000" : "#9ca3af"
                  }}
                  className="input-field"
                >
                  <option value="">
                    Giới tính
                  </option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
              </select>

            </div>

            <div className="input-group">
              <label><span className="req">*</span> Ngày sinh</label>
              <div className="date-selects">
                <select 
                  className="input-field" 
                  name="day" 
                  value={formData.day} 
                  onChange={handleChange}
                  style={{ color: formData.day ? "#000" : "#9ca3af" }}
                >
                  <option value="">Ngày </option>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select 
                  className="input-field" 
                  name="month" 
                  value={formData.month} 
                  onChange={handleChange}
                  style={{ color: formData.month ? "#000" : "#9ca3af" }}
                >
                  <option value="">Tháng</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select 
                  className="input-field" 
                  name="year" 
                  value={formData.year} 
                  onChange={handleChange}
                  style={{ color: formData.year ? "#000" : "#9ca3af" }}
                >
                  <option value="">Năm</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="btn-update" disabled={isLoading}>
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;