import { useState } from 'react';

const CalorieCalculator = () => {
    // 1. Quản lý trạng thái nhập liệu
    const [age, setAge] = useState(20);
    const [gender, setGender] = useState('female');
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(60);
    const [activity, setActivity] = useState(1.2);
    const [tdee, setTdee] = useState(1682);

    // 2. Hàm tính toán Calo chính xác
    const handleCalculate = () => {
        // Công thức Mifflin-St Jeor
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        if (gender === 'male') {
            bmr += 5;
        } else {
            bmr -= 161;
        }
        
        const result = Math.round(bmr * activity);
        setTdee(result);
    };

    // 3. Hàm Reset về mặc định
    const handleReset = () => {
        setAge(20);
        setGender('female');
        setHeight(170);
        setWeight(60);
        setActivity(1.2);
        setTdee(1682);
    };

    // 4. Hệ thống Styles (Đã chuyển từ CSS của bạn sang Inline)
    const styles = {
        container: { padding: '40px 20px 100px 20px', maxWidth: '1100px', margin: '0 auto', fontFamily: '"Inter", sans-serif', backgroundColor: '#fff', minHeight: '100vh' },
        title: { textAlign: 'center', fontSize: '28px', marginBottom: '40px', fontWeight: 'bold', color: '#000' },
        calculatorBox: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', padding: '0 40px 40px 40px' },
        formField: { marginBottom: '20px' },
        label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '15px', color: '#000' },
        labelSub: { fontSize: '12px', fontWeight: 'normal', marginLeft: '5px', color: '#666' },
        inputGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
        input: { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '15px', outline: 'none' },
        inputSmall: { width: '180px', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' },
        unit: { fontSize: '14px', color: '#000', width: '30px' },
        radioGroup: { display: 'flex', gap: '30px', marginTop: '5px' },
        radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' },
        btnGroup: { display: 'flex', gap: '10px', marginTop: '30px' },
        btnSubmit: { background: '#D14F9B', color: 'white', border: 'none', padding: '8px 25px', borderRadius: '2px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
        btnReset: { background: '#fff', color: '#D14F9B', border: '1px solid #D14F9B', padding: '8px 25px', borderRadius: '2px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
        selectActivity: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', color: '#B41E8E', fontSize: '14px', cursor: 'pointer' },
        activityList: { background: '#eee', padding: '20px', borderRadius: '4px', marginTop: '10px' },
        activeItem: { color: '#B41E8E', margin: '10px 0', fontSize: '14px', fontWeight: 'bold' },
        normalItem: { color: '#333', margin: '10px 0', fontSize: '14px' },
        
        resultSection: { background: '#d9d9d9', padding: '40px', marginTop: '60px' },
        mainResult: { background: '#fff', padding: '20px 30px', marginBottom: '20px', borderRadius: '2px', width: 'fit-content' },
        resultGridWrapper: { background: '#fff', padding: '40px' },
        resultGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' },
        resultCard: { textAlign: 'left' },
        cardTitle: { fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '8px', lineHeight: '1.4' },
        cardDesc: { fontSize: '14px', color: '#888', marginBottom: '5px' },
        cardValue: { fontSize: '14px', color: '#000' },
        note: { fontSize: '14px', color: '#333', marginTop: '15px' }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Lượng calo cơ thể cần trong ngày</h2>

            <div style={styles.calculatorBox}>
                {/* PANEL NHẬP LIỆU */}
                <div>
                    <div style={styles.formField}>
                        <label style={styles.label}>Tuổi</label>
                        <input type="number" style={styles.inputSmall} value={age} onChange={(e) => setAge(Number(e.target.value))} />
                    </div>

                    <div style={styles.formField}>
                        <label style={styles.label}>Giới tính</label>
                        <div style={styles.radioGroup}>
                            <label style={styles.radioLabel}>
                                <input type="radio" name="gender" checked={gender === 'female'} onChange={() => setGender('female')} style={{accentColor: '#000'}} /> Nữ
                            </label>
                            <label style={styles.radioLabel}>
                                <input type="radio" name="gender" checked={gender === 'male'} onChange={() => setGender('male')} style={{accentColor: '#000'}} /> Nam
                            </label>
                        </div>
                    </div>

                    <div style={styles.formField}>
                        <label style={styles.label}>Chiều cao <span style={styles.labelSub}>(Chiều cao)</span></label>
                        <div style={styles.inputGroup}>
                            <input type="number" style={styles.input} value={height} onChange={(e) => setHeight(Number(e.target.value))} />
                            <span style={styles.unit}>cm</span>
                        </div>
                    </div>

                    <div style={styles.formField}>
                        <label style={styles.label}>Cân nặng <span style={styles.labelSub}>(Cân nặng)</span></label>
                        <div style={styles.inputGroup}>
                            <input type="number" style={styles.input} value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
                            <span style={styles.unit}>kg</span>
                        </div>
                    </div>

                    <div style={styles.btnGroup}>
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
                    </select>
                    
                    <div style={styles.activityList}>
                        <p style={activity === 1.2 ? styles.activeItem : styles.normalItem}>Ít vận động</p>
                        <p style={activity === 1.375 ? styles.activeItem : styles.normalItem}>Vận động nhẹ: Không tập thể dục nhiều</p>
                        <p style={activity === 1.55 ? styles.activeItem : styles.normalItem}>Vận động vừa: 1~3 lần/tuần</p>
                        <p style={activity === 1.725 ? styles.activeItem : styles.normalItem}>Vận động mạnh: 4~5 lần/tuần</p>
                        <p style={styles.normalItem}>Rất mạnh: 6~7 lần/tuần hoặc hơn</p>
                    </div>
                </div>
            </div>

            {/* PHẦN KẾT QUẢ THEO BỐ CỤC ẢNH 1 */}
            <div style={styles.resultSection}>
                <div style={styles.mainResult}>
                    <h3 style={{fontSize:'16px', color:'#000', fontWeight: 'bold', margin:0}}>
                        Kết quả: {tdee} Calo/ngày (TDEE = Calorie x BMR)
                    </h3>
                    <p style={{fontSize:'12px', color: '#333', marginTop: '10px'}}>
                        Lượng calo cần thiết: <strong>{tdee}</strong> Calo/ngày (100%) ※Lượng calo để duy trì cân nặng
                    </p>
                </div>

                <div style={styles.resultGridWrapper}>
                    <div style={styles.resultGrid}>
                        {[
                            { title: 'Để giảm cân nhẹ (0.25kg)...', desc: '0.25kg/ tuần', rate: 0.85 },
                            { title: 'Để giảm cân vừa (0.5kg)...', desc: '0.5kg/ tuần', rate: 0.70 },
                            { title: 'Để giảm cân nhanh (1kg)...', desc: '1kg/ tuần', rate: 0.41 },
                            { title: 'Để tăng cân nhẹ (0.25kg)...', desc: '0.25kg/ tuần', rate: 1.15 },
                            { title: 'Để tăng cân vừa (0.5kg)...', desc: '0.5kg/ tuần', rate: 1.30 },
                            { title: 'Để tăng cân nhanh (1kg)...', desc: '1kg/ tuần', rate: 1.59 }
                        ].map((item, idx) => (
                            <div key={idx} style={styles.resultCard}>
                                <h4 style={styles.cardTitle}>{item.title}</h4>
                                <p style={styles.cardDesc}>{item.desc}</p>
                                <p style={styles.cardValue}>
                                    {Math.round(tdee * item.rate)} Calories/ngày ({Math.round(item.rate * 100)}%)
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