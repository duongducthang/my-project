import XImg from '../../assets/img/X.svg';

const FoodDetailModal = ({ food, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-sm shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative">
        
        {/* Header của Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <span className="text-gray-600 text-sm font-medium">Chi tiết</span>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg xmlns={XImg} className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Phần nội dung: Ảnh trái, Text phải */}
          <div className="flex gap-6 mb-8">
            <div className="w-1/3 flex-shrink-0">
              <img 
                src={food.img} 
                className="w-full aspect-[4/3] object-cover rounded-sm" 
                alt={food.title} 
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{food.title}</h2>
              <p className="text-gray-500 text-xs leading-relaxed">
                {food.fullDesc || food.desc}
              </p>
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <div className="border-t border-gray-200">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 w-1/3 border-r border-gray-200">Food</th>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 w-1/3 border-r border-gray-200">Serving</th>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 w-1/3">Calories</th>
                </tr>
              </thead>
              <tbody>
                {food.details && food.details.length > 0 ? (
                  food.details.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-b-0">
                      <td className="px-2 py-3 text-xs text-gray-600">{item.name}</td>
                      <td className="px-2 py-3 text-xs text-gray-500">{item.serving}</td>
                      <td className="px-2 py-3 text-xs text-gray-500">{item.calories}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-xs text-gray-400 italic">Không có dữ liệu chi tiết</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailModal;