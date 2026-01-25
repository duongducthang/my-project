import { useState, useEffect } from 'react';

const AddressModal = ({ isOpen, onClose, onSave, address }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    street: ''
  });

  useEffect(() => {
    if (address) {
      // Giả sử address.fullAddress có dạng "Đường, Phường, Quận, Tỉnh"
      const parts = address.fullAddress.split(', ');
      setFormData({
        name: address.name,
        phone: address.phone,
        street: parts[0] || '',
        ward: parts[1] || '',
        district: parts[2] || '',
        province: parts[3] || '',
      });
    } else {
      // Reset form for new address
      setFormData({ name: '', phone: '', province: '', district: '', ward: '', street: '' });
    }
  }, [address, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullAddress = `${formData.street}, ${formData.ward}, ${formData.district}, ${formData.province}`;
    onSave({ ...formData, fullAddress });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-lg rounded-lg overflow-hidden animate-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold">{address ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}</h3>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Họ và tên <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Họ và tên" className="w-full border p-2 text-sm rounded outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Số điện thoại <span className="text-red-500">*</span></label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" className="w-full border p-2 text-sm rounded outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
            <input type="text" name="province" value={formData.province} onChange={handleChange} placeholder="Tỉnh/Thành phố" className="w-full border p-2 text-sm rounded outline-none" required />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Quận/Huyện <span className="text-red-500">*</span></label>
            <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="Quận/Huyện" className="w-full border p-2 text-sm rounded outline-none" required />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Phường/Xã <span className="text-red-500">*</span></label>
            <input type="text" name="ward" value={formData.ward} onChange={handleChange} placeholder="Phường/Xã" className="w-full border p-2 text-sm rounded outline-none" required />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Địa chỉ cụ thể <span className="text-red-500">*</span></label>
            <textarea name="street" value={formData.street} onChange={handleChange} placeholder="Địa chỉ cụ thể" className="w-full border p-2 text-sm rounded outline-none h-20" required />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded text-sm">Quay lại</button>
            <button type="submit" className="px-6 py-2 bg-pink-100 text-pink-600 border border-pink-200 rounded text-sm font-bold">
              {address ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;