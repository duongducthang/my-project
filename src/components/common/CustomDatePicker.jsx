//Trang tạo lịch đẹp hơn ở dashboard

import { useState } from 'react';

const CustomDatePicker = ({ label, value, onChange, name }) => {
  const [showCalendar, setShowCalendar] = useState(false); //bật tắt popup lịch
  const [currentView, setCurrentView] = useState(new Date(value || '2024-08-22'));//Date — tháng/năm đang hiển thị trong popup (khởi tạo từ value hoặc fallback '2024-08-22').
  
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();//trả số ngày trong tháng
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();//trả ngày đầu tiên của tháng (0-Chủ nhật, 1-Thứ 2,...)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];// tên tháng
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];// tên ngày trong tuần

  const year = currentView.getFullYear();// lấy năm từ currentView
  const month = currentView.getMonth();// lấy tháng từ currentView

  const handlePrevMonth = (e) => {// chuyển tháng trước
    e.stopPropagation();// ngăn chặn event lan truyền nếu ko nó sẽ ảnh hưởng đến cả phần tử cha
    setCurrentView(new Date(year, month - 1, 1));// cập nhật currentView về tháng trước
  };

  const handleNextMonth = (e) => {// chuyển tháng sau
    e.stopPropagation();// ngăn chặn event lan truyền
    setCurrentView(new Date(year, month + 1, 1)); //cập nhật currentView về tháng sau
  };

  const handlePrevYear = (e) => {//chuyển năm trước
    e.stopPropagation();//ngăn chặn event
    setCurrentView(new Date(year - 1, month, 1));//cập nhật currentView về năm trước
  };

  const handleNextYear = (e) => {// chuyển năm sau
    e.stopPropagation();// ngăn chặn event
    setCurrentView(new Date(year + 1, month, 1));// cập nhật currentView về năm sau
  };

  const handleDateClick = (day) => {
    // Tạo chuỗi YYYY-MM-DD dựa trên thời gian địa phương để tránh lỗi lệch múi giờ
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;// định dạng ngày được chọn
    onChange({ target: { name, value: formattedDate } });// gọi onChange để cập nhật giá trị ngày được chọn
    setShowCalendar(false);// đóng popup lịch sau khi chọn ngày
  };

  const renderDays = () => { // hàm để hiển thị các ngày trong tháng
    const totalDays = daysInMonth(year, month); // lấy tổng số ngày trong tháng hiện tại
    const firstDay = firstDayOfMonth(year, month);// lấy ngầy đầu tiên của tháng hiện tại
    const days = [];//mảng để chứa các phần tử ngày

    // Previous month days (disabled)
    const prevMonthDays = daysInMonth(year, month - 1);//lấy số ngày của tháng trước
    for (let i = firstDay - 1; i >= 0; i--) {// thêm các ngày của tháng trước vào đầu lịch nếu tháng ko bắt đầu từ Chủ nhật
      days.push(<span key={`prev-${i}`} style={styles.dayDisabled}>{prevMonthDays - i}</span>);// thêm ngày đã tắt vào mảng days
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {// thêm các ngày của tháng hiện tại
      const isSelected = value === `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;// kiểm tra xem ngày hiện tại có phải là ngày được chọn hay ko 
      days.push(// thêm ngày được chọn vào mảng days
        <span 
          key={d}// khóa duy nhất cho mỗi ngày 
          style={isSelected ? styles.dayActive : styles.day}// kiểu dáng ngày (nếu được chọn thì dùng kiểu dayActive, ko thì dùng kiểu day)
          onClick={(e) => {// xử lý sự kiện khi người dùng click vào ngày
            e.stopPropagation();// ngăn chặn event lan truyền
            handleDateClick(d);// gọi hàm xử lý khi ngày được click
          }}
        >
          {d}   {/*  hiển thị số ngày */}
        </span>
      );
    }

    return days;// trả về mảng các phần tử ngày đã tạo
  };

  return (
    <div style={styles.container}> {/*  container chính của DatePicker */}
      <div style={styles.inputWrapper} onClick={() => setShowCalendar(!showCalendar)}> {/*  phần tử input hiển thị ngày đã chọn và biểu tượng lịch */}
        <label style={styles.label}>{label}</label> {/*  nhãn cho DatePicker */}
        <div style={styles.fieldContainer}> {/*  chứa input và biểu tượng lịch */}
          <input
            type="text"  
            readOnly //chỉ đọc, ko cho phép người dùng nhập trực tiếp
            name={name} // tên trường input
            value={value || '2024-08-22'} // giá trị hiển thị trong input (nếu ko có giá trị thì hiển thị '2024-08-22')
            style={styles.input} // kiểu dáng cho input
          />
          <div style={styles.iconWrapper}> {/*  biểu tượng lịch */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> {/*  biểu tượng SVG của lịch */}
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#333" strokeWidth="2"/> {/*  hình chữ nhật biểu tượng lịch */}
              <path d="M16 2V6M8 2V6M3 10H21" stroke="#333" strokeWidth="2" strokeLinecap="round"/> {/*  các chi tiết khác của biểu tượng lịch */}
              <circle cx="12" cy="16" r="2" fill="#333"/> {/*  hình tròn biểu tượng lịch */}
            </svg>
          </div>
        </div>
      </div>
      <div style={styles.formatText}>MM/DD/YYYY</div> {/*  định dạng ngày hiển thị dưới input */}

      {showCalendar && ( // hiển thị  lịch bật lên nếu showCalendar là true
        <div style={styles.calendarPopup}> {/*  popup-bật lên- lịch */}
          <div style={styles.calendarHeader}>   {/*  header của lịch với điều khiển chuyển tháng và năm */}

            <div style={styles.headerItem}>     {/*  điều khiển tháng */} 
              <span style={{cursor:'pointer'}} onClick={handlePrevMonth}>&lt;</span>  {/*  nút chuyển tháng trước */}
              <span>{monthNames[month]}</span>  {/*  hiển thị tháng hiện tại */}
              <span style={{cursor:'pointer'}} onClick={handleNextMonth}>&gt;</span> {/*  nút chuyển tháng sau */}
            </div>

            <div style={styles.headerItem}>    {/*  điều khiển năm */}
              <span style={{cursor:'pointer'}} onClick={handlePrevYear}>&lt;</span>  {/*  nút chuyển năm trước */}
              <span>{year}</span>
              <span style={{cursor:'pointer'}} onClick={handleNextYear}>&gt;</span> {/*  nút chuyển năm sau */}
            </div>

          </div>
          
          <div style={styles.weekDaysGrid}> {/*  hiển thị các ngày trong tuần */}
            {weekDays.map(day => <span key={day} style={styles.weekDay}>{day}</span>)} {/*  lặp qua mảng weekDays để tạo phần tử cho mỗi ngày */}
          </div>

          <div style={styles.daysGrid}> {/*  hiển thị các ngày trong tháng */}
            {renderDays()} {/*  gọi hàm renderDays để tạo các phần tử ngày */}
          </div>

          <div style={styles.calendarFooter}> {/*  footer của lịch với các nút hành động */}
            <button style={styles.footerBtn} onClick={(e) => {  // nút clear
              e.stopPropagation(); // ngăn chặn event lan truyền
              onChange({ target: { name, value: '' } });// gọi onChange để xóa giá trị ngày đã chọn
              setShowCalendar(false); // đóng popup lịch
            }}>
              Clear
            </button> 

            <div style={styles.footerRight}> {/* nhóm nút bên phải */}
              <button style={styles.footerBtn} onClick={(e) => { // nút cancel
                e.stopPropagation(); // ngăn chặn event lan truyền
                setShowCalendar(false); // đóng popup lịch
              }}>
                Cancel
              </button>

              <button style={styles.footerBtnActive} onClick={(e) => { // nút OK
                e.stopPropagation(); 
                setShowCalendar(false); 
              }}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = { // kiểu dáng cho các phần tử trong DatePicker
      container: { // container chính
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        width: '100%',
        position: 'relative',
        fontFamily: 'sans-serif',
      },
      inputWrapper: { // phần tử input
        position: 'relative',
        border: '2px solid #7c69a3',
        borderRadius: '8px',
        padding: '10px 12px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      },
      label: { // nhãn
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
      fieldContainer: { // chứa input và biểu tượng lịch
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      },
      input: { // kiểu dáng cho input
        border: 'none',
        outline: 'none',
        fontSize: '16px',
        color: '#333',
        width: '100%',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      },
      iconWrapper: { // biểu tượng lịch
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        borderRadius: '4px',
        backgroundColor: '#eee',
        marginLeft: '8px',
      },
      formatText: { // định dạng ngày hiển thị dưới input
        fontSize: '11px',
        color: '#666',
        marginLeft: '12px',
      },
      calendarPopup: { // popup-bật lên- lịch
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
      calendarHeader: { // header của lịch với điều khiển chuyển tháng và năm
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
        color: '#333',
        fontSize: '14px',
        fontWeight: '500',
      },
      headerItem: { // điều khiển tháng/năm
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
      },
      weekDaysGrid: { // hiển thị các ngày trong tuần
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        textAlign: 'center',
        marginBottom: '10px',
      },
      weekDay: { // kiểu dáng cho ngày trong tuần
        fontSize: '12px',
        color: '#666',
        fontWeight: '500',
      },
      daysGrid: { // hiển thị các ngày trong tháng
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        textAlign: 'center',
        rowGap: '8px',
      },
      day: { // kiểu dáng cho ngày
        fontSize: '13px',
        color: '#333',
        padding: '8px 0',
        cursor: 'pointer',
        borderRadius: '50%',
        transition: '0.2s',
      },
      dayDisabled: { // kiểu dáng cho ngày đã tắt
        fontSize: '13px',
        color: '#aaa',
        padding: '8px 0',
      },
      dayActive: { // kiểu dáng cho ngày được chọn 
        fontSize: '13px',
        color: '#fff',
        backgroundColor: '#4a4a4a',
        padding: '8px 0',
        borderRadius: '50%',
        cursor: 'pointer',
      },
      calendarFooter: { // footer của lịch với các nút hành động 
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
        paddingTop: '10px',
      },
      footerRight: { // nhóm nút bên phải 
        display: 'flex',
        gap: '15px',
      },
      footerBtn: {  // kiểu dáng cho nút Clear và Cancel
        background: 'none',
        border: 'none',
        color: '#7c69a3',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
      },
      footerBtnActive: { // kiểu dáng cho nút OK
        background: 'none',
        border: 'none',
        color: '#7c69a3',
        fontSize: '13px',
        fontWeight: 'bold',
        cursor: 'pointer',
      },
    };

export default CustomDatePicker;
