import { useEffect, useMemo, useState } from 'react';
import axiosClient from '../../services/axiosClient';

const FOOD_LIBRARY = [
    { id: 1, name: 'Thịt gà', unit: '100g', kcal: 239, baseWeight: 100, category: 'meat' },
    { id: 2, name: 'Thịt heo', unit: '100g', kcal: 242.1, baseWeight: 100, category: 'meat' },
    { id: 3, name: 'Trứng gà', unit: '100g (2 quả)', kcal: 155.1, baseWeight: 100, category: 'meat' },
    { id: 4, name: 'Thịt vịt', unit: '70g (1 quả)', kcal: 130, baseWeight: 70, category: 'meat' },
    { id: 5, name: 'Cá ngừ', unit: '100g', kcal: 129.8, baseWeight: 100, category: 'seafood' },
    { id: 6, name: 'Tôm', unit: '100g', kcal: 99.2, baseWeight: 100, category: 'seafood' },
    { id: 7, name: 'Cua', unit: '100g', kcal: 103, baseWeight: 100, category: 'seafood' },
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

    const fetchCalories = async () => {
        try {
            console.log("[API Request] GET /calories/logs");
            const res = await axiosClient.get('/calories/logs?limit=100');
            
            const data = res?.logs || res;
            console.log("[API Response] Calories logs fetched:", data);
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
                console.log(`[API Request] PUT /calories/logs/${editingId}`, payload);
                await axiosClient.put(`/calories/logs/${editingId}`, payload);
                setEditingId(null);
            } else {
                console.log("[API Request] POST /calories/logs", payload);
                await axiosClient.post('/calories/logs', payload);
            }
            
            await fetchCalories();
            
            setQuantity(1);
            window.dispatchEvent(new Event('calorieLogsUpdated'));
            alert('Lưu dữ liệu thành công!');
        } catch (err) {
            console.error("Lỗi khi lưu calorie:", err);
            alert(err?.message || 'Không thể lưu dữ liệu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!id) return;
        if (!window.confirm('Bạn có chắc chắn muốn xóa dòng này?')) return;
        
        try {
            console.log(`[API Request] DELETE /calories/logs/${id}`);
            await axiosClient.delete(`/calories/logs/${id}`);
            await fetchCalories();
            window.dispatchEvent(new Event('calorieLogsUpdated'));
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
        setQuantity(Math.max(1, Number((log.qty || food.baseWeight) / food.baseWeight)));
    };

    return (
        <div className="tracker-page">
            <style>{`
                .tracker-page { background: #f2f2f2; min-height: 100vh; font-family: Inter, sans-serif; padding: 16px 14px 38px; }
                .tracker-layout { max-width: 1180px; margin: 0 auto; }
                .tracker-title { font-size: 1.6rem; font-weight: 600; margin: 6px 0 12px; color: #333; }
                .tracker-select { min-width: 360px; border: 1px solid #d8d8d8; background: #fff; border-radius: 4px; padding: 7px 10px; font-size: 1.22rem; color: #c34d9b; }
                .tracker-table { width: 100%; border-collapse: collapse; margin-top: 10px; background: #f2f2f2; }
                .tracker-table th, .tracker-table td { text-align: left; border-bottom: 1px solid #d4d4d4; padding: 10px 8px; font-size: 1.2rem; color: #444; }
                .tracker-table thead th { font-weight: 600; color: #555; }
                .tracker-section-title { font-size: 1.32rem; font-weight: 700; margin: 24px 0 8px; color: #444; }
                .tracker-form { margin-top: 16px; display: grid; grid-template-columns: 170px 180px 60px 60px 90px 160px; gap: 10px; align-items: center; }
                .tracker-input, .tracker-food-select { border: 1px solid #d8d8d8; border-radius: 4px; background: #fff; padding: 7px 10px; font-size: 1.2rem; color: #444; }
                .step-btn { border: 1px solid #d6d6d6; background: #fff; border-radius: 3px; padding: 7px 0; font-size: 1.15rem; cursor: pointer; }
                .kcal-preview { border: 1px solid #d8d8d8; border-radius: 4px; background: #f8f8f8; padding: 7px 10px; font-size: 1.2rem; color: #555; text-align: center; }
                .btn-add { border: none; background: #6d6d6d; color: #fff; border-radius: 4px; padding: 9px 12px; font-size: 1.2rem; cursor: pointer; }
                .btn-add:disabled { opacity: 0.6; cursor: not-allowed; }
                .logs-table { margin-top: 14px; width: 100%; border-collapse: collapse; background: #fff; }
                .logs-table th, .logs-table td { border-bottom: 1px solid #ececec; padding: 10px 8px; font-size: 1.16rem; color: #444; }
                .logs-table th { font-weight: 600; background: #fafafa; }
                .action-wrap { display: flex; gap: 6px; }
                .btn-edit, .btn-delete { border: none; border-radius: 3px; padding: 4px 10px; font-size: 1.1rem; cursor: pointer; }
                .btn-edit { background: #d14f9b; color: #fff; }
                .btn-delete { background: #f9d3ea; color: #d14f9b; }
                .empty-log { text-align: center; color: #888; padding: 24px 8px; font-size: 1.16rem; }
                @media (max-width: 900px) {
                    .tracker-form { grid-template-columns: 1fr 1fr 1fr; }
                    .tracker-select { min-width: 0; width: 100%; }
                }
            `}</style>

            <div className="tracker-layout">
                <div className="tracker-wrap">
                    <h2 className="tracker-title">Chọn bảng tính</h2>
                    <select className="tracker-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="meat">Bảng tính calo trong thịt/trứng/hải sản</option>
                        <option value="seafood">Bảng tính calo trong hải sản</option>
                    </select>

                    <table className="tracker-table">
                        <thead>
                            <tr>
                                <th>Loại thức ăn</th>
                                <th>Đơn vị tính</th>
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

                    <h3 className="tracker-section-title">Thống kê các món ăn theo ngày</h3>
                    <div className="tracker-form">
                        <input className="tracker-input" type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} />
                        <select
                            className="tracker-food-select"
                            value={selectedFood?.name || ''}
                            onChange={(e) => setSelectedFood(FOOD_LIBRARY.find((f) => f.name === e.target.value))}
                        >
                            {FOOD_LIBRARY.map((f) => (
                                <option key={f.id} value={f.name}>{f.name}</option>
                            ))}
                        </select>
                        <button className="step-btn" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
                        <button className="step-btn" onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                        <div className="kcal-preview">{selectedFood ? Number((selectedFood.kcal * quantity).toFixed(1)) : 0}</div>
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
                            {calories.length === 0 && (
                                <tr><td className="empty-log" colSpan="6">Chưa có dữ liệu log trên DB.</td></tr>
                            )}
                            {calories.map((log, idx) => {
                                const id = getLogId(log);
                                return (
                                    <tr key={id || idx}>
                                        <td>{idx + 1}</td>
                                        <td>{formatDate(log.date)}</td>
                                        <td>{log.food}</td>
                                        <td>{log.qty}</td>
                                        <td>{log.kcal}</td>
                                        <td>
                                            <div className="action-wrap">
                                                <button className="btn-edit" onClick={() => handleEdit(log)}>Edit</button>
                                                <button className="btn-delete" onClick={() => handleDelete(id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CalorieTracker;
