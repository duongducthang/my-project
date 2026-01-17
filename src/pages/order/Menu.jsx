import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { mockFoods, getCategories } from '../../data/mockFoods';

const Menu = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const categories = ['Tất cả', ...getCategories()];

  // Lọc món ăn theo category
  const filteredFoods =
    selectedCategory === 'Tất cả'
      ? mockFoods
      : mockFoods.filter((food) => food.category === selectedCategory);

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Thực Đơn Hôm Nay
          </h1>
          <p className="text-gray-600">Chọn món bạn yêu thích</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-blue-600 font-semibold">
                    {food.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {food.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {food.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-red-600">
                    {formatPrice(food.price)}
                  </span>
                  <button
                    onClick={() => addToCart(food)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFoods.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Không có món ăn nào trong danh mục này
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
