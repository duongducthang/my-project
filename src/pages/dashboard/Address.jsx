import { useState } from 'react';
import AddressModal from '../../components/common/AddressModal';

const initialAddresses = [
  {
    id: 1,
    name: 'aaaaa',
    phone: '096xxxx100',
    fullAddress: 'Toà Handico, Đường Mễ Trì, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội',
  }
];

const Address = () => {
    const [addresses, setAddresses] = useState(initialAddresses);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const handleSave = (addressData) => {
        if (editingAddress) {
            // Update
            setAddresses(addresses.map(addr => addr.id === editingAddress.id ? { ...addr, ...addressData } : addr));
        } else {
            // Add new
            const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
            setAddresses([...addresses, { id: newId, ...addressData }]);
        }
        setIsModalOpen(false);
        setEditingAddress(null);
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleDelete = (addressId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
            setAddresses(addresses.filter(addr => addr.id !== addressId));
        }
    };

    const openModal = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            {/* Tiêu đề + Nút Thêm mới */}
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