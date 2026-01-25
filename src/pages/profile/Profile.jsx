import { useState, useRef } from 'react';
import avatarImg from '../../assets/img/Avatar.svg';

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    day: '',
    month: '',
    year: ''
  });
  const [avatar, setAvatar] = useState(avatarImg);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current.click();
  };

  const handleUpdate = () => {
    // Logic to update profile
    console.log('Updated data:', { ...formData, avatar });
    alert('Cập nhật hồ sơ thành công!');
  };

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
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          outline: none;
          font-size: 14px;
        }
        
        .input-field::placeholder {
            color: #ccc;
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
          padding: 8px 25px;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
          float: right;
          margin-top: 20px;
          transition: 0.2s;
        }

        .btn-update:hover {
          background: #fff5f7;
        }
      `}</style>

      <div className="profile-main">
        <h2 className="header-title">Hồ sơ</h2>
        <hr className="hr-divider" />

        <div className="form-grid">
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
            <button className="btn-select-img" onClick={handleSelectFile}>Chọn ảnh</button>
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
              <select className="input-field" name="gender" value={formData.gender} onChange={handleChange}>
                <option>Chọn</option>
                <option>Nam</option>
                <option>Nữ</option>
                <option>Khác</option>
              </select>
            </div>

            <div className="input-group">
              <label><span className="req">*</span> Ngày sinh</label>
              <div className="date-selects">
                <select className="input-field" name="day" value={formData.day} onChange={handleChange}>
                  {Array.from({ length: 31 }, (_, i) => <option key={i+1} value={String(i + 1).padStart(2, '0')}>{i + 1}</option>)}
                </select>
                <select className="input-field" name="month" value={formData.month} onChange={handleChange}>
                  {Array.from({ length: 12 }, (_, i) => <option key={i+1} value={String(i + 1).padStart(2, '0')}>{i + 1}</option>)}
                </select>
                <select className="input-field" name="year" value={formData.year} onChange={handleChange}>
                  {Array.from({ length: 100 }, (_, i) => <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>)}
                </select>
              </div>
            </div>

            <button className="btn-update" onClick={handleUpdate}>Cập nhật</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;