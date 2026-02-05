// Trang tính chỉ số cơ thể

import { useState } from 'react'; 
import BlogImg from '../../assets/img/img-blog.svg';
import FoodDetailModal from '../../components/common/FoodDetailModal';
import VegetablesImg from '../../assets/img/Vegetables.jpg';
import PotatoesImg from '../../assets/img/Potatoes.svg';

const BMICalculator = () => {
    // STATE QUẢN LÝ DỮ LIỆU VÀ GIAO DIỆN
    const [height, setHeight] = useState(''); // Chiều cao (cm) người dùng nhập
    const [weight, setWeight] = useState(''); // Cân nặng (kg) người dùng nhập
    const [BMI, setBMI] = useState(null);   // Chỉ số BMI sau khi tính toán
    const [bmiStatus, setBmiStatus] = useState(''); // Trạng thái phân loại BMI
    const [openModal, setOpenModal] = useState(false);  // Trạng thái hiển thị cửa sổ chi tiết món ăn (Modal)
    const [selectedFood, setSelectedFood] = useState(null); // Lưu thông tin món ăn đang được xem chi tiết

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
    // Hàm tính toán chỉ số BMI dựa trên chiều cao và cân nặng
    const calculateBMI = () => { 
        if (!height || !weight) {
            alert("Vui lòng nhập đầy đủ thông tin chiều cao và cân nặng!");
            return;
        }
        const h = height / 100; // Chuyển đổi đơn vị từ cm sang mét
        const result = (weight / (h * h)).toFixed(1); // Công thức BMI = cân nặng / (chiều cao * chiều cao)
        setBMI(result); // Lưu kết quả vào state để hiển thị

        // Lưu thông tin vào localStorage để dùng cho trang tính toán calo
        localStorage.setItem('user_body_index', JSON.stringify({
            height: height,
            weight: weight,
            bmi: result,
            status: '' // Sẽ được cập nhật dưới đây
        }));

        // Phân loại BMI theo chuẩn WHO cho người Châu Á
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
        container: { padding: '40px 20px 100px 20px', maxWidth: '1000px', margin: '80px auto 0', fontFamily: '"Inter", sans-serif' }, // Khung chứa chính của trang
        title: { textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' },// Tiêu đề trang
        bmiForm: { display: 'flex', gap: '15px', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '50px', flexWrap: 'wrap' }, // Khung chứa form tính BMI
        formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' }, // Nhóm nhập liệu
        label: { fontWeight: 'bold', fontSize: '14px', color: '#333' }, // Nhãn cho ô nhập liệu
        input: { padding: '12px', border: '1px solid #ddd', borderRadius: '4px', background: '#f0f0f0', width: '200px', outline: 'none' }, // Ô nhập liệu
        btnSubmit: { padding: '12px 25px', background: '#d9d9d9', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }, // Nút tính toán
        
        subTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '25px' },// Tiêu đề phụ
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
        foodImgBox: { width: '150px', height: '120px', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 },// Khung chứa ảnh món ăn
        img: { width: '100%', height: '100%', objectFit: 'cover' },// Ảnh món ăn
        foodInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },// Thông tin món ăn
        foodTitle: { fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#000' },// Tiêu đề món ăn
        foodDesc: { fontSize: '14px', color: '#666', margin: '0 0 10px 0', lineHeight: '1.5' },// Mô tả món ăn
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
        }, // Nút xem chi tiết món ăn
        bmiStatusText: { width: '100%', textAlign: 'center', marginTop: '10px', fontSize: '15px', fontWeight: '500' } // Style cho dòng thông báo tình trạng
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
            
            <div style={styles.bmiForm} className="bmi-form"> { /* Khung chứa form tính BMI */ }
                <div style={styles.formGroup} className="form-group"> { /* Nhóm nhập liệu Chiều cao */ }
                    <label style={styles.label}>Chiều cao (cm)</label> {/* Nhãn cho ô nhập liệu */}
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
                        }} /* Cập nhật chiều cao khi người dùng nhập liệu và ngăn số âm */
                        placeholder="Nhập chiều cao..."
                    />
                </div>
                
                <div style={styles.formGroup} className="form-group"> {/* Nhóm nhập liệu Cân nặng */}
                    <label style={styles.label}>Cân nặng (kg)</label> {/* Nhãn cho ô nhập liệu */}
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
                        }} /* Cập nhật cân nặng khi người dùng nhập liệu và ngăn số âm */
                        placeholder="Nhập cân nặng..."
                    />
                </div>

                <div style={styles.formGroup} className="form-group"> {/* Nhóm hiển thị kết quả BMI */}
                    <label style={styles.label}>Kết quả BMI</label>
                    <input 
                        style={{...styles.input, background: '#e0e0e0', fontWeight: 'bold'}} /* Áp dụng style đặc biệt cho ô kết quả */ 
                        className="bmi-input"
                        value={BMI || ''} /* Hiển thị kết quả BMI, nếu chưa có thì để trống */
                        readOnly 
                        placeholder="Kết quả"
                    />
                </div>

                <button style={styles.btnSubmit} className="bmi-btn-submit" onClick={calculateBMI}>Tính toán</button> 

                {/* Dòng thông báo tình trạng nhỏ dưới phần nhập liệu */}
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

            {/* Món ăn 1 */}
            <div style={styles.foodCard} className="food-card"> {/* Thẻ món ăn */ }
                <div style={styles.foodImgBox} className="food-img-box"> {/* Khung chứa ảnh món ăn */ }
                    <img src={potatoesData.img} alt={potatoesData.title} style={styles.img} /> {/* Ảnh món ăn */ }
                </div>
                <div style={styles.foodInfo}> {/* Thông tin món ăn */ }
                    <h4 style={styles.foodTitle} className="food-title">{potatoesData.title}</h4> {/* Tiêu đề món ăn */ }
                    <p style={styles.foodDesc} className="food-desc">{potatoesData.desc}</p> {/* Mô tả món ăn */ }
                    <button 
                        style={styles.btnDetail} /* Nút xem chi tiết món ăn */
                        className="food-btn-detail"
                        onClick={() => {   
                            setSelectedFood(potatoesData); /* Đặt món ăn được chọn */
                            setOpenModal(true); /* Mở Modal */
                        }}
                    >
                        Chi tiết
                    </button>
                </div>
            </div>

            {/* Món ăn 2 - Có chức năng mở Modal */}
            <div style={styles.foodCard} className="food-card"> {/* Thẻ món ăn */ }
                <div style={styles.foodImgBox} className="food-img-box"> {/* Khung chứa ảnh món ăn */ }
                    <img src={VegetablesImg} alt="Vegetables" style={styles.img} /> {/* Ảnh món ăn */}
                </div>
                <div style={styles.foodInfo}> {/* Thông tin món ăn */ }
                    <h4 style={styles.foodTitle} className="food-title">{vegetableData.title}</h4> {/* Tiêu đề món ăn */}
                    <p style={styles.foodDesc} className="food-desc">{vegetableData.desc}</p>   {/* Mô tả món ăn */}
                    <button 
                        style={styles.btnDetail}
                        className="food-btn-detail"
                        onClick={() => {   
                            setSelectedFood(vegetableData); /* Đặt món ăn được chọn */
                            setOpenModal(true);/* Mở Modal */
                        }}
                    >
                        Chi tiết
                    </button>
                </div>
            </div>

            {/* Hiển thị Modal khi openModal = true */}
            {openModal && ( //nếu trạng thái mở Modal là true thì hiển thị Modal
                <FoodDetailModal //hiển thị chi tiết món ăn
                    food={selectedFood} //truyền món ăn được chọn vào modal
                    onClose={() => setOpenModal(false)} //hàm đóng modal,đặt trạng thái mở Modal về false
                />    
            )}
        </div>
    );
}

export default BMICalculator;