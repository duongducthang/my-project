//Bên trong của trang Thêm địa chỉ

import { useState, useEffect } from 'react'; //sử dụng state và effect trong React

const AddressModal = ({ isOpen, onClose, onSave, address }) => {  
  //lưu thông tin người dùng nhập vào
  const [formData, setFormData] = useState({ 
    name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    street: ''
  });

  useEffect(() => { //khi modal mở hoặc address thay đổi, cập nhật formData
    if (address) {
      // Giả sử address.fullAddress có dạng "Đường, Phường, Quận, Tỉnh"
      const parts = address.fullAddress.split(', '); //tách chuỗi thành mảng các phần
      setFormData({ //cập nhật formData với dữ liệu từ address
        name: address.name,
        phone: address.phone,
        street: parts[0] || '',//thành phố
        ward: parts[1] || '',//phườngn
        district: parts[2] || '',//huyện
        province: parts[3] || '',//tỉnh
      });
    } else { 
      //nếu ko có địa chỉ (thêm mới), đặt lại formData về rỗng
      setFormData({ name: '', phone: '', province: '', district: '', ward: '', street: '' });
    }
  }, [address, isOpen]); //chạy khi address hoặc isOpen thay đổi

  const handleChange = (e) => { 
    //cập nhật formData khi người dùng nhập liệu
    const { name, value } = e.target; //lấy tên và giá trị của trường nhập liệu
    setFormData(prev => ({ ...prev, [name]: value })); //cập nhật trường tương ứng trong formData
  };

  const handleSubmit = (e) => { 
 //ngăn chặn hành vi mặc định của form (tải lại trang)
    e.preventDefault();
    const fullAddress = `${formData.street}, ${formData.ward}, ${formData.district}, ${formData.province}`; //tạo chuỗi địa chỉ đầy đủ
    //gọi hàm onSave truyền dữ liệu đã nhập và địa chỉ đầy đủ
    onSave({ ...formData, fullAddress }); 
  };

  if (!isOpen) return null; //nếu modal ko mở, ko render gì cả

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"> {/* nền mờ phía sau modal */}
      <div className="bg-white w-full max-w-lg rounded-lg  duration-200"> {/*khung modal chính */}
        <div className="flex justify-between items-center p-4 border-b"> {/* Header của Modal */}
          <h3 className="font-bold">{address ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}</h3> {/* Tiêu đề thay đổi dựa trên việc thêm hay chỉnh sửa */}
          <button onClick={onClose} className="text-2xl">&times;</button> {/* Nút đóng modal */}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4"> {/* Form nhập liệu */}
          <div className="grid grid-cols-2 gap-4"> {/*họ tên và sđt ngang nhau*/}
            <div>
              <label className="block text-xs font-bold mb-1">
              <span className="text-red-500">*</span> Họ và tên </label>
              <input 
                  type="text" 
                  name="name"  
                  value={formData.name} //giá trị từ formData
                  onChange={handleChange} //cập nhật khi người dùng nhập và thay đổi
                  placeholder="Họ và tên" 
                  className="w-full border p-2 text-sm rounded outline-none" //định dạng ô nhập  
              required />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">
              <span className="text-red-500">*</span>Số điện thoại </label> 
              <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone}  
                  onChange={handleChange} 
                  placeholder="Số điện thoại"
                  className="w-full border p-2 text-sm rounded outline-none"  //định dạng ô nhập
              required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1"> 
            <span className="text-red-500">*</span>Tỉnh/Thành phố</label>
            <input 
                  type="text" 
                  name="province" 
                  value={formData.province} 
                  onChange={handleChange} 
                  placeholder="Tỉnh/Thành phố" 
                  className="w-full border p-2 text-sm rounded outline-none" 
            required />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
            <span className="text-red-500">*</span>Quận/Huyện </label>
            <input 
                  type="text" 
                  name="district" 
                  value={formData.district} 
                  onChange={handleChange} 
                  placeholder="Quận/Huyện" 
                  className="w-full border p-2 text-sm rounded outline-none" 
            required />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1"> 
            <span className="text-red-500">*</span>Phường/Xã</label>
            <input 
                  type="text" 
                  name="ward" 
                  value={formData.ward} 
                  onChange={handleChange} 
                  placeholder="Phường/Xã" 
                  className="w-full border p-2 text-sm rounded outline-none" 
            required />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
            <span className="text-red-500">*</span>Địa chỉ cụ thể </label>
            <textarea 
                  name="street" 
                  value={formData.street} 
                  onChange={handleChange} 
                  placeholder="Địa chỉ cụ thể" 
                  className="w-full border p-2 text-sm rounded outline-none h-20"  //ô nhập lớn hơn
            required />
          </div>

          <div className="flex justify-end gap-3 mt-6"> {/* Nút hành động ở cuối form */}
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded text-sm">Quay lại</button>
            <button type="submit" className="px-6 py-2 bg-pink-100 text-pink-600 border border-pink-200 rounded text-sm font-bold">
              {address ? 'Cập nhật' : 'Thêm mới'} {/*dùng toán tử 3 ngôi */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;