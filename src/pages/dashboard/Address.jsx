//Trang Thêm Địa Chỉ

import { useState, useEffect } from 'react';
import AddressModal from '../../components/common/AddressModal';

const Address = () => { 
    //STATE QUẢN LÝ DỮ LIỆU ĐỊA CHỈ
    const [addresses, setAddresses] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [editingAddress, setEditingAddress] = useState(null); 
    const [currentUser, setCurrentUser] = useState(null); 

    //SIDE EFFECTS (Tự động chạy khi trang web tải xong)
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            
            if (!user.addresses || user.addresses.length === 0) {
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
                setAddresses(user.addresses); 
            }
        }
    }, []);

    //HÀM CẬP NHẬT DỮ LIỆU VÀO BỘ NHỚ (LOCAL STORAGE)
    const updateLocalStorage = (newAddresses) => {
        if (!currentUser) return;

        const updatedUser = { ...currentUser, addresses: newAddresses };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);

        const users = JSON.parse(localStorage.getItem('users_list') || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], addresses: newAddresses };
            localStorage.setItem('users_list', JSON.stringify(users));
        }
    };

   
    
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
        setIsModalOpen(false);
        setEditingAddress(null); 
    };

    const handleEdit = (address) => { 
        setEditingAddress(address); 
        setIsModalOpen(true); 
    };

    const handleDelete = (addressId) => { 
        if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) { 
            const newAddresses = addresses.filter(addr => addr.id !== addressId);
            setAddresses(newAddresses); 
            updateLocalStorage(newAddresses);
        }
    };

    const openModal = () => { 
        setEditingAddress(null); 
        setIsModalOpen(true); 
    };

    return (
        <div style={{ maxWidth: '800px' }}> 
            <div style={styles.headerRow}> 
                <h3 style={styles.title}>Địa chỉ</h3>
                <button style={styles.addBtn} onClick={openModal}>+ Thêm địa chỉ mới</button>
            </div>

            {/* Danh sách địa chỉ */}
            {addresses.map(address => (  
                <div key={address.id} style={styles.addressCard}>    
                    <div style={styles.cardHeader}>       
                        <span style={styles.name}>{address.name}</span>    
                        <div>
                            <button style={styles.actionBtn} onClick={() => handleEdit(address)}>Cập nhật</button> 
                            <button style={{...styles.actionBtn, ...styles.deleteBtn}} onClick={() => handleDelete(address.id)}>Xóa</button>  
                        </div>
                    </div>
                    <div style={styles.row}>{address.phone}</div>  
                    <div style={styles.rowAddress}>{address.fullAddress}</div>    
                </div>
            ))}

            <AddressModal  
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}  
                onSave={handleSave} 
                address={editingAddress} 
            />
        </div>
    );
};

const styles = {
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' },
    title: { margin: 0, fontSize: '16px', fontWeight: 'bold' },
    addBtn: { backgroundColor: '#ffeef5', border: '1px solid #ffc1e3', color: '#333', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
    addressCard: { padding: '20px 0', borderBottom: '1px solid #eee' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
    name: { fontWeight: 'bold', fontSize: '14px' },
    actionBtn: { background: 'none', border: 'none', color: '#000', cursor: 'pointer', fontSize: '13px', marginRight: '15px' },
    deleteBtn: { color: 'red' },
    row: { fontSize: '14px', color: '#555', marginBottom: '4px' },
    rowAddress: { fontSize: '14px', color: '#666' }
};

export default Address;