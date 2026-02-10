//Trang tính toán calo

import React, { useState } from 'react';

const foodLibrary = [
    {id: 1, name: 'Thịt gà', unit: '100g',kcal: 239, baseWeight: 100, category: 'Bảng tính calo trong thịt/trứng/hải sản'},
    {id: 2, name: 'Thịt heo', unit: '100g',kcal: 242.1, baseWeight: 100, category: 'Bảng tính calo trong thịt/trứng/hải sản'},
    {id: 3, name: 'Trứng gà', unit: '100g (2 quả)', kcal: 155.1, baseWeight: 100, category: 'Bảng tính calo trong thịt/trứng/hải sản'},
    {id: 4, name: 'Trứng vịt', unit: '70g (1 quả)', kcal: 130, baseWeight: 70, category: 'Bảng tính calo trong thịt/trứng/hải sản'},
    {id: 5,name: 'Cá ngừ', unit: '100g', kcal: 129.8, baseWeight: 100, 
        category: 'Bảng tính calo trong thịt/trứng/hải sản' 
    },
    {   id: 6, 
        name: 'Tôm',
        unit: '100g', 
        kcal: 99.2,
        baseWeight: 100, 
        category: 'Bảng tính calo trong thịt/trứng/hải sản' 
    },
    {   id: 7, 
        name: 'Cua',
        unit: '100g', 
        kcal: 103, 
        baseWeight: 100, 
        category: 'Bảng tính calo trong thịt/trứng/hải sản' 
    },
    
    // Các món rau củ

    { id: 8, name: 'Súp lơ', unit: '100g', kcal: 25, baseWeight: 100, category: 'Bảng tính calo trong rau củ' },
    { id: 9, name: 'Dưa hấu', unit: '100g', kcal: 30, baseWeight: 100, category: 'Bảng tính calo trong rau củ' },
    { id: 10, name: 'Chuối', unit: '100g', kcal: 88, baseWeight: 100, category: 'Bảng tính calo trong rau củ' },
    { id: 11, name: 'Khoai tây', unit: '100g', kcal: 77, baseWeight: 100, category: 'Bảng tính calo trong rau củ' },
];

const CalorieTracker = () => {
    // STATE QUẢN LÝ ỨNG DỤNG
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [selectedCategory, setSelectedCategory] = useState('Bảng tính calo trong thịt/trứng/hải sản'); 
    const [selectedFood, setSelectedFood] = useState(foodLibrary[0]); 
    const [quantity, setQuantity] = useState(1);                      
    const [logDate, setLogDate] = useState(formatDate(new Date())); 
    const [dailyLogs, setDailyLogs] = useState(() => {
        const saved = localStorage.getItem('calorie_logs');
        if (saved) return JSON.parse(saved);
        const today = formatDate(new Date());
        return [
            { id: 1, date: today, food: 'Thịt gà', qty: 100, kcal: '239', unit: '100g' },
            { id: 2, date: today, food: 'Trứng gà', qty: 100, kcal: '155.1', unit: '100g (2 quả)' },
            { id: 3, date: today, food: 'Súp lơ', qty: 400, kcal: '100', unit: '100g' },
            { id: 4, date: today, food: 'Dưa hấu', qty: 400, kcal: '120', unit: '100g' },
            { id: 5, date: today, food: 'Khoai tây', qty: 100, kcal: '77', unit: '100g' },
            { id: 6, date: today, food: 'Chuối', qty: 200, kcal: '176', unit: '100g' },
        ];
    });

    React.useEffect(() => {
        localStorage.setItem('calorie_logs', JSON.stringify(dailyLogs));
    }, [dailyLogs]);

    const [editingId, setEditingId] = useState(null); 
    const [currentPage, setCurrentPage] = useState(1); 
    const [itemsPerPage, setItemsPerPage] = useState(5); 

    // 3. Hệ thống CSS
    const s = {
        container: { padding: '20px', maxWidth: '1200px', margin: '10px auto 0', fontFamily: '"Inter", sans-serif', backgroundColor: '#fff' },
        selectBox: { display: 'flex', flexDirection: 'column', gap: '8px', width: '350px', maxWidth: '100%', marginBottom: '20px' },
        label: { fontWeight: 'bold', fontSize: '18px' },
        select: { 
            color: '#B41E8E', 
            borderRadius: '5px', 
            padding: '8px 12px', 
            border: '1px solid #d9d9d9',
            width: '100%',
            maxWidth: '100%',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            appearance: 'auto'
        },
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

    const handleAddLog = () => { 
        const actualQty = quantity * selectedFood.baseWeight; 
        const calculatedKcal = ((selectedFood.kcal / selectedFood.baseWeight) * actualQty).toFixed(1); 
        
        if (editingId) {
            setDailyLogs(dailyLogs.map(log => 
                log.id === editingId 
                ? { ...log, date: logDate, food: selectedFood.name, unit: selectedFood.unit, kcal: calculatedKcal, qty: actualQty } 
                : log
            ));
            setEditingId(null);
        } else {
            const newEntry = { 
                id: Date.now(),
                date: logDate,
                food: selectedFood.name,
                unit: selectedFood.unit,
                kcal: calculatedKcal,
                qty: actualQty
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
        const food = foodLibrary.find(f => f.name === (log.food === 'Dưa hấu..' ? 'Dưa hấu' : log.food));
        if (food) {
            setSelectedFood(food);
            setQuantity(log.qty / food.baseWeight); 
        }
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    const totalPages = Math.ceil(dailyLogs.length / itemsPerPage) || 1;
    const currentLogs = dailyLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

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
        <main style={s.container} className="calorie-tracker-container">
            <style>{`
                @media (max-width: 768px) {
                    .calorie-tracker-container { padding: 10px !important; }
                    .select-box { width: 100% !important; }
                    .form-row { flex-direction: column !important; align-items: stretch !important; gap: 15px !important; }
                    .input-group { width: 100% !important; }
                    .input-date { width: 100% !important; min-width: 0 !important; }
                    .qty-group { flex-wrap: wrap !important; justify-content: space-between !important; gap: 10px !important; }
                    .input-kcal { margin-right: 0 !important; width: 80px !important; }
                    .btn-add { width: 100% !important; padding: 0 !important; }
                    .table-wrapper { overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; margin-bottom: 20px !important; }
                    .pagination-container { flex-wrap: wrap !important; justify-content: center !important; gap: 10px !important; }
                }
            `}</style>
            <div style={s.selectBox} className="select-box">
                <label style={s.label}>Chọn bảng tính</label>
                <select 
                        style={s.select} 
                        value={selectedCategory} 
                        className="responsive-select"
                        onChange={(e) => {
                            const newCategory = e.target.value;
                            setSelectedCategory(newCategory);
                            const firstFoodInCategory = foodLibrary.find(f => f.category === newCategory);
                            if (firstFoodInCategory) {
                                setSelectedFood(firstFoodInCategory);
                            }
                        }}
                    >
                    <option value="Bảng tính calo trong thịt/trứng/hải sản">Bảng tính calo trong thịt/trứng/hải sản</option>
                    <option value="Bảng tính calo trong rau củ">Bảng tính calo trong rau củ</option>
                    <option value="Bảng tính calo cho các món ăn sáng (không cần thiết)">Bảng tính calo cho các món ăn sáng (không cần thiết)</option>
                    <option value="Bảng tính calo cho các món ăn trưa (không cần thiết)">Bảng tính calo cho các món ăn trưa (không cần thiết)</option>
                    <option value="Bảng tính calo cho các món ăn tối (không cần thiết)">Bảng tính calo cho các món ăn tối (không cần thiết)</option>
                </select>
            </div>

            <div className="table-wrapper">
                <table style={s.table}>
                    <thead>
                        <tr><th style={s.th}>Loại thức ăn</th><th style={s.th}>Đơn vị tính</th><th style={s.th}>Kcal</th></tr>
                    </thead>
                    <tbody>
                        {foodLibrary.filter(f => f.category === selectedCategory).map(food => (
                            <tr key={food.id}>
                                <td style={s.td}>{food.name}</td><td style={s.td}>{food.unit}</td><td style={s.td}>{food.kcal}</td>
                            </tr>
                        ))}
                        {foodLibrary.filter(f => f.category === selectedCategory).length === 0 && (
                            <tr>
                                <td colSpan="3" style={{...s.td, textAlign: 'center', color: '#999', fontStyle: 'italic'}}>Không có dữ liệu cho mục này</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            <h3 style={{ fontSize: '18px', marginBottom: '20px',fontWeight:'bold'}}>
                {editingId ? "Đang chỉnh sửa món ăn" : "Thống kê các món ăn theo ngày"}
            </h3>
            <div style={s.formRow} className="form-row">
                <div style={s.inputGroup} className="input-group">
                    <label style={{ fontWeight: 'bold' }}>Ngày</label>
                    <input type="date" style={s.inputDate} className="input-date" value={logDate} onChange={(e) => setLogDate(e.target.value)} />
                </div>
                <div style={s.inputGroup} className="input-group">
                    <label style={{ fontWeight: 'bold' }}>Loại thức ăn</label>
                    <select style={s.inputDate} className="input-date" value={selectedFood.name} onChange={(e) => setSelectedFood(foodLibrary.find(f => f.name === e.target.value))}>
                        {foodLibrary.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                    </select>
                </div>
                <div style={s.qtyGroup} className="qty-group">
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <button style={s.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                        <input 
                            style={{...s.qtyInput, width: '40px'}} 
                            type="number" 
                            value={quantity} 
                            onChange={(e) => setQuantity(Number(e.target.value))} 
                        />
                        <button style={s.qtyBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'flex-end'}}>
                        <input style={s.inputKcal} className="input-kcal" type="text" value={((selectedFood.kcal / selectedFood.baseWeight) * (quantity * selectedFood.baseWeight)).toFixed(1).replace('.0', '')} readOnly />
                        <button style={{...s.btnAdd, backgroundColor: editingId ? '#ff4db8' : '#757575', flex: 1}} className="btn-add" onClick={handleAddLog}>{editingId ? "Cập nhật" : "Thêm"}</button>
                    </div>
                    {editingId && <button style={{...s.btnAdd, background: '#ccc', padding: '0 20px', marginLeft: '10px'}} onClick={() => {setEditingId(null); setQuantity(1);}}>Hủy</button>}
                </div>
            </div>

            {/* BẢNG KẾT QUẢ */}
            <div className="table-wrapper">
                <table style={s.table}>
                    <thead>
                        <tr>
                            <th style={s.th}>#</th>
                            <th style={s.th}>Ngày</th>
                            <th style={s.th}>Thực phẩm</th>
                            <th style={s.th}>Số lượng</th>
                            <th style={s.th}>Calo</th>
                            <th style={s.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLogs.map((log, index) => (
                            <tr key={log.id}>
                                <td style={s.td}>{startIndex + index + 1}</td>
                                <td style={s.td}>{log.date}</td>
                                <td style={s.td}>{log.food === 'Dưa hấu' ? 'Dưa hấu..' : log.food}</td>
                                <td style={s.td}>{log.qty === foodLibrary.find(f => f.name === log.food)?.baseWeight ? log.unit : `${log.qty}g`}</td>
                                <td style={s.td}>{String(log.kcal).replace('.0', '')}</td>
                                <td style={s.td}>
                                    <div style={{display: 'flex', gap: '5px'}}>
                                        <button style={s.btnEdit} onClick={() => handleEdit(log)}>Sửa</button>
                                        <button style={s.btnDelete} onClick={() => handleDelete(log.id)}>Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {[...Array(Math.max(0, itemsPerPage - currentLogs.length))].map((_, i) => (
                            <tr key={`empty-${i}`} style={{height: '49px'}}>
                                <td style={s.td}></td>
                                <td style={s.td}></td><td style={s.td}></td><td style={s.td}></td><td style={s.td}></td><td style={s.td}></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PHÂN TRANG */}
            <div style={s.paginationContainer} className="pagination-container"> 
                <div 
                    style={{...s.pageBox, ...(currentPage === 1 ? s.pageDisabled : {})}} 
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                >
                    &lt;
                </div>
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
                
                <div 
                    style={{...s.pageBox, ...(currentPage === totalPages ? s.pageDisabled : {})}} 
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                >
                    &gt;
                </div>
                
                <select 
                    style={s.pageSelect} 
                    value={itemsPerPage} 
                    onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                >
                    <option value={5}>5/Trang</option>
                    <option value={10}>10/Trang</option>
                    <option value={20}>20/Trang</option>
                    <option value={50}>50/Trang</option>
                </select>
            </div>
        </main>
    );
};

export default CalorieTracker;