import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import CustomDatePicker from '../../components/common/CustomDatePicker';

const Dashboard = () => {
    const radarChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const barChartRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState('2024-08-17');
    const [selectedWeek, setSelectedWeek] = useState('Tuần 1 tháng 8/2024');
    const [selectedMonth, setSelectedMonth] = useState('Tháng 8/2024');

    // Dữ liệu mẫu giả lập theo ngày/tuần/tháng
    const getRadarData = (date) => {
        // Cố định số liệu cho ngày 2024-08-17 khớp với ảnh mẫu của người dùng
        if (date === '2024-08-17') {
            return [239, 155, 100, 120, 77, 176];
        }
        // Giả lập dữ liệu thay đổi nhẹ cho các ngày khác
        const seed = parseInt(date.replace(/-/g, '')) || 0;
        return [
            200 + (seed % 50), 
            150 + (seed % 30), 
            80 + (seed % 40), 
            110 + (seed % 20), 
            70 + (seed % 15), 
            160 + (seed % 25)
        ];
    };

    const getLineData = (week) => {
        // Giả lập dữ liệu thay đổi theo tuần
        if (week.includes('1')) return [1820, 1950, 1420, 1950, 1000, 650, 1880];
        if (week.includes('2')) return [1500, 1600, 1700, 1400, 1900, 2000, 1800];
        return [1200, 1300, 1100, 1500, 1400, 1600, 1300];
    };

    const getBarData = (month) => {
        // Cố định số liệu cho Tháng 8/2024 khớp với ảnh mẫu của người dùng
        if (month === 'Tháng 8/2024') {
            return [
                [3000, 750, 2950, 1100], // DS 1 (Xanh lá nhạt)
                [2400, 350, 1580, 2450], // DS 2 (Xanh lá đậm hơn)
                [880, 750, 1350, 1480],  // DS 3 (Xanh lục)
                [2100, 2950, 2750, 150],  // DS 4 (Tím)
                [920, 1950, 2600, 50],   // DS 5 (Hồng nhạt)
                [250, 920, 2150, 2550],  // DS 6 (Xanh ngọc)
                [620, 1480, 1550, 320],  // DS 7 (Hồng đậm)
            ];
        }
        // Các tháng khác vẫn dùng ngẫu nhiên hoặc mặc định
        return [
            [Math.random() * 3000, Math.random() * 3000, Math.random() * 3000, Math.random() * 3000],
            [Math.random() * 2500, Math.random() * 2500, Math.random() * 2500, Math.random() * 2500],
            [Math.random() * 1500, Math.random() * 1500, Math.random() * 1500, Math.random() * 1500],
            [Math.random() * 2800, Math.random() * 2800, Math.random() * 2800, Math.random() * 2800],
            [Math.random() * 2000, Math.random() * 2000, Math.random() * 2000, Math.random() * 2000],
            [Math.random() * 2200, Math.random() * 2200, Math.random() * 2200, Math.random() * 2200],
            [Math.random() * 1800, Math.random() * 1800, Math.random() * 1800, Math.random() * 1800],
        ];
    };

    useEffect(() => {
        const radarCtx = radarChartRef.current.getContext('2d');
        const lineCtx = lineChartRef.current.getContext('2d');
        const barCtx = barChartRef.current.getContext('2d');

        // 1. Radar Chart
        const radarChart = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['Thịt gà', 'Trứng gà', 'Súp lơ', 'Dưa hấu', 'Khoai tây', 'Chuối'],
                datasets: [{
                    label: 'Calo',
                    data: getRadarData(selectedDate),
                    backgroundColor: 'rgba(242, 161, 190, 0.3)', // Màu hồng Rose nhạt đúng theo ảnh
                    borderColor: '#F2A1BE', // Màu hồng Rose chuẩn
                    borderWidth: 3,
                    pointBackgroundColor: '#F2A1BE',
                    pointBorderColor: '#F2A1BE',
                    pointBorderWidth: 1,
                    pointRadius: 6, // Điểm nút to và rõ hơn
                    pointHoverRadius: 8,
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: '#f0f0f0' },
                        grid: { color: '#f0f0f0' }, // Lưới màu xám cực nhẹ
                        pointLabels: { 
                            font: { size: 13, family: 'Inter', weight: '500' },
                            color: '#333',
                            padding: 25 // Tăng khoảng cách để không đè lên con số
                        },
                        ticks: {
                            display: false,
                            stepSize: 50
                        },
                        suggestedMin: 0,
                        suggestedMax: 250
                    }
                },
                plugins: { 
                    legend: { display: false },
                    tooltip: { enabled: true }
                }
            },
            // Đăng ký plugin hiển thị text nếu cần (hoặc dùng vẽ thủ công đơn giản)
            plugins: [{
                id: 'valueLabels',
                afterDatasetsDraw(chart) {
                    const {ctx, data} = chart;
                    ctx.save();
                    ctx.font = 'bold 12px Inter';
                    ctx.fillStyle = '#333';
                    
                    const dataset = data.datasets[0];
                    dataset.data.forEach((value, index) => {
                        const {x, y} = chart.getDatasetMeta(0).data[index];
                        // Tính toán vị trí text để không đè lên điểm nút
                        const angle = chart.getDatasetMeta(0).data[index].angle;
                        const offset = 15; // Giảm offset một chút để số gần điểm hơn
                        const textX = x + Math.cos(angle) * offset;
                        const textY = y + Math.sin(angle) * offset;
                        
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(value, textX, textY);
                    });
                    ctx.restore();
                }
            }]
        });

        // 2. Line Chart
        const lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
                datasets: [{
                    label: 'Lượng calo',
                    data: getLineData(selectedWeek),
                    borderColor: '#f06292',
                    backgroundColor: 'transparent',
                    tension: 0,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#d4e157',
                    pointBorderWidth: 2,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { 
                    y: { 
                        beginAtZero: true, 
                        max: 2000,
                        ticks: {
                            stepSize: 500,
                            color: '#333'
                        },
                        grid: {
                            color: '#e0e0e0'
                        }
                    },
                    x: {
                        ticks: { color: '#333' },
                        grid: { display: false }
                    }
                },
                plugins: { 
                    legend: { display: false }
                }
            }
        });

        // 3. Bar Chart
        const barData = getBarData(selectedMonth);
        const barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
                datasets: [
                    { label: 'DS 1', data: barData[0], backgroundColor: '#76ef81' },
                    { label: 'DS 2', data: barData[1], backgroundColor: '#6db41d' },
                    { label: 'DS 3', data: barData[2], backgroundColor: '#009a73' },
                    { label: 'DS 4', data: barData[3], backgroundColor: '#801b8a' },
                    { label: 'DS 5', data: barData[4], backgroundColor: '#f6538e' },
                    { label: 'DS 6', data: barData[5], backgroundColor: '#67f1b2' },
                    { label: 'DS 7', data: barData[6], backgroundColor: '#f600b3' },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { 
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#333' }
                    },
                    y: { 
                        beginAtZero: true, 
                        max: 3000,
                        ticks: {
                            stepSize: 750,
                            color: '#333'
                        },
                        grid: {
                            color: '#e0e0e0'
                        }
                    } 
                },
                plugins: { 
                    legend: { display: false }
                }
            }
        });

        return () => {
            radarChart.destroy();
            lineChart.destroy();
            barChart.destroy();
        };
    }, [selectedDate, selectedWeek, selectedMonth]);

    return (
        <div className="dashboard-wrapper">
            {/* Nhúng trực tiếp CSS vào đây */}
            <style dangerouslySetInnerHTML={{ __html: `
                .dashboard-page { font-family: "Inter", sans-serif; background-color: #fff; padding: 20px 20px 100px 20px; max-width: 1200px; margin: 0 auto; }
                .dashboard-title { text-align: center; font-weight: bold; margin: 0 0 30px 0; font-size: 1.2rem; }
                .dashboard-grid { display: grid; grid-template-columns: 300px 1fr; gap: 40px; align-items: start; margin-bottom: 40px; }
                .chart-container { margin: 0 auto; width: 100%; max-width: 450px; }
                .chart-caption { text-align: center; font-size: 1rem; color: #555; margin-top: 15px; font-weight: 500; }
                .chart-main { display: flex; flex-direction: column; align-items: center; }
                .filter-group { margin: 30px 0 15px; }
                .filter-group label { display: block; font-weight: 600; font-size: 1rem; margin-bottom: 8px; color: #333; }
                .filter-group select { padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 5px; background-color: #fff; min-width: 250px; outline: none; color: #40E0D0; font-weight: 500; }
                .date-input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; margin-bottom: 15px; }
                .line-chart-box, .bar-chart-box { width: 100%; margin: 0 auto; max-width: 1000px; height: 400px; }
                .full-width-chart { margin-bottom: 60px; }
                
                @media (max-width: 992px) {
                    .dashboard-grid { grid-template-columns: 1fr; }
                    .dashboard-sidebar { margin-bottom: 30px; }
                    .dashboard-title { text-align: center; }
                }
                @media (max-width: 768px) {
                    .dashboard-page { padding: 15px; }
                    .dashboard-grid { gap: 20px; }
                    .filter-group label { font-size: 0.9rem; }
                    .chart-caption { font-size: 0.9rem; }
                }
            ` }} />

            <main className="dashboard-page">
                <h2 className="dashboard-title">Thống kê lượng calo đã nạp vào cơ thể</h2>

                <div className="dashboard-grid">
                    <aside className="dashboard-sidebar">
                        <div style={{ width: '250px' }}>
                            <CustomDatePicker 
                                label="Chọn ngày" 
                                value={selectedDate} 
                                onChange={(e) => setSelectedDate(e.target.value)} 
                            />
                        </div>
                    </aside>

                    <section className="chart-main">
                        <div className="chart-container">
                            <canvas ref={radarChartRef}></canvas>
                        </div>
                        <p className="chart-caption">Biểu đồ lượng calo theo từng loại thực phẩm nạp vào trong ngày</p>
                    </section>
                </div>

                <section className="full-width-chart">
                    <div className="filter-group">
                        <label>Filter theo tuần</label>
                        <select 
                            value={selectedWeek} 
                            onChange={(e) => setSelectedWeek(e.target.value)}
                        >
                            <option>Tuần 1 tháng 8/2024</option>
                            <option>Tuần 2 tháng 8/2024</option>
                            <option>Tuần 3 tháng 8/2024</option>
                        </select>
                    </div>
                    <div className="line-chart-box">
                        <canvas ref={lineChartRef}></canvas>
                    </div>
                    <p className="chart-caption">Biểu đồ thống kê lượng calo nạp vào các ngày trong tuần</p>
                </section>

                <section className="full-width-chart">
                    <div className="filter-group">
                        <label>Filter theo tháng</label>
                        <select 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option>Tháng 8/2024</option>
                            <option>Tháng 9/2024</option>
                            <option>Tháng 10/2024</option>
                        </select>
                    </div>
                    <div className="bar-chart-box">
                        <canvas ref={barChartRef}></canvas>
                    </div>
                    <p className="chart-caption">Biểu đồ thống kê lượng calo nạp vào các tuần trong tháng</p>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;