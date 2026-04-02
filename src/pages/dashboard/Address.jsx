//Trang Thêm Địa Chỉ

import { useState, useEffect } from 'react';
import AddressModal from '../../components/common/AddressModal';
import axiosClient from '../../services/axiosClient';

const Address = () => { 
    const [addresses, setAddresses] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [editingAddress, setEditingAddress] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setIsLoading(true);
                console.log("[API Request] GET /users/me/addresses");
                const res = await axiosClient.get('/users/me/addresses');
                
               
                const data = res?.addresses || res;
                console.log("[API Response] Addresses fetched:", data);
                setAddresses(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Lỗi khi load danh sách địa chỉ:", err);
                setAddresses([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAddresses();
    }, []);

    
    const handleSave = async (addressData) => { 
        const payload = {
            name: addressData.name,
            phone: addressData.phone,
            fullAddress: addressData.fullAddress,
            isDefault: !!addressData.isDefault
        };
        try {
            setIsSubmitting(true);
            if (editingAddress) {
                const addrId = editingAddress.id || editingAddress._id;
                console.log(`[API Request] PUT /users/me/addresses/${addrId}`, payload);
                await axiosClient.put(`/users/me/addresses/${addrId}`, payload);
            } else {
                console.log("[API Request] POST /users/me/addresses", payload);
                await axiosClient.post('/users/me/addresses', payload);
            }
            
            const res = await axiosClient.get('/users/me/addresses');
            const data = res?.addresses || res;
            setAddresses(Array.isArray(data) ? data : []);
            
            setIsModalOpen(false);
            setEditingAddress(null);
            alert("Lưu địa chỉ thành công!");
        } catch (err) {
            console.error("Lỗi khi lưu địa chỉ:", err);
            alert(err?.message || 'Không thể lưu địa chỉ.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (address) => { 
        setEditingAddress(address); 
        setIsModalOpen(true); 
    };


    const handleDelete = async (address) => { 
        const addrId = address.id || address._id;
        if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) { 
            try {
                console.log(`[API Request] DELETE /users/me/addresses/${addrId}`);
                await axiosClient.delete(`/users/me/addresses/${addrId}`);
                setAddresses(prev => prev.filter(addr => (addr.id || addr._id) !== addrId));
            } catch (err) {
                console.error("Lỗi khi xóa địa chỉ:", err);
                alert(err?.message || 'Không thể xóa địa chỉ.');
            }
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

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    Đang tải danh sách địa chỉ...
                </div>
            ) : addresses.length > 0 ? (
                addresses.map(address => (
                    <div key={address.id || address._id} style={styles.addressCard}>     
                        <div style={styles.cardHeader}>        
                            <span style={styles.name}>{address.name}</span>     
                            <div>
                                <button style={styles.actionBtn} onClick={() => handleEdit(address)}>Cập nhật</button> 
                                <button style={{...styles.actionBtn, ...styles.deleteBtn}} onClick={() => handleDelete(address)}>Xóa</button>  
                            </div>
                        </div>
                        <div style={styles.row}>{address.phone}</div>   
                        <div style={styles.rowAddress}>{address.fullAddress}</div>    
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    Chưa có địa chỉ nào được lưu trong MongoDB.
                </div>
            )}

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