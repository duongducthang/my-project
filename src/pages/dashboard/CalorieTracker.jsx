import React, { useState } from 'react';

const CalorieTracker = () => {
    // 1. Dữ liệu thư viện món ăn (Tra cứu)
    const foodLibrary = [
        { id: 1, name: 'Thịt gà', unit: '100g', kcal: 239 },
        { id: 2, name: 'Thịt heo', unit: '100g', kcal: 242.1 },
        { id: 3, name: 'Trứng gà', unit: '100g (2 quả)', kcal: 155.1 },
        { id: 4, name: 'Trứng vịt', unit: '70g (1 quả)', kcal: 130 },
        { id: 5, name: 'Cá ngừ', unit: '100g', kcal: 129.8 },
        { id: 6, name: 'Tôm', unit: '100g', kcal: 99.2 },
        { id: 7, name: 'Cua', unit: '100g', kcal: 103 },
    ];

    // 2. State quản lý ứng dụng
    const [selectedFood, setSelectedFood] = useState(foodLibrary[0]);
    const [quantity, setQuantity] = useState(1);
    const [logDate, setLogDate] = useState('2024-08-22');
    const [dailyLogs, setDailyLogs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Đổi thành 10 để giống giao diện mẫu

    // 3. Hệ thống CSS (Cập nhật style phân trang nâng cao)
    const s = {
        container: { padding: '20px', maxWidth: '1200px', margin: '10px auto 0', fontFamily: '"Inter", sans-serif', backgroundColor: '#fff' },
        selectBox: { display: 'flex', flexDirection: 'column', gap: '8px', width: '350px', marginBottom: '20px' },
        label: { fontWeight: 'bold', fontSize: '18px' },
        select: { color: '#B41E8E', borderRadius: '5px', padding: '8px', border: '1px solid #d9d9d9' },
        table: { width: '100%', borderCollapse: 'collapse', marginBottom: '20px' },
        th: { backgroundColor: '#fafafa', color: '#888', fontWeight: '500', borderBottom: '1px solid #eee', padding: '12px', textAlign: 'left', fontSize: '13px' },
        td: { borderBottom: '1px solid #eee', padding: '12px', color: '#555', fontSize: '14px' },
        formRow: { display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-end', marginBottom: '25px' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
        inputDate: { height: '40px', padding: '0 15px', border: '1px solid #d9d9d9', borderRadius: '8px', minWidth: '200px' },
        qtyGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
        qtyBtn: { width: '35px', height: '40px', background: '#fff', border: '1px solid #d9d9d9', cursor: 'pointer', borderRadius: '6px' },
        qtyInput: { width: '40px', height: '36px', border: '1px solid #d9d9d9', textAlign: 'center', borderRadius: '4px' },
        inputKcal: { height: '40px', width: '100px', padding: '0 15px', border: '1px solid #d9d9d9', borderRadius: '8px', backgroundColor: '#f5f5f5', textAlign: 'center', marginRight: '50px' },
        btnAdd: { background: '#757575', color: 'white', height: '40px', padding: '0 60px', border: 'none', borderRadius: '8px', cursor: 'pointer' },
        btnEdit: { backgroundColor: '#ff4db8', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer', fontSize: '12px' },
        btnDelete: { backgroundColor: '#fff', color: '#ff4db8', border: '1px solid #ff4db8', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
        
        // Pagination Styles (Giống Group 18.png)
        paginationContainer: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '5px', padding: '20px 0' },
        pageBox: { 
            width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', 
            border: '1px solid #e0e0e0', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', color: '#666', background: '#fff' 
        },
        pageActive: { borderColor: '#ff4db8', color: '#ff4db8' },
        pageDisabled: { color: '#ccc', cursor: 'not-allowed' },
        dots: { padding: '0 5px', color: '#999' },
        pageSelect: { marginLeft: '10px', height: '32px', padding: '0 10px', border: '1px solid #e0e0e0', borderRadius: '4px', color: '#666' }
    };

    // 4. Các hàm xử lý (GIỮ NGUYÊN LOGIC CỦA BẠN)
    const handleAddLog = () => {
        if (editingId) {
            setDailyLogs(dailyLogs.map(log => 
                log.id === editingId 
                ? { ...log, date: logDate, food: selectedFood.name, unit: selectedFood.unit, kcal: (selectedFood.kcal * quantity).toFixed(1), qty: quantity }
                : log
            ));
            setEditingId(null);
        } else {
            const newEntry = {
                id: Date.now(),
                date: logDate,
                food: selectedFood.name,
                unit: selectedFood.unit,
                kcal: (selectedFood.kcal * quantity).toFixed(1),
                qty: quantity
            };
            setDailyLogs([...dailyLogs, newEntry]);
        }
        setQuantity(1);
    };

    const handleDelete = (id) => {
        setDailyLogs(dailyLogs.filter(item => item.id !== id));
    };

    const handleEdit = (log) => {
        setEditingId(log.id);
        setLogDate(log.date);
        setQuantity(log.qty);
        const food = foodLibrary.find(f => f.name === log.food);
        if (food) setSelectedFood(food);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    // --- Logic Phân trang ---
    const totalPages = Math.ceil(dailyLogs.length / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLogs = dailyLogs.slice(indexOfFirstItem, indexOfLastItem);

    // Hàm tạo danh sách số trang (1 ... 4 5 6 ...)
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <main style={s.container}>
            {/* ... (Phần bảng tra cứu và Form nhập liệu giữ nguyên không thay đổi) ... */}
            <div style={s.selectBox}>
                <label style={s.label}>Chọn bảng tính</label>
                <select style={s.select}><option>Bảng tính calo trong thịt/trứng/hải sản</option></select>
            </div>

            <table style={s.table}>
                <thead>
                    <tr><th style={s.th}>Loại thức ăn</th><th style={s.th}>Đơn vị tính</th><th style={s.th}>Kcal</th></tr>
                </thead>
                <tbody>
                    {foodLibrary.map(food => (
                        <tr key={food.id}>
                            <td style={s.td}>{food.name}</td><td style={s.td}>{food.unit}</td><td style={s.td}>{food.kcal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>{editingId ? "Đang chỉnh sửa món ăn" : "Thống kê các món ăn theo ngày"}</h3>
            <div style={s.formRow}>
                <div style={s.inputGroup}>
                    <label style={{ fontWeight: 'bold' }}>Ngày</label>
                    <input type="date" style={s.inputDate} value={logDate} onChange={(e) => setLogDate(e.target.value)} />
                </div>
                <div style={s.inputGroup}>
                    <label style={{ fontWeight: 'bold' }}>Loại thức ăn</label>
                    <select style={{ ...s.inputDate, minWidth: '200px' }} value={selectedFood.name} onChange={(e) => setSelectedFood(foodLibrary.find(f => f.name === e.target.value))}>
                        {foodLibrary.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                    </select>
                </div>
                <div style={s.qtyGroup}>
                    <button style={s.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <input style={s.qtyInput} type="text" value={quantity} readOnly />
                    <button style={s.qtyBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
                    <input style={s.inputKcal} type="text" value={(selectedFood.kcal * quantity).toFixed(1)} readOnly />
                    <button style={{...s.btnAdd, backgroundColor: editingId ? '#ff4db8' : '#757575'}} onClick={handleAddLog}>{editingId ? "Cập nhật" : "Thêm vào bảng"}</button>
                    {editingId && <button style={{...s.btnAdd, background: '#ccc', padding: '0 20px', marginLeft: '10px'}} onClick={() => {setEditingId(null); setQuantity(1);}}>Hủy</button>}
                </div>
            </div>

            {/* BẢNG KẾT QUẢ */}
            <table style={s.table}>
                <thead>
                    <tr>
                        <th style={s.th}>#</th><th style={s.th}>Ngày</th><th style={s.th}>Thực phẩm</th><th style={s.th}>Số lượng</th><th style={s.th}>Calo</th><th style={s.th}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentLogs.map((log, index) => (
                        <tr key={log.id}>
                            <td style={s.td}>{indexOfFirstItem + index + 1}</td>
                            <td style={s.td}>{log.date}</td>
                            <td style={s.td}>{log.food}</td>
                            <td style={s.td}>{log.qty} ({log.unit})</td>
                            <td style={s.td}>{log.kcal}</td>
                            <td style={s.td}>
                                <button style={s.btnEdit} onClick={() => handleEdit(log)}>Sửa</button>
                                <button style={s.btnDelete} onClick={() => handleDelete(log.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                    {/* Hàng trống giả lập để bảng luôn đủ itemsPerPage hàng */}
                    {[...Array(Math.max(0, itemsPerPage - currentLogs.length))].map((_, i) => (
                        <tr key={`empty-${i}`} style={{height: '49px'}}>
                            <td style={s.td}>{currentLogs.length + i + 1 + indexOfFirstItem}</td>
                            <td style={s.td}></td><td style={s.td}></td><td style={s.td}></td><td style={s.td}></td><td style={s.td}></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* PHÂN TRANG GIAO DIỆN MỚI */}
            <div style={s.paginationContainer}>
                {/* Nút lùi */}
                <div 
                    style={{...s.pageBox, ...(currentPage === 1 ? s.pageDisabled : {})}} 
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                >
                    &lt;
                </div>

                {/* Các số trang */}
                {getPageNumbers().map((p, i) => (
                    p === '...' ? (
                        <span key={`dots-${i}`} style={s.dots}>...</span>
                    ) : (
                        <div 
                            key={i} 
                            style={{...s.pageBox, ...(currentPage === p ? s.pageActive : {})}}
                            onClick={() => setCurrentPage(p)}
                        >
                            {p}
                        </div>
                    )
                ))}

                {/* Nút tiến */}
                <div 
                    style={{...s.pageBox, ...(currentPage === totalPages ? s.pageDisabled : {})}} 
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                >
                    &gt;
                </div>

                {/* Dropdown 10/Trang */}
                <select style={s.pageSelect}>
                    <option>10/Trang</option>
                </select>
            </div>
        </main>
    );
};

export default CalorieTracker;