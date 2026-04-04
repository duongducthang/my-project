import { useEffect, useMemo, useState } from 'react';
import axiosClient from '../../services/axiosClient';

const FOOD_LIBRARY = [
    { id: 1, name: 'Thịt gà', unit: '100g', kcal: 239, baseWeight: 100, category: 'meat' },
    { id: 2, name: 'Thịt heo', unit: '100g', kcal: 242.1, baseWeight: 100, category: 'meat' },
    { id: 3, name: 'Trứng gà', unit: '100g (2 quả)', kcal: 155.1, baseWeight: 100, category: 'meat' },
    { id: 4, name: 'Trứng vịt', unit: '70g (1 quả)', kcal: 130, baseWeight: 70, category: 'meat' },
    { id: 5, name: 'Cá ngừ', unit: '100g', kcal: 129.8, baseWeight: 100, category: 'meat' },
    { id: 6, name: 'Tôm', unit: '100g', kcal: 99.2, baseWeight: 100, category: 'meat' },
    { id: 7, name: 'Súp lơ', unit: '400g', kcal: 100, baseWeight: 100, category: 'vegetables' },
    { id: 8, name: 'Dưa hấu', unit: '400g', kcal: 120, baseWeight: 100, category: 'vegetables' },
    { id: 9, name: 'Khoai tây', unit: '100g', kcal: 77, baseWeight: 100, category: 'vegetables' },
    { id: 10, name: 'Chuối', unit: '200g', kcal: 176, baseWeight: 100, category: 'vegetables' },
];

const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toISOString().slice(0, 10);
};

const getLogId = (log) => log?.id || log?._id;

const CalorieTracker = () => {
    const [selectedCategory, setSelectedCategory] = useState('meat');
    const [selectedFood, setSelectedFood] = useState(FOOD_LIBRARY[0]);
    const [quantity, setQuantity] = useState(1);
    const [logDate, setLogDate] = useState(formatDate(new Date()));
    const [calories, setCalories] = useState([]); 
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchCalories = async () => {
        try {
            const res = await axiosClient.get('/calories/logs?limit=1000');
            const data = res?.logs || res;
            setCalories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Lỗi khi fetch calories:", err);
        }
    };

    useEffect(() => {
        fetchCalories();
    }, []);

    const categoryFoods = useMemo(
        () => FOOD_LIBRARY.filter((f) => f.category === selectedCategory),
        [selectedCategory]
    );

    useEffect(() => {
        const first = categoryFoods[0];
        if (first) setSelectedFood(first);
    }, [categoryFoods]);

    const totalPages = Math.ceil(calories.length / itemsPerPage) || 1;
    const currentLogs = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return calories.slice(start, start + itemsPerPage);
    }, [calories, currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleAddOrUpdate = async () => {
        if (!selectedFood || quantity <= 0) {
            alert('Vui lòng chọn thực phẩm và số lượng hợp lệ.');
            return;
        }
        const actualQty = Math.round(quantity * selectedFood.baseWeight);
        const calculatedKcal = Number(((selectedFood.kcal / selectedFood.baseWeight) * actualQty).toFixed(1));
        
        const payload = {
            date: logDate,
            food: selectedFood.name,
            unit: selectedFood.unit,
            qty: actualQty,
            kcal: calculatedKcal,
        };

        try {
            setIsSubmitting(true);
            if (editingId) {
                await axiosClient.put(`/calories/logs/${editingId}`, payload);
                setEditingId(null);
            } else {
                await axiosClient.post('/calories/logs', payload);
            }
            await fetchCalories();
            setQuantity(1);
            alert('Lưu dữ liệu thành công!');
        } catch (err) {
            alert(err?.message || 'Không thể lưu dữ liệu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!id || !window.confirm('Bạn có chắc chắn muốn xóa dòng này?')) return;
        try {
            await axiosClient.delete(`/calories/logs/${id}`);
            await fetchCalories();
        } catch (err) {
            alert(err?.message || 'Xóa thất bại.');
        }
    };

    const handleEdit = (log) => {
        const id = getLogId(log);
        setEditingId(id);
        setLogDate(formatDate(log.date));
        const food = FOOD_LIBRARY.find((f) => f.name === log.food);
        if (!food) return;
        setSelectedCategory(food.category);
        setSelectedFood(food);
        setQuantity(Math.max(1, Math.round(log.qty / food.baseWeight)));
    };

    return (
        <div className="tracker-page">
            <style>{`
                .tracker-page { background: #fff; min-height: 100vh; font-family: Inter, sans-serif; padding: 20px; }
                .tracker-layout { max-width: 1100px; margin: 0 auto; }
                .tracker-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 10px; color: #333; }
                .tracker-select { width: 300px; border: 1px solid #ddd; padding: 8px; border-radius: 4px; color: #d14f9b; margin-bottom: 20px; }
                .tracker-table, .logs-table { width: 100%; border-collapse: collapse; margin-bottom: 30px;color: #bbbbbb; }
                .tracker-table th, .logs-table th { text-align: left; border-bottom: 1px solid #eee; padding: 12px 8px; color: #666; font-weight: 500; font-size: 0.9rem;background: #eeeeee; }
                .tracker-table td, .logs-table td { padding: 12px 8px; border-bottom: 1px solid #eee; font-size: 0.9rem; color: #333; }
                
                .tracker-form { display: flex; gap: 10px; align-items: center; margin-bottom: 20px; }
                .tracker-input, .tracker-food-select { padding: 3px; border: 1px solid #ddd; border-radius: 4px; }
                .step-btn { width: 30px; height: 35px; border: 1px solid #ddd; background: #fff; cursor: pointer; }
                .kcal-preview { min-width: 100px; text-align: center; font-weight: bold;border: 1px solid #ddd; border-radius: 4px; padding: 8px; }
                .btn-add { background: #777; color: #fff; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; }
                
                .btn-edit { background: #d14f9b; color: #fff; border: none; padding: 4px 12px; border-radius: 2px; cursor: pointer; margin-right: 5px; }
                .btn-delete { background: #fff; color: #d14f9b; border: 1px solid #d14f9b; padding: 4px 12px; border-radius: 2px; cursor: pointer; }

                /* Pagination Styles */
                .pagination-wrap { display: flex; justify-content: flex-end; align-items: center; gap: 5px; margin-top: 20px; }
                .pg-btn { border: 1px solid #eee; background: #fff; padding: 5px 10px; cursor: pointer; color: #666; border-radius: 3px; }
                .pg-btn.active { border-color: #d14f9b; color: #d14f9b; }
                .pg-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .pg-dots { color: #999; padding: 0 5px; }
                .page-size-select { margin-left: 10px; border: 1px solid #eee; padding: 5px; border-radius: 3px; }
            `}</style>

            <div className="tracker-layout">
                <h2 className="tracker-title">Chọn bảng tính</h2>
                <select className="tracker-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="meat">Bảng tính calo trong thịt/trứng/hải sản</option>
                    <option value="vegetables">Bảng tính calo trong rau/củ/quả</option>
                </select>

                <table className="tracker-table">
                    <thead>
                        <tr>
                            <th style={{width: '40%'}}>Loại thức ăn</th>
                            <th style={{width: '40%'}}>Đơn vị tính</th>
                            <th>Kcal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryFoods.map((food) => (
                            <tr key={food.id}>
                                <td>{food.name}</td>
                                <td>{food.unit}</td>
                                <td>{food.kcal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h3 className="tracker-title" style={{marginTop: '40px'}}>Thống kê các món ăn theo ngày</h3>
                <div className="tracker-form">
                    <input className="tracker-input" type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} />
                    <select
                        className="tracker-food-select"
                        style={{width: '200px'}}
                        value={selectedFood?.name || ''}
                        onChange={(e) => setSelectedFood(FOOD_LIBRARY.find((f) => f.name === e.target.value))}
                    >
                        {FOOD_LIBRARY.map((f) => (
                            <option key={f.id} value={f.name}>{f.name}</option>
                        ))}
                    </select>
                    <button className="step-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                    <input className="tracker-input" style={{width: '40px', textAlign: 'center'}} value={quantity} readOnly />
                    <button className="step-btn" onClick={() => setQuantity(q => q + 1)}>+</button>
                    <div className="kcal-preview">{selectedFood ? (selectedFood.kcal * quantity).toFixed(1) : 0}</div>
                    <button className="btn-add" onClick={handleAddOrUpdate} disabled={isSubmitting}>
                        {editingId ? 'Cập nhật' : 'Thêm vào bảng'}
                    </button>
                </div>

                <table className="logs-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ngày</th>
                            <th>Thực phẩm</th>
                            <th>Số lượng</th>
                            <th>calo</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLogs.length === 0 ? (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: '30px'}}>Chưa có dữ liệu.</td></tr>
                        ) : (
                            currentLogs.map((log, idx) => (
                                <tr key={getLogId(log) || idx}>
                                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                    <td>{formatDate(log.date)}</td>
                                    <td>{log.food}</td>
                                    <td>{log.qty}</td>
                                    <td>{log.kcal}</td>
                                    <td>
                                        <button className="btn-edit" onClick={() => handleEdit(log)}>Edit</button>
                                        <button className="btn-delete" onClick={() => handleDelete(getLogId(log))}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="pagination-wrap">
                    <button className="pg-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
                    
                    <button className={`pg-btn ${currentPage === 1 ? 'active' : ''}`} onClick={() => handlePageChange(1)}>1</button>
                    
                    {currentPage > 3 && <span className="pg-dots">...</span>}
                    
                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) <= 1) {
                            return (
                                <button key={page} className={`pg-btn ${currentPage === page ? 'active' : ''}`} onClick={() => handlePageChange(page)}>
                                    {page}
                                </button>
                            );
                        }
                        return null;
                    })}

                    {currentPage < totalPages - 2 && <span className="pg-dots">...</span>}
                    
                    {totalPages > 1 && (
                        <button className={`pg-btn ${currentPage === totalPages ? 'active' : ''}`} onClick={() => handlePageChange(totalPages)}>
                            {totalPages}
                        </button>
                    )}

                    <button className="pg-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
                    
                    <select className="page-size-select">
                        <option>10/page</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CalorieTracker;