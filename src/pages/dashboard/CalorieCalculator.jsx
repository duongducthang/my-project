//Trang chỉ số calo

import { useState, useEffect } from 'react';

const CalorieCalculator = () => {
    // KHỞI TẠO STATE QUẢN LÝ NHẬP LIỆU
    // Lấy thông tin người dùng từ localStorage (nếu có)
    const getSavedBodyIndex = () => {
        const saved = localStorage.getItem('user_body_index');
        return saved ? JSON.parse(saved) : null;
    };

    const savedData = getSavedBodyIndex();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    const [age, setAge] = useState(() => {
        // Ưu tiên lấy tuổi từ thông tin người dùng đăng nhập (currentUser) để đảm bảo đồng bộ từ Profile
        if (currentUser && (currentUser.age !== undefined && currentUser.age !== null && currentUser.age !== '')) return currentUser.age;
        if (savedData && (savedData.age !== undefined && savedData.age !== null && savedData.age !== '')) return savedData.age;
        return 20;
    });

    const [gender, setGender] = useState(() => {
        // Ưu tiên lấy giới tính từ currentUser
        if (currentUser && currentUser.gender) {
            return currentUser.gender === 'Nam' ? 'male' : 'female';
        }
        if (savedData && savedData.gender) return savedData.gender;
        return 'female';
    }); 

    const [height, setHeight] = useState(savedData ? savedData.height : '');       // Chiều cao (cm)
    const [weight, setWeight] = useState(savedData ? savedData.weight : '');        // Cân nặng (kg)
    const [activity, setActivity] = useState(1.2);    // Mức độ vận động (Hệ số hoạt động chuẩn)
    
    // TDEE (Total Daily Energy Expenditure): Tổng lượng calo cơ thể tiêu thụ trong 1 ngày
    const [tdee, setTdee] = useState(0);  

    // CÁC HÀM XỬ LÝ (LOGIC)
    
    // Đồng bộ hóa dữ liệu từ localStorage khi có thay đổi
    useEffect(() => {
        const handleStorageChange = () => { 
            const data = getSavedBodyIndex(); 
            const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

            // Ưu tiên lấy tuổi và giới tính từ hồ sơ người dùng để đồng bộ từ trang Profile
            if (user) {
                if (user.age !== undefined && user.age !== null && user.age !== '') setAge(user.age);
                if (user.gender) setGender(user.gender === 'Nam' ? 'male' : 'female');
            }

            if (data) {
                if (data.height) setHeight(data.height);
                if (data.weight) setWeight(data.weight);
                // Nếu trang chỉ số cơ thể có lưu tuổi/giới tính riêng thì cập nhật thêm (nhưng user vẫn ưu tiên hơn)
                if (!user && data.age !== undefined && data.age !== null && data.age !== '') setAge(data.age);
                if (!user && data.gender) setGender(data.gender);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(handleStorageChange, 2000); // Kiểm tra mỗi 2s
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    // Tính toán TDEE ban đầu nếu có dữ liệu
    useEffect(() => {
        // Hàm tính toán Calo chính dựa trên công thức Mifflin-St Jeor
        const calculateTdee = () => {
            if (!age || !height || !weight) {
                setTdee(0);
                return;
            }

            // Bước 1: Tính BMR 
            let bmr = (10 * weight) + (6.25 * height) - (5 * age); 
            
            // Điều chỉnh BMR theo giới tính
            if (gender === 'male') { 
                bmr += 5;   // Nam giới cần nhiều năng lượng hơn một chút
            } else {
                bmr -= 161; // Nữ giới
            }
            
            // Bước 2: Tính TDEE bằng cách nhân BMR với hệ số vận động (activity)
            const result = Math.round(bmr * activity); 
            setTdee(result); // Cập nhật kết quả hiển thị
        };

        if (height && weight && age) {
            calculateTdee();
        } else {
            setTdee(0);
        }
    }, [height, weight, age, gender, activity]);

    // Lưu lại thông tin vào localStorage khi người dùng thay đổi trực tiếp tại đây
    useEffect(() => {
        if (height || weight || age || gender) {
            const currentSaved = getSavedBodyIndex();
            const newData = {
                ...currentSaved,
                height: height,
                weight: weight,
                age: age,
                gender: gender,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('user_body_index', JSON.stringify(newData));
        }
    }, [height, weight, age, gender]);

    // Hàm tính toán Calo chính dựa trên công thức Mifflin-St Jeor
    const handleCalculate = () => {
        if (!age || !height || !weight) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        // Bước 1: Tính BMR (Basal Metabolic Rate - Tỷ lệ trao đổi chất cơ bản)
        let bmr = (10 * weight) + (6.25 * height) - (5 * age); 
        
        // Điều chỉnh BMR theo giới tính
        if (gender === 'male') { 
            bmr += 5;   // Nam giới cần nhiều năng lượng hơn một chút
        } else {
            bmr -= 161; // Nữ giới
        }
        
        // Bước 2: Tính TDEE bằng cách nhân BMR với hệ số vận động (activity)
        const result = Math.round(bmr * activity); 
        setTdee(result); // Cập nhật kết quả hiển thị
    };

    // Hàm đặt lại (Reset) toàn bộ các ô nhập liệu về giá trị mặc định ban đầu
    const handleReset = () => { 
        const data = getSavedBodyIndex();
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        
        setAge(data?.age || user?.age || 20); 
        setGender(data?.gender || (user?.gender === 'Nam' ? 'male' : 'female') || 'female');
        setHeight(data ? data.height : '');
        setWeight(data ? data.weight : '');
        setActivity(1.2);
        setTdee(0);
    };

    //  Hệ thống Styles 
    const styles = {
        container: { padding: '40px 20px 100px 20px', maxWidth: '1100px', margin: '0 auto', fontFamily: '"Inter", sans-serif', backgroundColor: '#fff', minHeight: '100vh' },
        title: { textAlign: 'center', fontSize: '28px', marginBottom: '40px', fontWeight: 'bold', color: '#000' },
        calculatorBox: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', padding: '0 40px 40px 40px' },
        formField: { marginBottom: '20px' },
        label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '15px', color: '#000' },
        labelSub: { fontSize: '12px', fontWeight: 'normal', marginLeft: '5px', color: '#666' },
        inputGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
        input: { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '15px', outline: 'none' },
        inputSmall: { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' },
        unit: { fontSize: '14px', color: '#000', width: '30px' },
        radioGroup: { display: 'flex', gap: '30px', marginTop: '5px' },
        radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' },
        btnGroup: { display: 'flex', gap: '10px', marginTop: '30px' },
        btnSubmit: { flex: 1, background: '#D14F9B', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '2px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
        btnReset: { flex: 1, background: '#fff', color: '#D14F9B', border: '1px solid #D14F9B', padding: '12px 25px', borderRadius: '2px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
        selectActivity: { 
            width: '100%', 
            maxWidth: '100%',
            padding: '10px', 
            border: '1px solid #ddd', 
            borderRadius: '4px', 
            color: '#B41E8E', 
            fontSize: '14px', 
            cursor: 'pointer',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            appearance: 'auto'
        },
        activityList: { background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginTop: '15px', border: '1px solid #eee' },
        activeItem: { color: '#D14F9B', margin: '8px 0', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' },
        normalItem: { color: '#666', margin: '8px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' },
        
        resultSection: { background: '#f4f4f4', padding: '40px 20px', marginTop: '40px'},
        mainResult: { background: '#FEF7FF', padding: '25px', marginBottom: '25px',marginTop:'40px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'},
        resultGridWrapper: { background: '#fff', padding: '30px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
        resultGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' },
        resultCard: { textAlign: 'left', padding: '15px'},
        cardTitle: { fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '8px', lineHeight: '1.4' },
        cardDesc: { fontSize: '14px', color: '#888', marginBottom: '5px' },
        cardValue: { fontSize: '14px', color: '#000' },
        note: { fontSize: '12px', color: '#333', marginTop: '15px' }
    };

    return (
        <div style={styles.container} className="calorie-calculator-container"> 
            <style>{`
                @media (max-width: 992px) {
                    .calculator-box { grid-template-columns: 1fr !important; gap: 30px !important; padding: 0 10px !important; }
                    .result-grid { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
                    .calorie-title { font-size: 24px !important; }
                }
                @media (max-width: 768px) {
                    .result-grid { grid-template-columns: 1fr 1fr !important; gap: 15px !important; }
                    .card-title { font-size: 16px !important; word-break: break-word !important; }
                    .card-value { font-size: 13px !important; }
                    .main-result h3 { font-size: 18px !important; }
                }
                @media (max-width: 576px) {
                    .result-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
                    .main-result { padding: 20px !important; }
                    .result-card { padding: 20px !important; }
                    .activity-list-container { padding: 12px !important; }
                }
                @media (max-width: 480px) {
                    .main-result { width: 100% !important; padding: 15px !important; }
                    .result-section { padding: 25px 10px !important; }
                    .result-grid-wrapper { padding: 20px 15px !important; }
                    .calorie-title { font-size: 20px !important; margin-bottom: 20px !important; }
                    .card-title { font-size: 15px !important; }
                }
                .result-card:hover {
                    border-color: #D14F9B !important;
                    box-shadow: 0 4px 15px rgba(209, 79, 155, 0.1) !important;
                    transform: translateY(-2px);
                }
            `}</style>
            <h2 style={styles.title} className="calorie-title">Lượng calo cơ thể cần trong ngày</h2>

            <div style={styles.calculatorBox} className="calculator-box">  
                {/* PANEL NHẬP LIỆU */}
                <div>
                    <div style={styles.formField}>{/* Nhóm tuổi */ }
                        <label style={styles.label}>Tuổi</label>
                        <input 
                            type="number" 
                            min="0"
                            style={styles.inputSmall} 
                            value={age} 
                            onChange={(e) => {
                                const val = e.target.value;
                                // Chỉ chấp nhận số không âm và không rỗng
                                if (val === '' || (Number(val) >= 0 && !val.includes('-'))) {
                                    setAge(val === '' ? '' : Number(val));
                                }
                            }} 
                        /> { /* Cập nhật tuổi và ngăn số âm */ }
                    </div>

                    <div style={styles.formField}> {/* Nhóm giới tính */ }
                        <label style={styles.label}>Giới tính</label>
                        <div style={styles.radioGroup}>
                            <label style={styles.radioLabel}>
                                <input type="radio" name="gender" checked={gender === 'female'} onChange={() => setGender('female')} style={{accentColor: '#000'}} /> Nữ { /* Cập nhật giới tính khi người dùng chọn */ }
                            </label>
                            <label style={styles.radioLabel}>
                                <input type="radio" name="gender" checked={gender === 'male'} onChange={() => setGender('male')} style={{accentColor: '#000'}} /> Nam {/*cập nhật giới tính khi ng dùng chọn */}
                            </label>
                        </div>
                    </div>

                    <div style={styles.formField}> {/* Nhóm chiều cao */ }
                        <label style={styles.label}>Chiều cao <span style={styles.labelSub}>(Chiều cao)</span></label> { /* Nhãn với chú thích */ }
                        <div style={styles.inputGroup}> {/* Nhóm ô nhập liệu và đơn vị */ }
                            <input 
                                type="number" 
                                min="0"
                                style={styles.input} 
                                value={height} 
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || Number(val) >= 0) {
                                        setHeight(val === '' ? '' : Number(val));
                                    }
                                }} 
                            />{ /* Cập nhật chiều cao và ngăn số âm */ }
                            <span style={styles.unit}>cm</span> {/* Đơn vị cm */ }
                        </div>
                    </div>

                    <div style={styles.formField}> {/* Nhóm cân nặng */ }
                        <label style={styles.label}>Cân nặng <span style={styles.labelSub}>(Cân nặng)</span></label> { /* Nhãn với chú thích */ }
                        <div style={styles.inputGroup}>
                            <input 
                                type="number" 
                                min="0"
                                style={styles.input} 
                                value={weight} 
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || Number(val) >= 0) {
                                        setWeight(val === '' ? '' : Number(val));
                                    }
                                }} 
                            />{ /* Cập nhật cân nặng và ngăn số âm */ }
                            <span style={styles.unit}>kg</span>
                        </div>
                    </div>

                    <div style={styles.btnGroup}> {/* Nhóm nút Tính toán và Đặt lại */ }
                        <button style={styles.btnSubmit} onClick={handleCalculate}>Tính toán</button> 
                        <button style={styles.btnReset} onClick={handleReset}>Đặt lại</button> 
                    </div>
                    <p style={styles.note}>Tính toán tham khảo công thức: https://www.calculator.net/bmr-calculator.html</p>
                </div>

                {/* PANEL MỨC VẬN ĐỘNG */}
                <div>
                    <label style={styles.label}>Mức độ vận động</label>
                    <select 
                        style={styles.selectActivity}
                        value={activity}
                        onChange={(e) => setActivity(parseFloat(e.target.value))}
                    >
                        <option value={1.2}>Ít vận động</option>
                        <option value={1.375}>Vận động nhẹ</option>
                        <option value={1.55}>Vận động vừa</option>
                        <option value={1.725}>Vận động mạnh</option>
                        <option value={1.9}>Rất mạnh</option>
                    </select>
                    
                    <div style={styles.activityList} className="activity-list-container">
                        <p style={activity === 1.2 ? styles.activeItem : styles.normalItem}>
                            <span style={{ fontSize: '18px' }}>•</span> Ít vận động
                        </p>
                        <p style={activity === 1.375 ? styles.activeItem : styles.normalItem}>
                            <span style={{ fontSize: '18px' }}>•</span> Vận động nhẹ: Không tập thể dục nhiều
                        </p>
                        <p style={activity === 1.55 ? styles.activeItem : styles.normalItem}>
                            <span style={{ fontSize: '18px' }}>•</span> Vận động vừa: 1~3 lần/tuần
                        </p>
                        <p style={activity === 1.725 ? styles.activeItem : styles.normalItem}>
                            <span style={{ fontSize: '18px' }}>•</span> Vận động mạnh: 4~5 lần/tuần
                        </p>
                        <p style={activity === 1.9 ? styles.activeItem : styles.normalItem}>
                            <span style={{ fontSize: '18px' }}>•</span> Rất mạnh: 6~7 lần/tuần hoặc hơn
                        </p>
                    </div>
                </div>
            </div>

            {/* PHẦN KẾT QUẢ THEO BỐ CỤC ẢNH 1 */}
            <div style={styles.resultSection} className="result-section">
                <div style={styles.mainResult} className="main-result">
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                        Kết quả: {tdee} Calo/ngày (TDEE = Calorie x BMR)
                    </h3>
                    <p style={{ color: '#666' }}>
                        Lượng calo cần thiết: <strong>{tdee}</strong> Calo/ngày (100%)
                    </p>
                    <p style={{ color: '#888', fontStyle: 'italic', fontSize: '13px', marginTop: '5px' }}>
                        ※ Lượng calo để duy trì năng lượng
                    </p>
                </div>

                <div style={styles.resultGridWrapper} className="result-grid-wrapper">
                    <div style={styles.resultGrid} className="result-grid">
                        {[
                            { title: 'Để giảm cân nhẹ (0.25kg)/tuần', desc: '0.25kg/ tuần', rate: 0.8514 },
                            { title: 'Để giảm cân vừa (0.5kg)/tuần', desc: '0.5kg/ tuần', rate: 0.7028 },
                            { title: 'Để giảm cân nhanh (1kg)/tuần', desc: '1kg/ tuần', rate: 0.4055 },
                            { title: 'Để tăng cân nhẹ (0.25kg)/tuần', desc: '0.25kg/ tuần', rate: 1.1487 },
                            { title: 'Để tăng cân vừa (0.5kg)/tuần', desc: '0.5kg/ tuần', rate: 1.2973 },
                            { title: 'Để tăng cân nhanh (1kg)/tuần', desc: '1kg/ tuần', rate: 1.5946 }
                        ].map((item, idx) => (
                            <div key={idx} style={styles.resultCard} className="result-card">
                                <h4 style={styles.cardTitle} className="card-title">{item.title}</h4>
                                <p style={styles.cardDesc} className="card-desc">{item.desc}</p>
                                <p style={styles.cardValue} className="card-value">
                                    <strong>{Math.round(tdee * item.rate)}</strong> Calories/ngày ({Math.round(item.rate * 100)}%)
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalorieCalculator;