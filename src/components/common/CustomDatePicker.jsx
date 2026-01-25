import { useState } from 'react';

const CustomDatePicker = ({ label, value, onChange, name }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentView, setCurrentView] = useState(new Date(value || '2024-08-22'));
  
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const year = currentView.getFullYear();
  const month = currentView.getMonth();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentView(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentView(new Date(year, month + 1, 1));
  };

  const handlePrevYear = (e) => {
    e.stopPropagation();
    setCurrentView(new Date(year - 1, month, 1));
  };

  const handleNextYear = (e) => {
    e.stopPropagation();
    setCurrentView(new Date(year + 1, month, 1));
  };

  const handleDateClick = (day) => {
    // Tạo chuỗi YYYY-MM-DD dựa trên thời gian địa phương để tránh lỗi lệch múi giờ
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange({ target: { name, value: formattedDate } });
    setShowCalendar(false);
  };

  const renderDays = () => {
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const days = [];

    // Previous month days (disabled)
    const prevMonthDays = daysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(<span key={`prev-${i}`} style={styles.dayDisabled}>{prevMonthDays - i}</span>);
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const isSelected = value === `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push(
        <span 
          key={d} 
          style={isSelected ? styles.dayActive : styles.day}
          onClick={(e) => {
            e.stopPropagation();
            handleDateClick(d);
          }}
        >
          {d}
        </span>
      );
    }

    return days;
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputWrapper} onClick={() => setShowCalendar(!showCalendar)}>
        <label style={styles.label}>{label}</label>
        <div style={styles.fieldContainer}>
          <input
            type="text"
            readOnly
            name={name}
            value={value || '2024-08-22'}
            style={styles.input}
          />
          <div style={styles.iconWrapper}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#333" strokeWidth="2"/>
              <path d="M16 2V6M8 2V6M3 10H21" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="2" fill="#333"/>
            </svg>
          </div>
        </div>
      </div>
      <div style={styles.formatText}>YYYY-MM-DD</div>

      {showCalendar && (
        <div style={styles.calendarPopup}>
          <div style={styles.calendarHeader}>
            <div style={styles.headerItem}>
              <span style={{cursor:'pointer'}} onClick={handlePrevMonth}>&lt;</span>
              <span>{monthNames[month]}</span>
              <span style={{cursor:'pointer'}} onClick={handleNextMonth}>&gt;</span>
            </div>
            <div style={styles.headerItem}>
              <span style={{cursor:'pointer'}} onClick={handlePrevYear}>&lt;</span>
              <span>{year}</span>
              <span style={{cursor:'pointer'}} onClick={handleNextYear}>&gt;</span>
            </div>
          </div>
          
          <div style={styles.weekDaysGrid}>
            {weekDays.map(day => <span key={day} style={styles.weekDay}>{day}</span>)}
          </div>

          <div style={styles.daysGrid}>
            {renderDays()}
          </div>

          <div style={styles.calendarFooter}>
            <button style={styles.footerBtn} onClick={(e) => {
              e.stopPropagation();
              onChange({ target: { name, value: '' } });
              setShowCalendar(false);
            }}>Clear</button>
            <div style={styles.footerRight}>
              <button style={styles.footerBtn} onClick={(e) => {
                e.stopPropagation();
                setShowCalendar(false);
              }}>Cancel</button>
              <button style={styles.footerBtnActive} onClick={(e) => {
                e.stopPropagation();
                setShowCalendar(false);
              }}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    width: '100%',
    position: 'relative',
    fontFamily: 'sans-serif',
  },
  inputWrapper: {
    position: 'relative',
    border: '2px solid #7c69a3',
    borderRadius: '8px',
    padding: '10px 12px',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  label: {
    position: 'absolute',
    top: '-10px',
    left: '12px',
    backgroundColor: '#fff',
    padding: '0 4px',
    fontSize: '12px',
    color: '#7c69a3',
    fontWeight: '500',
    zIndex: 1,
  },
  fieldContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    color: '#333',
    width: '100%',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '4px',
    backgroundColor: '#eee',
    marginLeft: '8px',
  },
  formatText: {
    fontSize: '11px',
    color: '#666',
    marginLeft: '12px',
  },
  calendarPopup: {
    position: 'absolute',
    top: '100%',
    left: '0',
    marginTop: '10px',
    width: '280px',
    backgroundColor: '#f3eef9',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    padding: '15px',
    zIndex: 1000,
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    color: '#333',
    fontSize: '14px',
    fontWeight: '500',
  },
  headerItem: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  weekDaysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center',
    marginBottom: '10px',
  },
  weekDay: {
    fontSize: '12px',
    color: '#666',
    fontWeight: '500',
  },
  daysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center',
    rowGap: '8px',
  },
  day: {
    fontSize: '13px',
    color: '#333',
    padding: '8px 0',
    cursor: 'pointer',
    borderRadius: '50%',
    transition: '0.2s',
  },
  dayDisabled: {
    fontSize: '13px',
    color: '#aaa',
    padding: '8px 0',
  },
  dayActive: {
    fontSize: '13px',
    color: '#fff',
    backgroundColor: '#4a4a4a',
    padding: '8px 0',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  calendarFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    paddingTop: '10px',
  },
  footerRight: {
    display: 'flex',
    gap: '15px',
  },
  footerBtn: {
    background: 'none',
    border: 'none',
    color: '#7c69a3',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  footerBtnActive: {
    background: 'none',
    border: 'none',
    color: '#7c69a3',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default CustomDatePicker;
