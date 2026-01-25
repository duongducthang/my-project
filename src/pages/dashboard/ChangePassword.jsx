const ChangePassword = () => {
    return (
        <div style={{ maxWidth: '600px' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>Đổi mật khẩu</h3>
            <form style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '14px' }}><span style={{ color: 'red' }}>*</span> Mật khẩu hiện tại</label>
                    <input type="password" placeholder="Mật khẩu hiện tại" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '14px' }}><span style={{ color: 'red' }}>*</span> Mật khẩu mới</label>
                    <input type="password" placeholder="Mật khẩu mới" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '14px' }}><span style={{ color: 'red' }}>*</span> Xác nhận mật khẩu mới</label>
                    <input type="password" placeholder="Xác nhận mật khẩu mới" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button style={{ padding: '8px 25px', background: '#fff', color: '#ff66b2', border: '1px solid #ff66b2', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Lưu</button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;