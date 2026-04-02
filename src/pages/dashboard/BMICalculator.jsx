// Trang tính chỉ số cơ thể

import { useState, useEffect } from 'react'; 
import BlogImg from '../../assets/img/img-blog.svg';
import axiosClient from '../../services/axiosClient';
import FoodDetailModal from '../../components/common/FoodDetailModal';
import VegetablesImg from '../../assets/img/Vegetables.jpg';
import PotatoesImg from '../../assets/img/Potatoes.svg';

const BMICalculator = () => {
    const [height, setHeight] = useState(''); 
    const [weight, setWeight] = useState(''); 
    const [BMI, setBMI] = useState(null);   
    const [bmiStatus, setBmiStatus] = useState(''); 
    const [openModal, setOpenModal] = useState(false);  
    const [selectedFood, setSelectedFood] = useState(null); 
    const [foods, setFoods] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const foodRes = await axiosClient.get('/foods');
                setFoods(foodRes?.foods || foodRes || []); 
                const historyRes = await axiosClient.get('/health/history');
                const historyData = historyRes?.data || historyRes;
                const latest = Array.isArray(historyData) ? historyData[0] : null;
                
                if (latest) {
                    setHeight(latest.height);
                    setWeight(latest.weight);
                    setBMI(latest.bmi);
                    
                    
                    const bmiVal = latest.bmi;
                    if (bmiVal < 18.5) setBmiStatus('Gầy');
                    else if (bmiVal <= 22.9) setBmiStatus('Bình thường');
                    else if (bmiVal <= 24.9) setBmiStatus('Thừa cân');
                    else setBmiStatus('Béo phì');
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    
    const calculateBMI = async () => { 
        if (!height || !weight) {
            alert("Vui lòng nhập đầy đủ thông tin chiều cao và cân nặng!");
            return;
        }
        
        const h = parseFloat(height) / 100;
        const w = parseFloat(weight);
        const result = (w / (h * h)).toFixed(1);
        const bmiVal = parseFloat(result);
        setBMI(result);

        let status = '';
        if (bmiVal < 18.5) status = 'Gầy';
        else if (bmiVal <= 22.9) status = 'Bình thường';
        else if (bmiVal <= 24.9) status = 'Thừa cân';
        else status = 'Béo phì';
        setBmiStatus(status);

        try {
            setIsSaving(true);
            
            const payload = {
                height: parseFloat(height),
                weight: parseFloat(weight),
                date: new Date().toISOString()
            };
            
            await axiosClient.post('/health/bmi', payload);
            
            localStorage.setItem('user_body_index', JSON.stringify({
                height, weight, bmi: result, status, updatedAt: new Date().toISOString()
            }));
            
            alert("Đã lưu chỉ số cơ thể thành công!");
        } catch (error) {
            alert(error.message || "Lỗi khi lưu dữ liệu vào Database.");
        } finally {
            setIsSaving(false);
        }
    };

   
    const styles = {
        container: { padding: '40px 20px 100px 20px', maxWidth: '1000px', margin: '80px auto 0', fontFamily: '"Inter", sans-serif' }, 
        title: { textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' },
        bmiForm: { display: 'flex', gap: '15px', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '50px', flexWrap: 'wrap' }, 
        formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' }, 
        label: { fontWeight: 'bold', fontSize: '14px', color: '#333' }, 
        input: { padding: '12px', border: '1px solid #ddd', borderRadius: '4px', background: '#f0f0f0', width: '200px', outline: 'none' }, 
        btnSubmit: { padding: '12px 25px', background: '#d9d9d9', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }, 
        
        subTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '25px' },
        foodCard: { 
            display: 'flex', 
            gap: '20px', 
            padding: '20px', 
            borderRadius: '12px', 
            marginBottom: '20px', 
            alignItems: 'center', 
            background: '#fff',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        },// Thẻ món ăn 
        foodImgBox: { width: '150px', height: '120px', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 },
        img: { width: '100%', height: '100%', objectFit: 'cover' },
        foodInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
        foodTitle: { fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#000' },
        foodDesc: { fontSize: '14px', color: '#666', margin: '0 0 10px 0', lineHeight: '1.5' },
        btnDetail: { 
            width: 'fit-content', 
            padding: '8px 25px', 
            background: '#fff', 
            color: '#D14F9B',
            border: '1px solid #D14F9B', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontSize: '13px',
            fontWeight: 'bold',
            transition: 'all 0.2s ease'
        }, 
        bmiStatusText: { width: '100%', textAlign: 'center', marginTop: '10px', fontSize: '15px', fontWeight: '500' } 
    };

    return (
        <div style={styles.container} className="bmi-calculator-container">
            <style>{`
                @media (max-width: 768px) {
                    .bmi-calculator-container { padding-top: 20px !important; margin-top: 60px !important; }
                    .bmi-form { flex-direction: column !important; align-items: stretch !important; gap: 20px !important; }
                    .form-group { width: 100% !important; }
                    .bmi-input { width: 100% !important; }
                    .food-card { flex-direction: column !important; align-items: flex-start !important; padding: 15px !important; }
                    .food-img-box { width: 100% !important; height: 180px !important; }
                    .bmi-title { font-size: 20px !important; }
                    .bmi-btn-submit { width: 100% !important; padding: 15px !important; }
                    .food-title { font-size: 17px !important; }
                    .food-desc { font-size: 13px !important; -webkit-line-clamp: 3; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
                }
                .food-card:hover {
                    border-color: #D14F9B !important;
                    box-shadow: 0 4px 15px rgba(209, 79, 155, 0.1) !important;
                    transform: translateY(-2px);
                }
                .food-card:hover .food-btn-detail {
                    background: #D14F9B !important;
                    color: #fff !important;
                }
            `}</style>
            <h2 style={styles.title} className="bmi-title">Tính chỉ số BMI của bạn</h2>
            
            <div style={styles.bmiForm} className="bmi-form"> 
                <div style={styles.formGroup} className="form-group"> 
                    <label style={styles.label}>Chiều cao (cm)</label> 
                    <input 
                        type="number" 
                        min="0"
                        style={styles.input} 
                        className="bmi-input"
                        value={height} 
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || parseFloat(val) >= 0) {
                                setHeight(val);
                            }
                        }}
                        placeholder="Nhập chiều cao..."
                    />
                </div>
                
                <div style={styles.formGroup} className="form-group"> 
                    <label style={styles.label}>Cân nặng (kg)</label> 
                    <input 
                        type="number" 
                        min="0"
                        style={styles.input} 
                        className="bmi-input"
                        value={weight} 
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || parseFloat(val) >= 0) {
                                setWeight(val);
                            }
                        }} 
                        placeholder="Nhập cân nặng..."
                    />
                </div>

                <div style={styles.formGroup} className="form-group">
                    <label style={styles.label}>Kết quả BMI</label>
                    <input 
                        style={{...styles.input, background: '#e0e0e0', fontWeight: 'bold'}} 
                        className="bmi-input"
                        value={BMI || ''} 
                        readOnly 
                        placeholder="Kết quả"
                    />
                </div>

                <button 
                    style={{
                        ...styles.btnSubmit, 
                        background: isSaving ? '#ccc' : '#d9d9d9',
                        cursor: isSaving ? 'not-allowed' : 'pointer'
                    }} 
                    className="bmi-btn-submit" 
                    onClick={calculateBMI}
                    disabled={isSaving}
                >
                    {isSaving ? 'Đang lưu...' : 'Tính toán'}
                </button> 

                
                {isLoading && <div style={{width: '100%', textAlign: 'center'}}>Đang tải dữ liệu cũ...</div>}
                {bmiStatus && (
                    <div style={{
                        ...styles.bmiStatusText, 
                        color: bmiStatus === 'Bình thường' ? '#2e7d32' : (bmiStatus === 'Gầy' ? '#ed6c02' : '#d32f2f')
                    }}>
                        Tình trạng cơ thể: <strong>{bmiStatus}</strong>
                    </div>
                )}
            </div>

            <h3 style={styles.subTitle}>Danh sách món ăn gợi ý</h3>

            
            {foods.length > 0 ? (
                foods.map((food, index) => (
                    <div key={food._id || index} style={styles.foodCard} className="food-card">
                        <div style={styles.foodImgBox} className="food-img-box">
                            
                            <img 
                                src={food.imageUrl ? `src/assets/img/${food.imageUrl}` : `src/assets/img/img-blog.svg`} 
                                alt={food.title} 
                                style={styles.img} 
                            />
                        </div>
                        <div style={styles.foodInfo}>
                            <h4 style={styles.foodTitle} className="food-title">{food.title}</h4>
                            
                            <p style={styles.foodDesc} className="food-desc">
                                {food.desc || food.description || `${food.kcal || 0} kcal - ${food.category || 'Healthy'}`}
                            </p>
                            <button style={styles.btnDetail} className="food-btn-detail" onClick={() => { setSelectedFood(food); setOpenModal(true); }}>
                                Chi tiết
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p style={{ textAlign: 'center', color: '#666' }}>Đang tải món ăn từ cơ sở dữ liệu...</p>
            )}

            
            {openModal && ( 
                <FoodDetailModal 
                    food={selectedFood} 
                    onClose={() => setOpenModal(false)} 
                />    
            )}
        </div>
    );
}

export default BMICalculator;