import { useState } from 'react';
import BlogImg from '../../assets/img/img-blog.svg';
import FoodDetailModal from '../../components/common/FoodDetailModal';
import VegetablesImg from '../../assets/img/Vegetables.jpg';
import PotatoesImg from '../../assets/img/Potatoes.svg';

const BMICalculator = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [BMI, setBMI] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    // Dữ liệu món ăn cho Modal
    const potatoesData = {
        title: "Potatoes", 
        desc: "Potatoes are very high in vitamin C, their skins are packed with fiber and, although they are higher...", 
        fullDesc: "Potatoes are very high in vitamin C, their skins are packed with fiber and, although they are higher in carbs, these starchy complex carbohydrates are converted into energy and will keep you feeling fuller for longer. Check out our Potatoes and Potato Products Calorie Chart below for more nutritional information.",
        img: PotatoesImg, 
        details: [
            { name: "Baked Potato", serving: "1 piece (173g)", calories: "212 cal" },
            { name: "Croquettes", serving: "1piece,small(19g)", calories: "34 cal" },
            { name: "Curly Fries", serving: "1 portion (85g)", calories: "150 cal" },
            { name: "French Fries", serving: "1 portion (120g)", calories: "374 cal" },
            { name: "Gnocchi", serving: "1 portion (200g)", calories: "326 cal" },
            { name: "Hash Browns", serving: "1 piece (50g)", calories: "86 cal" },
            { name: "Latkes", serving: "1 piece, small (25g)", calories: "49 cal" }
        ]
    };

    const vegetableData = {
        title: "Vegetables", 
        desc: "Vegetables are a great high-volume, low-calorie option. You can eat a lot of them",
        fullDesc: "Vegetables are a great high-volume, low-calorie option. You can eat a lot of them",
        img: VegetablesImg,
        details: [
            { name: "Arrowroot", serving: "1 piece (33 g)", calories: "21 cal" },
            { name: "Artichoke", serving: "1 piece (128 g)", calories: "56 cal" },
            { name: "Asparagus", serving: "1 piece, small (12 g)", calories: "2 cal" },
            { name: "Asparagus, cooked", serving: "1 portion (125 g)", calories: "19 cal" },
            { name: "Azuki Beans", serving: "1 portion (60 g)", calories: "217 cal" },
            { name: "Baked Beans", serving: "1 cup (253 g)", calories: "266 cal" }
        ]
    };

    const calculateBMI = () => {
        if (height && weight) {
            const h = height / 100;
            const result = (weight / (h * h)).toFixed(1);
            setBMI(result);
        }
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
        
        subTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '25px', borderLeft: '5px solid #D14F9B', paddingLeft: '15px' },
        foodCard: { display: 'flex', gap: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '12px', marginBottom: '20px', alignItems: 'center', background: '#fff' },
        foodImgBox: { width: '150px', height: '120px', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5' },
        img: { width: '100%', height: '100%', objectFit: 'cover' },
        foodInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
        foodTitle: { fontSize: '18px', fontWeight: 'bold', margin: 0 },
        foodDesc: { fontSize: '14px', color: '#666', margin: '0 0 10px 0' },
        btnDetail: { width: 'fit-content', padding: '8px 25px', background: '#d9d9d9', border: '1px solid #c0c0c0', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Tính chỉ số BMI của bạn</h2>
            
            <div style={styles.bmiForm}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Chiều cao (cm)</label>
                    <input 
                        type="number" 
                        style={styles.input} 
                        value={height} 
                        onChange={(e) => setHeight(e.target.value)} 
                        placeholder="Nhập chiều cao..."
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Cân nặng (kg)</label>
                    <input 
                        type="number" 
                        style={styles.input} 
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)} 
                        placeholder="Nhập cân nặng..."
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Kết quả BMI</label>
                    <input 
                        style={{...styles.input, background: '#e0e0e0', fontWeight: 'bold'}} 
                        value={BMI || ''} 
                        readOnly 
                        placeholder="Kết quả"
                    />
                </div>

                <button style={styles.btnSubmit} onClick={calculateBMI}>Tính toán</button>
            </div>

            <h3 style={styles.subTitle}>Danh sách món ăn gợi ý</h3>

            {/* Món ăn 1 */}
            <div style={styles.foodCard}>
                <div style={styles.foodImgBox}>
                    <img src={potatoesData.img} alt={potatoesData.title} style={styles.img} />
                </div>
                <div style={styles.foodInfo}>
                    <h4 style={styles.foodTitle}>{potatoesData.title}</h4>
                    <p style={styles.foodDesc}>{potatoesData.desc}</p>
                    <button 
                        style={styles.btnDetail}
                        onClick={() => {   
                            setSelectedFood(potatoesData);
                            setOpenModal(true);
                        }}
                    >
                        Chi tiết
                    </button>
                </div>
            </div>

            {/* Món ăn 2 - Có chức năng mở Modal */}
            <div style={styles.foodCard}>
                <div style={styles.foodImgBox}>
                    <img src={VegetablesImg} alt="Vegetables" style={styles.img} />
                </div>
                <div style={styles.foodInfo}>
                    <h4 style={styles.foodTitle}>{vegetableData.title}</h4>
                    <p style={styles.foodDesc}>{vegetableData.desc}</p>
                    <button 
                        style={styles.btnDetail}
                        onClick={() => {   
                            setSelectedFood(vegetableData);
                            setOpenModal(true);
                        }}
                    >
                        Chi tiết
                    </button>
                </div>
            </div>

            {/* Hiển thị Modal khi openModal = true */}
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