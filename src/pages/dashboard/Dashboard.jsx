/* eslint-disable react-hooks/exhaustive-deps */
//Trang DashBoard

import { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import CustomDatePicker from '../../components/common/CustomDatePicker';

const Dashboard = () => {
    // KHỞI TẠO REFS VÀ STATE
    const radarChartRef = useRef(null); 
    const lineChartRef = useRef(null); 
    const barChartRef = useRef(null);   
    
    const [dailyLogs, setDailyLogs] = useState([]);
    const lastLogsRef = useRef(""); 
    
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const parseKcal = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
    };

    const [selectedDate, setSelectedDate] = useState(formatDate(new Date())); 
    
    const now = new Date();
    const currentMonthYear = `Tháng ${now.getMonth() + 1}/${now.getFullYear()}`;
    const [selectedWeek, setSelectedWeek] = useState(`Tuần 1 tháng ${now.getMonth() + 1}/${now.getFullYear()}`);
    const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);
    
    useEffect(() => {
        const loadLogs = () => {
            try {
                const saved = localStorage.getItem('calorie_logs');
                
                if (saved !== lastLogsRef.current) {
                    lastLogsRef.current = saved;
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        if (Array.isArray(parsed)) {
                            setDailyLogs(parsed);
                        }
                    } else {
                        setDailyLogs([]);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu từ localStorage:", error);
            }
        };

        loadLogs();

        const handleStorageChange = (e) => {
            if (e.key === 'calorie_logs') {
                loadLogs();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        const interval = setInterval(loadLogs, 2000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const weekOptions = useMemo(() => {
        const options = [];
        const now = new Date();
        
        let startDate = new Date();
        if (dailyLogs.length > 0) {
            const allDates = dailyLogs.map(log => new Date(log.date));
            startDate = new Date(Math.min(...allDates));
        }
        
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(now.getDate() - 28);
        if (startDate > fourWeeksAgo) startDate = fourWeeksAgo;

        let current = new Date(now);
        while (current >= startDate) {
            const month = current.getMonth() + 1;
            const year = current.getFullYear();
            
            const firstDayOfMonth = new Date(year, month - 1, 1);
            const weekNum = Math.ceil((current.getDate() + firstDayOfMonth.getDay()) / 7);
            options.push(`Tuần ${weekNum} tháng ${month}/${year}`);
            
            current.setDate(current.getDate() - 7);
        }
        
        return [...new Set(options)]; 
    }, [dailyLogs]);

    const monthOptions = useMemo(() => {
        const options = [];
        const now = new Date();
        
        let startDate = new Date();
        if (dailyLogs.length > 0) {
            const allDates = dailyLogs.map(log => new Date(log.date));
            startDate = new Date(Math.min(...allDates));
        }

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        if (startDate > sixMonthsAgo) startDate = sixMonthsAgo;

        let current = new Date(now);
        while (current >= startDate || (current.getMonth() === startDate.getMonth() && current.getFullYear() === startDate.getFullYear())) {
            options.push(`Tháng ${current.getMonth() + 1}/${current.getFullYear()}`);
            current.setMonth(current.getMonth() - 1);
            
            if (options.length > 100) break; 
        }
        return options;
    }, [dailyLogs]);

    useEffect(() => {
        if (weekOptions.length > 0 && (!selectedWeek || !weekOptions.includes(selectedWeek))) {
            setSelectedWeek(weekOptions[0]);
        }
        if (monthOptions.length > 0 && (!selectedMonth || !monthOptions.includes(selectedMonth))) {
            setSelectedMonth(monthOptions[0]);
        }
    }, [weekOptions, monthOptions, selectedWeek, selectedMonth]);

    const getRadarData = (date) => {
        const dayLogs = dailyLogs.filter(log => log.date === date);
    
        const foodTotals = dayLogs.reduce((acc, curr) => {
            const name = curr.food;
            acc[name] = (acc[name] || 0) + parseKcal(curr.kcal);
            return acc; 
        }, {});

        const labels = Object.keys(foodTotals);
        const data = Object.values(foodTotals);

        if (labels.length === 0) {
            return {
                labels: ['Chưa có dữ liệu'],
                data: [0]
            };
        }

        return { labels, data };
    };

    const getWeekRange = (weekStr) => {
        const match = weekStr.match(/Tuần (\d+) tháng (\d+)\/(\d+)/);
        if (!match) return null;
        const weekNum = parseInt(match[1]);
        const month = parseInt(match[2]);
        const year = parseInt(match[3]);
        
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const firstDayWeekday = firstDayOfMonth.getDay(); // 0: CN, 1: T2...
        const diffToMonday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
        
        const startDay = 1 - diffToMonday + (weekNum - 1) * 7;
        
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(year, month - 1, startDay + i);
            dates.push(formatDate(d));
        }
        return dates;
    };

   
    const getMonthWeeks = (monthStr) => {
        const match = monthStr.match(/Tháng (\d+)\/(\d+)/);
        if (!match) return [];
        const month = parseInt(match[1]);
        const year = parseInt(match[2]);
        
        const weeks = [];
        const lastDay = new Date(year, month, 0);
        
        let currentDay = 1;
        while (currentDay <= lastDay.getDate()) {
            const weekDates = [];
            for (let i = 0; i < 7 && currentDay <= lastDay.getDate(); i++) {
                weekDates.push(formatDate(new Date(year, month - 1, currentDay)));
                currentDay++;
            }
            weeks.push(weekDates);
        }
        return weeks;
    };

    const getLineData = (week) => {
        const weekDates = getWeekRange(week);
        if (!weekDates) return [0, 0, 0, 0, 0, 0, 0];
        
        return weekDates.map(date => {
            const dayLogs = dailyLogs.filter(log => log.date === date);
            return dayLogs.reduce((acc, curr) => acc + parseKcal(curr.kcal), 0);
        });
    };

    const getBarData = (month) => {
        const weeks = getMonthWeeks(month);
        const foodLabels = [...new Set(dailyLogs.map(log => log.food))];
        
        if (foodLabels.length === 0 || weeks.length === 0) return { labels: [], datasets: [] };
        
        const datasets = foodLabels.map((label, index) => {
            const colors = ['#76ef81', '#6db41d', '#009a73', '#801b8a', '#f6538e', '#67f1b2', '#f600b3', '#40E0D0', '#FFA500', '#FF4500'];
            
            const data = weeks.map(weekDates => {
                return dailyLogs
                    .filter(log => weekDates.includes(log.date) && log.food === label)
                    .reduce((acc, curr) => acc + parseKcal(curr.kcal), 0);
            });

            return {
                label: label,
                data: data,
                backgroundColor: colors[index % colors.length]
            };
        });

        const weekLabels = weeks.map((_, i) => `Tuần ${i + 1}`);
        return { labels: weekLabels, datasets };
    };

    
    useEffect(() => {
        if (!radarChartRef.current) return;
        const radarCtx = radarChartRef.current.getContext('2d');
        const { labels: dynamicRadarLabels, data: dynamicRadarData } = getRadarData(selectedDate);
        
        const radarChart = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: dynamicRadarLabels,
                datasets: [{
                    label: 'Calo',
                    data: dynamicRadarData,
                    backgroundColor: 'rgba(242, 161, 190, 0.3)', 
                    borderColor: '#F2A1BE', 
                    borderWidth: 3,
                    pointBackgroundColor: '#F2A1BE',
                    pointBorderColor: '#F2A1BE',
                    pointBorderWidth: 1,
                    pointRadius: 6, 
                    pointHoverRadius: 8,
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: '#f0f0f0' }, 
                        grid: { color: '#f0f0f0' },      
                        pointLabels: {
                            font: { size: 13, family: 'Inter', weight: '500' },
                            color: '#333',
                            padding: 25                  
                        },
                        ticks: {
                            display: false,              
                            stepSize: 50
                        },
                        suggestedMin: 0,
                        suggestedMax: Math.max(300, ...dynamicRadarData)
                    }
                },
                plugins: {
                    legend: { display: false },          
                    tooltip: { enabled: true }           
                }
            },
            plugins: [{
                id: 'hienThiSoCalo', 
                afterDatasetsDraw(chart) {
                    const canvas = chart.ctx;
                    canvas.save();
                    canvas.font = 'bold 12px Inter';
                    canvas.fillStyle = '#333';
                    canvas.textAlign = 'center';
                    canvas.textBaseline = 'middle';
                    
                    const cacDiem = chart.getDatasetMeta(0).data;
                    const giaTriDuLieu = chart.data.datasets[0].data;

                    giaTriDuLieu.forEach((giaTri, i) => {
                        const diem = cacDiem[i];
                        if (!diem) return;
                        
                        const x = diem.x;
                        const y = diem.y;
                        const centerX = chart.scales.r.xCenter;
                        const centerY = chart.scales.r.yCenter;
                        
                        const dx = x - centerX;
                        const dy = y - centerY;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        const doLech = 15;
                        const viTriX = distance < 5 ? x : x + (dx / distance) * doLech;
                        const viTriY = distance < 5 ? y - 10 : y + (dy / distance) * doLech;
                        
                        canvas.fillText(Math.round(giaTri), viTriX, viTriY);
                    });
                    canvas.restore();
                }
            }]
        });

        return () => radarChart.destroy();
    }, [selectedDate, dailyLogs]);

    
    useEffect(() => {
        if (!lineChartRef.current) return;
        const lineCtx = lineChartRef.current.getContext('2d');
        const lineData = getLineData(selectedWeek);
        
        const lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
                datasets: [{
                    label: 'Lượng calo',
                    data: lineData,
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
                        max: Math.max(2000, Math.ceil(Math.max(...lineData) / 500) * 500 + 500),
                        ticks: { stepSize: 500, color: '#333' },
                        grid: { color: '#e0e0e0' }
                    },
                    x: {
                        ticks: { color: '#333' },
                        grid: { display: false }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });

        return () => lineChart.destroy();
    }, [selectedWeek, dailyLogs]);


    useEffect(() => {
        if (!barChartRef.current) return;
        const barCtx = barChartRef.current.getContext('2d');
        const { labels: barLabels, datasets: barDatasets } = getBarData(selectedMonth);
        
        let maxBarVal = 0;
        if (barDatasets.length > 0) {
            barDatasets.forEach(ds => {
                if (ds.data && ds.data.length > 0) {
                    const localMax = Math.max(...ds.data);
                    if (localMax > maxBarVal) maxBarVal = localMax;
                }
            });
        }
        
        const barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: barLabels,
                datasets: barDatasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#333' } },
                    y: {
                        beginAtZero: true,
                        max: Math.max(3000, Math.ceil(maxBarVal / 750) * 750 + 750),
                        ticks: { stepSize: 750, color: '#333' },
                        grid: { color: '#e0e0e0' }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });

        return () => barChart.destroy();
    }, [selectedMonth, dailyLogs]);
 
    return (
        <div className="dashboard-wrapper">
            <style dangerouslySetInnerHTML={{ __html: `
                .dashboard-page { font-family: "Inter", sans-serif; background-color: #fff; padding: 20px 20px 100px 20px; max-width: 1200px; margin: 0 auto; }
                .dashboard-title { text-align: center; font-weight: bold; margin: 0 0 30px 0; font-size: 1.2rem; }
                .dashboard-grid { display: grid; grid-template-columns: 300px 1fr; gap: 40px; align-items: start; margin-bottom: 40px; }
                .chart-container { margin: 0 auto; width: 100%; max-width: 450px; height: 400px; display: flex; align-items: center; justify-content: center; }
                .chart-caption { text-align: center; font-size: 1rem; color: #555; margin-top: 15px; font-weight: 500; }
                .chart-main { display: flex; flex-direction: column; align-items: center; }
                .filter-group { margin: 30px 0 15px; }
                .filter-group label { display: block; font-weight: 600; font-size: 1rem; margin-bottom: 8px; color: #333; }
                .filter-group select { 
                    padding: 8px 12px; 
                    border: 1px solid #d9d9d9; 
                    border-radius: 5px; 
                    background-color: #fff; 
                    min-width: 250px; 
                    width: 100%;
                    max-width: 100%;
                    outline: none; 
                    color: #40E0D0; 
                    font-weight: 500; 
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    appearance: auto;
                }
                .date-input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; margin-bottom: 15px; }
                .line-chart-box, .bar-chart-box { width: 100%; margin: 0 auto; max-width: 1000px; height: 400px; }
                .full-width-chart { margin-bottom: 60px; }
                
                @media (max-width: 992px) {
                    .dashboard-grid { grid-template-columns: 1fr; gap: 30px; }
                    .dashboard-sidebar { width: 100% !important; margin-bottom: 20px; }
                    .dashboard-sidebar > div { width: 100% !important; }
                    .dashboard-title { text-align: center; font-size: 1.1rem; }
                    .chart-container { height: 350px; }
                }
                @media (max-width: 768px) {
                    .dashboard-page { padding: 15px 15px 80px 15px; }
                    .dashboard-grid { gap: 20px; }
                    .filter-group label { font-size: 0.9rem; }
                    .filter-group select { min-width: 100%; }
                }
                @media (max-width: 480px) {
                    .dashboard-title { font-size: 1rem; }
                    .chart-container { height: 280px; }
                    .line-chart-box, .bar-chart-box { height: 250px; }
                    .chart-caption { font-size: 0.85rem; padding: 0 10px; }
                    .filter-group select { font-size: 0.85rem; padding: 6px 10px; }
                    .full-width-chart { margin-bottom: 40px; }
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
                            {weekOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
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
                            {monthOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
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