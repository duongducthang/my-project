// Nếu không có file này, người dùng của bạn sẽ cảm thấy rất khó chịu 
// vì khi bấm xem "Blog" hay "Profile", trang mới hiện ra
//  nhưng màn hình vẫn nằm lửng lơ ở giữa hoặc cuối trang.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ behavior = 'smooth' }) => { // behavior: kiểu cuộn, mặc định là mượt mà
  const { pathname } = useLocation(); //lấy đường dẫn hiện tại

  useEffect(() => {
    // cuộn lên đầu trang mỗi khi chuyển route
    window.scrollTo({ // cuộn cửa sổ
      top: 0,
      left: 0,
      behavior: behavior, // kiểu cuộn
    });
  }, [pathname, behavior]); // chạy lại effect khi đường dẫn hoặc kiểu cuộn thay đổi

  return null; // component này không render gì cả
};

export default ScrollToTop;
