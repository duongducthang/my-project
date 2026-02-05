//Trang Thêm Địa Chỉ

import { useState, useEffect } from 'react';
import AddressModal from '../../components/common/AddressModal';

const Address = () => { 
    //STATE QUẢN LÝ DỮ LIỆU ĐỊA CHỈ
    const [addresses, setAddresses] = useState([]); // Danh sách các địa chỉ đã lưu
    const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái đóng/mở cửa sổ nhập địa chỉ (Modal)
    const [editingAddress, setEditingAddress] = useState(null); // Lưu thông tin địa chỉ đang được chọn để sửa
    const [currentUser, setCurrentUser] = useState(null); // Thông tin người dùng hiện tại đang đăng nhập

    //SIDE EFFECTS (Tự động chạy khi trang web tải xong)
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser'); // Lấy dữ liệu người dùng từ bộ nhớ trình duyệt
        if (savedUser) {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            
            // KIỂM TRA: Nếu người dùng chưa có địa chỉ nào trong danh sách
            if (!user.addresses || user.addresses.length === 0) {
                // Tạo địa chỉ mặc định từ thông tin đăng ký ban đầu
                const parts = [user.address, user.district, user.province].filter(Boolean); 
                const fullAddress = parts.join(', ');
                
                if (fullAddress || user.phone || user.userName) { 
                    const defaultAddress = {
                        id: Date.now(),
                        name: user.userName || user.fullName || 'Người dùng',
                        phone: user.phone || '',
                        fullAddress: fullAddress || 'Chưa cập nhật địa chỉ',
                        isDefault: true
                    };
                    const initialAddresses = [defaultAddress];
                    setAddresses(initialAddresses);
                    
                    // Cập nhật lại bộ nhớ trình duyệt (LocalStorage)
                    const updatedUser = { ...user, addresses: initialAddresses };
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                    
                    // Cập nhật đồng bộ vào danh sách tất cả người dùng
                    const users = JSON.parse(localStorage.getItem('users_list') || '[]');
                    const userIndex = users.findIndex(u => u.email === user.email);
                    if (userIndex !== -1) {
                        users[userIndex] = updatedUser;
                        localStorage.setItem('users_list', JSON.stringify(users));
                    }
                } else {
                    setAddresses([]);
                }
            } else {
                setAddresses(user.addresses); // Nếu đã có danh sách địa chỉ thì chỉ cần hiển thị ra
            }
        }
    }, []);

    //HÀM CẬP NHẬT DỮ LIỆU VÀO BỘ NHỚ (LOCAL STORAGE)
    const updateLocalStorage = (newAddresses) => {
        if (!currentUser) return;

        // Cập nhật cho người dùng hiện tại
        const updatedUser = { ...currentUser, addresses: newAddresses };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);

        // Cập nhật đồng bộ vào danh sách tổng (users_list)
        const users = JSON.parse(localStorage.getItem('users_list') || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], addresses: newAddresses };
            localStorage.setItem('users_list', JSON.stringify(users));
        }
    };

    //CÁC HÀM XỬ LÝ SỰ KIỆN
    
    // Lưu địa chỉ (Thêm mới hoặc Cập nhật)
    const handleSave = (addressData) => { 
        let newAddresses;
        if (editingAddress) { 
            // TRƯỜNG HỢP: Đang chỉnh sửa địa chỉ cũ
            newAddresses = addresses.map(addr => addr.id === editingAddress.id ? { ...addr, ...addressData } : addr);
        } else {
            // TRƯỜNG HỢP: Thêm địa chỉ mới hoàn toàn
            const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1; 
            newAddresses = [...addresses, { id: newId, ...addressData }];
        }
        
        setAddresses(newAddresses);
        updateLocalStorage(newAddresses);
        setIsModalOpen(false); // Đóng Modal
        setEditingAddress(null); // Reset trạng thái sửa
    };

    // Chuẩn bị thông tin để sửa địa chỉ
    const handleEdit = (address) => { 
        setEditingAddress(address); 
        setIsModalOpen(true); 
    };

    // Xóa địa chỉ khỏi danh sách
    const handleDelete = (addressId) => { 
        if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) { 
            const newAddresses = addresses.filter(addr => addr.id !== addressId);
            setAddresses(newAddresses); 
            updateLocalStorage(newAddresses);
        }
    };

    // Mở Modal để thêm mới
    const openModal = () => { 
        setEditingAddress(null); 
        setIsModalOpen(true); 
    };

    return (
        <div style={{ maxWidth: '800px' }}> {/* Khung chứa chính của trang địa chỉ */}
            {/* Tiêu đề + Nút Thêm mới */}
            <div style={styles.headerRow}> 
                <h3 style={styles.title}>Địa chỉ</h3>
                <button style={styles.addBtn} onClick={openModal}>+ Thêm địa chỉ mới</button>
            </div>

            {/* Danh sách địa chỉ */}
            {addresses.map(address => ( // Lặp qua từng địa chỉ để hiển thị 
                <div key={address.id} style={styles.addressCard}>      {/* Thẻ chứa thông tin địa chỉ */}
                    <div style={styles.cardHeader}>        {/* Header của thẻ địa chỉ */}
                        <span style={styles.name}>{address.name}</span>     {/* Tên người nhận */}
                        <div>
                            <button style={styles.actionBtn} onClick={() => handleEdit(address)}>Cập nhật</button> 
                            <button style={{...styles.actionBtn, ...styles.deleteBtn}} onClick={() => handleDelete(address.id)}>Xóa</button>  
                        </div>
                    </div>
                    <div style={styles.row}>{address.phone}</div>   {/* Số điện thoại */}
                    <div style={styles.rowAddress}>{address.fullAddress}</div>    { /* Địa chỉ đầy đủ */ }
                </div>
            ))}

            <AddressModal  // Modal Thêm/Cập nhật địa chỉ
                isOpen={isModalOpen}  // Trạng thái mở/đóng modal
                onClose={() => setIsModalOpen(false)} // Hàm đóng modal 
                onSave={handleSave} // Hàm lưu địa chỉ
                address={editingAddress} // Địa chỉ đang chỉnh sửa (nếu có)
            />
        </div>
    );
};

const styles = {
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' },// Khung chứa tiêu đề và nút thêm mới
    title: { margin: 0, fontSize: '16px', fontWeight: 'bold' }, // Tiêu đề trang
    addBtn: { backgroundColor: '#ffeef5', border: '1px solid #ffc1e3', color: '#333', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }, // Nút Thêm địa chỉ mới
    addressCard: { padding: '20px 0', borderBottom: '1px solid #eee' },// Thẻ chứa thông tin địa chỉ
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },// Header của thẻ địa chỉ
    name: { fontWeight: 'bold', fontSize: '14px' },// Tên người nhận
    actionBtn: { background: 'none', border: 'none', color: '#000', cursor: 'pointer', fontSize: '13px', marginRight: '15px' },// Nút hành động (Cập nhật, Xóa)
    deleteBtn: { color: 'red' },// Nút Xóa với màu đỏ
    row: { fontSize: '14px', color: '#555', marginBottom: '4px' },// Hàng thông tin (sđt, địa chỉ)
    rowAddress: { fontSize: '14px', color: '#666' }// Hàng địa chỉ với màu khác biệt
};

export default Address;