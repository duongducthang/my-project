// Trang tính chỉ số cơ thể

import { useState } from 'react'; 
import BlogImg from '../../assets/img/img-blog.svg';
import FoodDetailModal from '../../components/common/FoodDetailModal';
import VegetablesImg from '../../assets/img/Vegetables.jpg';
import PotatoesImg from '../../assets/img/Potatoes.svg';

const BMICalculator = () => {
    // STATE QUẢN LÝ DỮ LIỆU VÀ GIAO DIỆN
    const [height, setHeight] = useState(''); 
    const [weight, setWeight] = useState(''); 
    const [BMI, setBMI] = useState(null);   
    const [bmiStatus, setBmiStatus] = useState(''); 
    const [openModal, setOpenModal] = useState(false);  
    const [selectedFood, setSelectedFood] = useState(null); 

    //DỮ LIỆU MÓN ĂN GỢI Ý (Giả lập dữ liệu từ API)
    const potatoesData = { 
        title: "Potatoes", 
        desc: "Potatoes are very high in vitamin C, their skins are packed with fiber and, although they are higher...", 
        fullDesc: "Potatoes are very high in vitamin C, their skins are packed with fiber and, although they are higher in carbs, these starchy complex carbohydrates are converted into energy and will keep you feeling fuller for longer. Check out our Potatoes and Potato Products Calorie Chart below for more nutritional information.",
        img: PotatoesImg, 
        details: [
            { name: "Baked Potato", serving: "1 piece (173g)", calories: "212 " },
            { name: "Croquettes", serving: "1piece,small(19g)", calories: "34 " },
            { name: "Curly Fries", serving: "1 portion (85g)", calories: "150 " },
            { name: "French Fries", serving: "1 portion (120g)", calories: "374 " },
            { name: "Gnocchi", serving: "1 portion (200g)", calories: "326 " },
            { name: "Hash Browns", serving: "1 piece (50g)", calories: "86 " },
            { name: "Latkes", serving: "1 piece, small (25g)", calories: "49 " }
        ]
    };

    const vegetableData = {
        title: "Vegetables", 
        desc: "Vegetables are a great high-volume, low-calorie option. You can eat a lot of them",
        fullDesc: "Vegetables are a great high-volume, low-calorie option. You can eat a lot of them",
        img: VegetablesImg,
        details: [
            { name: "Arrowroot", serving: "1 piece (33 g)", calories: "21 " },
            { name: "Artichoke", serving: "1 piece (128 g)", calories: "56 " },
            { name: "Asparagus", serving: "1 piece, small (12 g)", calories: "2 " },
            { name: "Asparagus, cooked", serving: "1 portion (125 g)", calories: "19 " },
            { name: "Azuki Beans", serving: "1 portion (60 g)", calories: "217 " },
            { name: "Baked Beans", serving: "1 cup (253 g)", calories: "266 " }
        ]
    };

    // XỬ LÝ SỰ KIỆN
    const calculateBMI = () => { 
        if (!height || !weight) {
            alert("Vui lòng nhập đầy đủ thông tin chiều cao và cân nặng!");
            return;
        }
        const h = height / 100; 
        const result = (weight / (h * h)).toFixed(1); 
        setBMI(result); 

        
        localStorage.setItem('user_body_index', JSON.stringify({
            height: height,
            weight: weight,
            bmi: result,
            status: '' 
        }));

        const bmiVal = parseFloat(result);
        let status = '';
        if (bmiVal < 18.5) {
            status = 'Gầy';
        } else if (bmiVal >= 18.5 && bmiVal <= 22.9) {
            status = 'Bình thường';
        } else if (bmiVal >= 23 && bmiVal <= 24.9) {
            status = 'Thừa cân';
        } else {
            status = 'Béo phì';
        }
        setBmiStatus(status);

        // Cập nhật lại status vào localStorage
        localStorage.setItem('user_body_index', JSON.stringify({
            height: height,
            weight: weight,
            bmi: result,
            status: status,
            updatedAt: new Date().toISOString()
        }));
    };

    // Hệ thống Style định nghĩa trực tiếp
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
        },
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

                <button style={styles.btnSubmit} className="bmi-btn-submit" onClick={calculateBMI}>Tính toán</button> 

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

            <div style={styles.foodCard} className="food-card"> 
                <div style={styles.foodImgBox} className="food-img-box"> 
                    <img src={potatoesData.img} alt={potatoesData.title} style={styles.img} /> 
                </div>
                <div style={styles.foodInfo}> 
                    <h4 style={styles.foodTitle} className="food-title">{potatoesData.title}</h4>
                    <p style={styles.foodDesc} className="food-desc">{potatoesData.desc}</p>
                    <button 
                        style={styles.btnDetail} 
                        className="food-btn-detail"
                        onClick={() => {   
                            setSelectedFood(potatoesData); 
                            setOpenModal(true); 
                        }}
                    >
                        Chi tiết
                    </button>
                </div>
            </div>

           
            <div style={styles.foodCard} className="food-card"> 
                <div style={styles.foodImgBox} className="food-img-box"> 
                    <img src={VegetablesImg} alt="Vegetables" style={styles.img} /> 
                </div>
                <div style={styles.foodInfo}> 
                    <h4 style={styles.foodTitle} className="food-title">{vegetableData.title}</h4>
                    <p style={styles.foodDesc} className="food-desc">{vegetableData.desc}</p>   
                    <button 
                        style={styles.btnDetail}
                        className="food-btn-detail"
                        onClick={() => {   
                            setSelectedFood(vegetableData);
                            setOpenModal(true);
                        }}
                    >
                        Chi tiết
                    </button>
                </div>
            </div>

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