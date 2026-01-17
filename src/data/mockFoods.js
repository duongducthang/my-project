// Mock data cho danh sách món ăn
export const mockFoods = [
  {
    id: 1,
    name: 'Phở Bò',
    description: 'Phở bò truyền thống với thịt bò tái và chín, nước dùng đậm đà',
    price: 75000,
    image: 'https://via.placeholder.com/300x200?text=Pho+Bo',
    category: 'Phở',
    available: true,
  },
  {
    id: 2,
    name: 'Bún Chả',
    description: 'Bún chả Hà Nội với thịt nướng, chả viên và nước mắm pha',
    price: 65000,
    image: 'https://via.placeholder.com/300x200?text=Bun+Cha',
    category: 'Bún',
    available: true,
  },
  {
    id: 3,
    name: 'Bánh Mì Thịt Nướng',
    description: 'Bánh mì giòn với thịt nướng thơm lừng, rau củ tươi',
    price: 45000,
    image: 'https://via.placeholder.com/300x200?text=Banh+Mi',
    category: 'Bánh Mì',
    available: true,
  },
  {
    id: 4,
    name: 'Cơm Tấm Sườn Bì Chả',
    description: 'Cơm tấm đặc biệt với sườn nướng, bì, chả và trứng',
    price: 85000,
    image: 'https://via.placeholder.com/300x200?text=Com+Tam',
    category: 'Cơm',
    available: true,
  },
  {
    id: 5,
    name: 'Bún Bò Huế',
    description: 'Bún bò Huế cay nồng với thịt bò, chả cua và rau thơm',
    price: 70000,
    image: 'https://via.placeholder.com/300x200?text=Bun+Bo+Hue',
    category: 'Bún',
    available: true,
  },
  {
    id: 6,
    name: 'Gỏi Cuốn',
    description: 'Gỏi cuốn tươi với tôm, thịt, bún tươi và rau sống',
    price: 55000,
    image: 'https://via.placeholder.com/300x200?text=Goi+Cuon',
    category: 'Khai Vị',
    available: true,
  },
  {
    id: 7,
    name: 'Chè Thái',
    description: 'Chè Thái mát lạnh với nhiều loại thạch và trái cây',
    price: 35000,
    image: 'https://via.placeholder.com/300x200?text=Che+Thai',
    category: 'Tráng Miệng',
    available: true,
  },
  {
    id: 8,
    name: 'Bánh Xèo',
    description: 'Bánh xèo giòn rụm với tôm, thịt và giá đỗ',
    price: 60000,
    image: 'https://via.placeholder.com/300x200?text=Banh+Xeo',
    category: 'Bánh',
    available: true,
  },
];

// Lấy danh sách categories
export const getCategories = () => {
  const categories = [...new Set(mockFoods.map((food) => food.category))];
  return categories;
};
