/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from 'react';
import FoodDetailModal from '../../components/common/FoodDetailModal';

// Import ảnh (giả định theo cấu trúc thư mục của bạn)
import PotatoesImg from '../../assets/img/Potatoes.svg';
import VegetablesImg from '../../assets/img/Vegetables.jpg';
import MushroomsImg from '../../assets/img/Mushroom.jpg';
import TitleImg from '../../assets/img/img-blog.svg';

const Blog = () => {
    // 1. STATE QUẢN LÝ CHỨC NĂNG
    const [selectedFood, setSelectedFood] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("Tất cả");

    // 2. DỮ LIỆU GỐC
    const foods = [
       { 
        id: 1, 
        category: "Bữa sáng", 
        title: "Potatoes", 
        desc: "Potatoes are very high in vitamin C, their skins are packed with fiber and, although they are higher...", 
        fullDesc: "Potatoes are very high in vitamin C, their skins are packed with fiber and, although they are higher in carbs, these starchy complex carbohydrates are converted into energy and will keep you feeling fuller for longer. Check out our Potatoes and Potato Products Calorie Chart below for more nutritional information.",
        img: PotatoesImg, 
        details: [
            { name: "Baked Potato", serving: "1 piece (173g)", calories: "212 cal" },
            { name: "Croquettes", serving: "1piece,small(19g)", calories: "34 cal" },
            { name: "Curly Fries", serving: "1 portion (85g)", calories: "150 cal" },
            { name: "French Fries", serving: "1 portion (120g)", calories: "374 cal" },
            { name: "Gnocchi", serving: "1 portion (200g)", calories: "326 cal" },
            { name: "Hash Browns", serving: "1 piece (50g)", calories: "86 cal" },
            { name: "Latkes", serving: "1 piece, small (25g)", calories: "49 cal" }
        ]
    },
    { 
        id: 2, 
        category: "Bữa trưa", 
        title: "Vegetables", 
        desc: "Vegetables are a great high-volume, low-calorie option...", 
        fullDesc: "Vegetables are a great high-volume, low-calorie option. You can eat a lot of them",
        img: VegetablesImg,
        details: [
            { name: "Arrowroot", serving: "1 piece (33 g)", calories: "21 cal" },
            { name: "Artichoke", serving: "1 piece (128 g)", calories: "56 cal" },
            { name: "Asparagus", serving: "1 piece, small (12 g)", calories: "2 cal" },
            { name: "Asparagus, cooked", serving: "1 portion (125 g)", calories: "19 cal" },
            { name: "Azuki Beans", serving: "1 portion (60 g)", calories: "217 cal" },
            { name: "Baked Beans", serving: "1 cup (253 g)", calories: "266 cal" }
        ]
    },
    { 
        id: 3, 
        category: "Bữa tối", 
        title: "Mushrooms", 
        desc: "High in protein and low in calories, mushrooms that have been grown...", 
        img: MushroomsImg,
    },
    { id: 4, category: "Thứ hai", title: "Title 4", desc: "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. ", fullDesc: "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. ", img: TitleImg },
    { id: 5, category: "Thứ ba", title: "Title 5", desc: "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. ", fullDesc: "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. ", img: TitleImg },
    { id: 6, category: "Thực đơn thông dụng", title: "Title 6", desc: "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. ", fullDesc: "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. ", img: TitleImg },
];

    // 3. LOGIC LỌC VÀ TÌM KIẾM
    const filteredFoods = useMemo(() => {
        return foods.filter(food => {
            const matchesCategory = activeCategory === "Tất cả" || food.category === activeCategory;
            const matchesSearch = food.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, activeCategory]);

    return (
        <div className="blog-wrapper">
            <style>{`
                .blog-wrapper { font-family: "Inter", sans-serif; background: #f5f5f5; min-height: 100vh; padding-bottom: 100px; }
                
                /* THANH TÌM KIẾM */
                .search-bar-container { width: 90%; margin: 20px auto 0; display: flex; justify-content: flex-end; }
                .search-input { padding: 10px 15px; border: 1px solid #ddd; border-radius: 20px; width: 300px; outline: none; }

                .container { display: flex; align-items: flex-start; width: 92%; max-width: 1400px; margin: 30px auto; gap: 40px; }

                /* SIDEBAR */
                .sidebar { width: 220px; flex-shrink: 0; }
                .sidebar h4 { margin-bottom: 20px; font-size: 1.6rem; font-weight: bold; cursor: pointer; color: #333; }
                .menu-group { margin-bottom: 25px; }
                .menu-group p { font-weight: bold; margin-bottom: 12px; font-size: 1.4rem; color: #444; }
                .sub { display: block; margin-bottom: 10px; color: #666; cursor: pointer; transition: 0.2s; font-size: 1.4rem; }
                .sub:hover { color: #2f80ed; }
                .sub.active-sub { color: #2f80ed; font-weight: bold; }

                /* CONTENT */
                .content { flex: 1; }
                .content-header h2 { font-size: 2.4rem; text-align: left; margin-bottom: 35px; font-weight: bold; color: #333; }
                
                /* CARD GRID */
                .card-grid { 
                    display: grid; 
                    grid-template-columns: repeat(3, 1fr); 
                    gap: 25px; 
                    padding-bottom: 100px;
                }
                .card { 
                    background: #fff; 
                    border: 1px solid #e0e0e0; 
                    border-radius: 8px; 
                    padding: 25px; 
                    cursor: pointer; 
                    transition: 0.3s;
                    display: flex;
                    flex-direction: column;
                    min-height: 450px;
                }
                .card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
                .img-box { 
                    width: 70%; 
                    height: 230px;
                    background: #f5f5f5; 
                    border-radius: 6px; 
                    margin-bottom: 20px; 
                    overflow: hidden; 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #eee;
                }
                .img-box img { 
                    width: 100%; 
                    height: 100%; 
                    object-fit: cover;
                }
                /* Đối với các card có placeholder (Title 4, 5, 6) */
                .card:nth-child(n+4) .img-box img {
                    width: 60%;
                    height: 60%;
                    object-fit: contain;
                    opacity: 0.2;
                }

                .card h3 { 
                    margin-bottom: 15px; 
                    font-size: 2.2rem; 
                    font-weight: 800; 
                    color: #000;
                    text-align: left;
                }
                .card p { 
                    font-size: 1.5rem; 
                    color: #555; 
                    line-height: 1.6; 
                    overflow: hidden; 
                    display: -webkit-box; 
                    -webkit-line-clamp: 5;
                    -webkit-box-orient: vertical;
                    text-align: left;
                }

                .no-result { text-align: center; padding: 50px; font-size: 1.8rem; color: #999; grid-column: span 3; }
            `}</style>

            {/* CHỨC NĂNG 1: TÌM KIẾM */}
            <div className="search-bar-container">
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Tìm kiếm món ăn..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <main className="container">
                {/* CHỨC NĂNG 2: LỌC THEO CATEGORY TẠI SIDEBAR */}
                <aside className="sidebar">
                    <h4 onClick={() => setActiveCategory("Tất cả")}>Tất cả danh mục</h4>

                    <div className="menu-group">
                        <p>Thực đơn theo bữa</p>
                        {["Bữa sáng", "Bữa trưa", "Bữa tối"].map(cat => (
                            <span 
                                key={cat}
                                className={`sub ${activeCategory === cat ? "active-sub" : ""}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </span>
                        ))}
                    </div>

                    <div className="menu-group">
                        <p>Thực đơn theo tuần</p>
                        {["Thứ hai", "Thứ ba"].map(cat => (
                            <span 
                                key={cat}
                                className={`sub ${activeCategory === cat ? "active-sub" : ""}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                </aside>

                <section className="content">
                    <div className="content-header">
                        <h2>{activeCategory === "Tất cả" ? "Thực đơn và lời khuyên về chế độ ăn uống lành mạnh" : `Thực đơn ${activeCategory}`}</h2>
                    </div>

                    <div className="card-grid">
                        {filteredFoods.length > 0 ? (
                            filteredFoods.map((food) => (
                                <div 
                                    className="card" 
                                    key={food.id}
                                    onClick={() => setSelectedFood(food)} // CHỨC NĂNG 3: MỞ MODAL
                                >
                                    <div className="img-box">
                                        <img src={food.img} alt={food.title} />
                                    </div>
                                    <h3>{food.title}</h3>
                                    <p>{food.desc}</p>
                                </div>
                            ))
                        ) : (
                            <div className="no-result">Không tìm thấy món ăn phù hợp.</div>
                        )}
                    </div>
                </section>
            </main>

            {/* MODAL CHI TIẾT */}
            {selectedFood && (
                <FoodDetailModal 
                    food={selectedFood} 
                    onClose={() => setSelectedFood(null)} 
                />
            )}
        </div>
    );
};

export default Blog;