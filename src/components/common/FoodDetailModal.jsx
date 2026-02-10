//Trang tạo nội dung bên trong của từng thẻ Food

import XImg from '../../assets/img/X.svg';

const FoodDetailModal = ({ food, onClose }) => { 
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"> 
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-sm shadow-xl overflow-y-auto animate-in fade-in zoom-in-95 duration-300 relative custom-scrollbar">
        
        {/* Header của Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10"> 
          <span className="text-gray-600 text-[1rem] font-medium ml-2">Chi tiết</span> 
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors mr-2 text-3xl font-light leading-none"  
            aria-label="Close" 
          >
            &times;
          </button>
        </div>

        <div className="px-5 sm:px-12 py-6 sm:py-10 pb-20"> { /* Tăng padding bottom để tạo khoảng trống cuối như ảnh */ }
          {/* Phần nội dung: Ảnh trái, Text phải */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-14 mb-10"> 
            <div className="w-full sm:w-[35%] flex-shrink-0"> 
              <img 
                src={food.img} 
                className="w-full aspect-[1.35/1] object-cover rounded-none shadow-sm" 
                alt={food.title}  
              />
            </div>
            <div className="flex-1"> 
              <h2 className="text-[1.5rem] sm:text-[1.8rem] font-bold text-black mb-4 leading-tight">{food.title}</h2> 
              <p className="text-gray-600 text-[0.95rem] sm:text-[1rem] leading-[1.6] text-left font-light"> 
                {food.fullDesc || food.desc}
              </p>
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <div className="mt-8 overflow-x-auto"> 
            <table className="min-w-full border-collapse"> 
              <thead>
                <tr className="bg-[#f8f8f8] border-b-[1.5px] border-gray-400"> {/* Header có nền xám và border dưới đậm hơn */}
                  <th className="px-4 sm:px-6 py-4 text-left text-[0.9rem] sm:text-[1rem] font-medium text-gray-700 w-[45%] relative after:content-[''] after:absolute after:right-0 after:top-[25%] after:h-[50%] after:w-[1px] after:bg-gray-400">
                    Food
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-[0.9rem] sm:text-[1rem] font-medium text-gray-700 w-[30%] relative after:content-[''] after:absolute after:right-0 after:top-[25%] after:h-[50%] after:w-[1px] after:bg-gray-400">
                    Serving
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-[0.9rem] sm:text-[1rem] font-medium text-gray-700 w-[25%]">
                    Calories
                  </th>
                </tr>
              </thead>
              <tbody className="border-b-[1.5px] border-gray-400"> {/* Đường kẻ cuối bảng đậm */}
                {food.details && food.details.length > 0 ? (  /* kiểm tra xem có dữ liệu chi tiết ko */
                  food.details.map((item, index) => (
                    <tr key={index} className="border-b border-gray-300 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 text-[0.9rem] sm:text-[1rem] text-gray-800 font-normal">{item.name}</td> 
                      <td className="px-4 sm:px-6 py-4 text-[0.9rem] sm:text-[1rem] text-gray-600 text-left font-light">{item.serving}</td>   
                      <td className="px-4 sm:px-6 py-4 text-[0.9rem] sm:text-[1rem] text-gray-600 text-left font-light">
                        {item.calories} cal
                      </td> 
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-16 text-[1rem] text-gray-400 italic font-light">Không có dữ liệu chi tiết</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: ` /* Custom scrollbar */
          .custom-scrollbar::-webkit-scrollbar {   /* Chiều ngang */
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track { /* Chiều doc */
            background: #f1f1f1;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb { / * Chiều ngang */
            background: #ccc;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { / * Chiều ngang */
            background: #999;
            border-radius: 10px;
          }
        `}} />
      </div>
    </div>
  );
};

export default FoodDetailModal;