/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import CustomDatePicker from '../../components/common/CustomDatePicker';
import axiosClient from '../../services/axiosClient';

const Dashboard = () => {
    const radarChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const barChartRef = useRef(null);

    const [dailyLogs, setDailyLogs] = useState([]);

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const toDateKey = (value) => value ? formatDate(new Date(value)) : '';

    const getFoodName = (log) => log.food || log.foodName || 'Unknown';

    const getKcal = (log) => {
        const val = log.kcal ?? log.calories ?? 0;
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
    };

    const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
    const now = new Date();
    const [selectedWeek, setSelectedWeek] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(`Tháng ${now.getMonth() + 1}/${now.getFullYear()}`);

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const res = await axiosClient.get('/calories/logs?limit=500');
                const logs = res?.logs || res?.data?.logs || [];
                setDailyLogs(logs);
            } catch (err) {
                console.error("API error:", err);
            }
        };

        loadLogs();
        window.addEventListener('calorieLogsUpdated', loadLogs);
        return () => window.removeEventListener('calorieLogsUpdated', loadLogs);
    }, []);

    const weekOptions = useMemo(() => {
        const options = [];
        let current = new Date();

        for (let i = 0; i < 8; i++) {
            const month = current.getMonth() + 1;
            const year = current.getFullYear();
            const week = Math.ceil(current.getDate() / 7);
            options.push(`Tuần ${week} tháng ${month}/${year}`);
            current.setDate(current.getDate() - 7);
        }

        return [...new Set(options)];
    }, [dailyLogs]);

    const monthOptions = useMemo(() => {
        const options = [];
        let current = new Date();

        for (let i = 0; i < 6; i++) {
            options.push(`Tháng ${current.getMonth() + 1}/${current.getFullYear()}`);
            current.setMonth(current.getMonth() - 1);
        }

        return options;
    }, []);

    useEffect(() => {
        if (weekOptions.length > 0 && !selectedWeek) {
            setSelectedWeek(weekOptions[0]);
        }
    }, [weekOptions]);

    const getRadarData = (date) => {
        const dayLogs = dailyLogs.filter(log => toDateKey(log.date) === date);

        const foodTotals = dayLogs.reduce((acc, curr) => {
            const name = getFoodName(curr);
            acc[name] = (acc[name] || 0) + getKcal(curr);
            return acc;
        }, {});

        return {
            labels: Object.keys(foodTotals),
            data: Object.values(foodTotals)
        };
    };

    const getLineData = () => {
        const today = new Date();
        const dates = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            dates.push(formatDate(d));
        }

        return dates.map(date => {
            const logs = dailyLogs.filter(log => toDateKey(log.date) === date);
            return logs.reduce((sum, log) => sum + getKcal(log), 0);
        });
    };

    const getBarData = (monthStr) => {
        const match = monthStr.match(/Tháng (\d+)\/(\d+)/);
        if (!match) return { labels: [], datasets: [] };

        const month = parseInt(match[1]);
        const year = parseInt(match[2]);

        const daysInMonth = new Date(year, month, 0).getDate();

        const weeks = [];
        let currentWeek = [];

        for (let d = 1; d <= daysInMonth; d++) {
            const date = formatDate(new Date(year, month - 1, d));
            currentWeek.push(date);

            if (currentWeek.length === 7 || d === daysInMonth) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }

        const foodLabels = [...new Set(dailyLogs.map(getFoodName))];

        const colors = [
            '#76ef81', '#6db41d', '#009a73',
            '#801b8a', '#f6538e', '#67f1b2',
            '#f600b3', '#40E0D0', '#FFA500'
        ];

        const datasets = foodLabels.map((food, index) => {
            const data = weeks.map((weekDates) => {
                return dailyLogs
                    .filter(log =>
                        weekDates.includes(toDateKey(log.date)) &&
                        getFoodName(log) === food
                    )
                    .reduce((sum, log) => sum + getKcal(log), 0);
            });

            return {
                label: food,
                data,
                backgroundColor: colors[index % colors.length]
            };
        });

        return {
            labels: weeks.map((_, i) => `Tuần ${i + 1}`),
            datasets
        };
    };

    // Radar chart
    useEffect(() => {
        if (!radarChartRef.current) return;

        const { labels, data } = getRadarData(selectedDate);

        const chart = new Chart(radarChartRef.current, {
            type: 'radar',
            data: {
                labels: labels.length ? labels : ['Chưa có dữ liệu'],
                datasets: [{
                    label: 'Calo',
                    data: data.length ? data : [0],
                    backgroundColor: 'rgba(242,161,190,0.25)',
                    borderColor: '#F06292',
                    borderWidth: 2,
                    pointBackgroundColor: '#F06292',
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });

        return () => chart.destroy();
    }, [selectedDate, dailyLogs]);

    // Line
    useEffect(() => {
        if (!lineChartRef.current) return;

        const chart = new Chart(lineChartRef.current, {
            type: 'line',
            data: {
                labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
                datasets: [{
                    data: getLineData(),
                    borderColor: '#f06292',
                    tension: 0.3
                }]
            },
            options: { 
                plugins: { legend: { display: false }}
            }
        });

        return () => chart.destroy();
    }, [dailyLogs]);

    // Bar
    useEffect(() => {
        if (!barChartRef.current) return;

        const { labels, datasets } = getBarData(selectedMonth);

        const chart = new Chart(barChartRef.current, {
            type: 'bar',
            data: { labels, datasets },
            options: {
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });

        return () => chart.destroy();
    }, [selectedMonth, dailyLogs]);

    return (
        <div style={{ padding: 20 }}>
            <h2 style={{ textAlign: 'center', fontWeight: 600 }}>
                Thống kê lượng calo đã nạp vào cơ thể
            </h2>

          
            <div style={{
                display: 'grid',
                gridTemplateColumns: '260px 1fr',
                gap: 80,
            }}>

                
                <div>
                    <CustomDatePicker
                        label="Chọn ngày"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

              
                <div style={{ height: 420 }}>
                    <canvas ref={radarChartRef} />
                    <p style={{ textAlign: 'center', marginTop: 10 }}>
                        Biểu đồ lượng calo theo từng loại thực phẩm nạp vào trong ngày
                    </p>
                </div>
            </div>

           
            <div style={{ marginTop: 40 }}>
                <p style={{ fontWeight: 600, marginBottom: 6 }}>
                    Filter theo tuần
                </p>

                <select
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                    style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid #ccc',
                        fontWeight: 500
                    }}
                >
                    {weekOptions.map(w => <option key={w}>{w}</option>)}
                </select>

                <canvas ref={lineChartRef} />
                <p style={{ textAlign: 'center', marginTop: 10 }}>
                        Biểu đồ lượng calo theo từng loại thực phẩm nạp vào các ngày trong tuần
                    </p>
            </div>

         
            <div style={{ marginTop: 40 }}>
                <p style={{ fontWeight: 600, marginBottom: 6 }}>
                    Filter theo tháng
                </p>

                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid #ccc',
                        fontWeight: 500
                    }}
                >
                    {monthOptions.map(m => <option key={m}>{m}</option>)}
                </select>

                <canvas ref={barChartRef} />
                <p style={{ textAlign: 'center', marginTop: 10 }}>
                        Biểu đồ lượng calo theo từng loại thực phẩm nạp vào các tuần trong tháng
                    </p>
            </div>
        </div>
    );
};

export default Dashboard;