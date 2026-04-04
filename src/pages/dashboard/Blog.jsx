//Trang Blog 

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useEffect } from 'react';
import FoodDetailModal from '../../components/common/FoodDetailModal';
import axiosClient from '../../services/axiosClient';

import PotatoesImg from '../../assets/img/Potatoes.svg';
import VegetablesImg from '../../assets/img/Vegetables.jpg';
import MushroomsImg from '../../assets/img/Mushroom.jpg';
import TitleImg from '../../assets/img/img-blog.svg';


const Blog = () => {
    const [selectedFood, setSelectedFood] = useState(null); 
    const [searchTerm, setSearchTerm] = useState("");     
    const [activeCategory, setActiveCategory] = useState("Tất cả"); 
    const [foods, setFoods] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);

    const sidebarMenu = [
        { id: 'seasonal', title: "Thực đơn theo mùa", isStatic: true },
        { id: 'dishes', title: "Thực đơn theo món", isStatic: true },
        { 
            id: 'time', 
            title: "Thực đơn theo bữa", 
            items: ["Bữa sáng", "Bữa trưa","Bữa tối"] 
        },
        { 
            id: 'day', 
            title: "Thực đơn theo t/g", 
            items: ["Thứ 2", "Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7","Chủ nhật"] 
        },
        { id: 'favorite', title: "Được yêu thích", isStatic: true },
        { 
            id: 'popular', 
            title: "Thực đơn thông dụng", 
            items: ["Title....."] 
        }
    ];

    
    const [expandedSections, setExpandedSections] = useState(() => {
        const saved = localStorage.getItem('blog_sidebar_expanded');
        return saved ? JSON.parse(saved) : {
            time: true,
            day: true,
            popular: true
        };
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // FETCH FOODS FROM API
    useEffect(() => {
        const fetchFoods = async () => {
            try {
                setIsLoading(true);
                const params = {};
                if (activeCategory !== "Tất cả") params.category = activeCategory;
                if (searchTerm) params.search = searchTerm;

                console.log("[API Request] GET /foods", params);
                const res = await axiosClient.get('/foods', { params });
                
            
                const data = res?.foods || res;
                setFoods(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Lỗi khi fetch foods:", err);
                setFoods([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchFoods();
        }, 300); 

        return () => clearTimeout(timer);
    }, [activeCategory, searchTerm]);

    
    const handleSeedFoods = async () => {
        if (!window.confirm("Bạn có muốn khởi tạo dữ liệu mẫu vào Database không?")) return;
        try {
            const initialFoods = [
                { 
                    category: "Bữa sáng", 
                    title: "Potatoes", 
                    desc: "Potatoes are very high in vitamin C, their skins are packed with fiber...", 
                    fullDesc: "Potatoes are very high in vitamin C, their skins are packed with fiber and, although they are higher in carbs, these starchy complex carbohydrates are converted into energy and will keep you feeling fuller for longer.",
                    imageUrl: "Potatoes.svg", 
                    details: [
                        { name: "Baked Potato", serving: "1 piece (173g)", calories: "212" },
                        { name: "Croquettes", serving: "1 piece, small (19 g)", calories: "34" },
                        { name: "Curly Fries", serving: "1 portion (85 g)", calories: "150" },
                        { name: "French Fries", serving: "1 portion (120g)", calories: "374" },
                        { name: "Gnocchi", serving: "1 portion (120g)", calories: "326" },
                        { name: "Hash Browns", serving: "1 piece (50 g)", calories: "86" },
                        { name: "Latkes", serving: "1 piece, small (25 g)", calories: "49" },
                    ]
                },
                { 
                    category: "Bữa trưa", 
                    title: "Vegetables", 
                    desc: "Vegetables are a great high-volume, low-calorie option...", 
                    fullDesc: "Vegetables are a great high-volume, low-calorie option. You can eat a lot of them while keeping your calorie intake low.",
                    imageUrl: "Vegetables.jpg",
                    details: [
                        { name: "Arrowroot", serving: "1 piece (33 g)", calories: "21" },
                        { name: "Artichoke", serving: "1 piece (128 g)", calories: "56" },
                        { name: "Asparagus", serving: "1 piece, small (12 g)", calories: "2" },
                        { name: "Asparagus, cooked", serving: "1 portion (125 g)", calories: "19" },
                        { name: "Azuki Beans", serving: "1 portion (60 g)", calories: "217" },
                        { name: "Baked Beans", serving: "1 cup (253 g)", calories: "266" }
                    ]
                },
                { 
                    category: "Bữa tối", 
                    title: "Mushrooms", 
                    desc: "High in protein and low in calories...", 
                    fullDesc: "High in protein and low in calories, mushrooms that have been grown in the sun are also a great source of vitamin D.",
                    imageUrl: "Mushroom.jpg",
                    details: [
                        { name: "Button Mushrooms", serving: "100g", calories: "22" }
                    ]
                }
            ];
            for (const food of initialFoods) {
                await axiosClient.post('/foods', food);
            }
            alert("Đã khởi tạo dữ liệu mẫu thành công!");
            window.location.reload();
        } catch (err) {
            console.error("Seed failed:", err);
            alert("Lỗi khi khởi tạo dữ liệu: " + (err.message || "Unknown error"));
        }
    };

    useEffect(() => {
        localStorage.setItem('blog_sidebar_expanded', JSON.stringify(expandedSections));
    }, [expandedSections]);

    useEffect(() => {
        sidebarMenu.forEach(section => {
            if (section.items && section.items.includes(activeCategory)) {
                if (!expandedSections[section.id]) {
                    setExpandedSections(prev => ({ ...prev, [section.id]: true }));
                }
            }
        });
    }, [activeCategory]);

    const toggleSection = (sectionId) => { 
        setExpandedSections(prev => ({ 
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };


    const filteredFoods = useMemo(() => {

        return foods.map(food => ({
            ...food,
            id: food.id || food._id,
            img: food.imageUrl ? `src/assets/img/${food.imageUrl}` : `src/assets/img/img-blog.svg`
        }));
    }, [foods]);

    return (
        <div className="blog-wrapper">
            <style>{`
                .blog-wrapper { font-family: "Inter", sans-serif; background: #f5f5f5; min-height: 100vh; padding-bottom: 100px; }
                
                /* THANH TÌM KIẾM */
                /* Tăng padding cho search bar container để đồng bộ với nội dung */
                .search-bar-container {
                    padding: 20px;
                    display: flex;
                    justify-content: flex-end;
                }
                .search-input { padding: 10px 15px; border: 1px solid #ddd; border-radius: 20px; width: 100%; max-width: 300px; outline: none; }
               
                /* Khung chính chứa sidebar và nội dung */
                .container { 
                    display: flex; 
                    align-items: flex-start; 
                    gap: 20px; 
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                } 

                /* SIDEBAR */
                .sidebar { width: 300px; flex-shrink: 0; user-select: none; }
                .sidebar h4 { 
                    margin-bottom: 20px; 
                    font-size: 1.5rem; 
                    font-weight: 800; 
                    color: #333; 
                    text-align: left; 
                    padding-left: 20px;
                    letter-spacing: -0.5px;
                    white-space: nowrap; /* Ngăn xuống dòng cho tiêu đề */
                }
                .menu-group { margin-bottom: 15px; }
                .menu-header { 
                    display: flex; 
                    align-items: center; 
                    gap: 10px; 
                    font-weight: 400; 
                    margin-bottom: 10px; 
                    font-size: 1.5rem; 
                    color: #333; 
                    cursor: pointer;
                    transition: 0.2s;
                    padding-left: 20px;
                    white-space: nowrap;
                }
                .menu-header:hover { color: #00b2ff; }
                .menu-header.active-header, .sidebar h4.active-header { color: #00b2ff; }
                .chevron { 
                    width: 8px;
                    height: 8px;
                    border-right: 2px solid #666;
                    border-bottom: 2px solid #666;
                    transform: rotate(45deg); /* Mặc định trỏ xuống */
                    transition: all 0.3s ease;
                    display: inline-block;
                    margin-right: 5px;
                }
                .chevron.rotated { 
                    transform: rotate(-45deg); /* Trỏ sang phải khi đóng */
                }
                
                .sub-list { 
                    margin-left: 80px; /* Thụt lề mục con */
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .sub { 
                    display: block; 
                    color: #555; 
                    cursor: pointer; 
                    transition: all 0.2s ease; 
                    font-size: 1.4rem;
                    padding: 3px 0;
                    font-weight: 400;
                    white-space: nowrap;
                } 
                .sub:hover { 
                    color: #00b2ff; 
                    transform: translateX(5px);
                } 
                .sub.active-sub, .static-item.active-sub { 
                    color: #00b2ff; 
                    font-weight: 600;
                }
                .static-item {
                    padding-left: 38px; /* Căn lề thẳng với chữ của mục cha */
                    font-weight: 400;
                    margin-bottom: 10px;
                    font-size: 1.5rem;
                    color: #333;
                    cursor: pointer;
                    display: block;
                    transition: 0.2s;
                    white-space: nowrap;
                }
                .static-item:hover { color: #00b2ff; }
                .separator {
                    font-size: 1rem;
                    color: #666;
                    margin: 5px 0 10px 0;
                    display: block;
                    letter-spacing: 2px;
                }

                /* CONTENT */
                .content { flex: 1; min-width: 0; }
                .content-header h2 { 
                    font-size: 1.8rem; 
                    text-align: left; 
                    margin-bottom: 25px; 
                    font-weight: bold; 
                    color: #333; 
                    white-space: normal; /* Cho phép xuống dòng trên màn hình nhỏ */
                } 
                
                /* CARD GRID */
                .card-grid { 
                    display: grid; 
                    grid-template-columns: repeat(3, 1fr);  /* Cố định 3 cột trên desktop */
                    gap: 20px;   /* Khoảng cách giữa các card */
                }
                .card { 
                    background: #fff;  
                    border-radius: 12px; 
                    padding: 24px; 
                    cursor: pointer; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    min-height: 420px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }
                .card:hover { 
                    transform: translateY(-8px); 
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1); 
                    border-color: #00b2ff;
                }
                .img-box { 
                    width: 100%; 
                    height: 200px;
                    background: #f8f9fa; 
                    border-radius: 8px; 
                    margin-bottom: 20px; 
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #f0f0f0;
                }
                .img-box img { 
                    width: 100%; 
                    height: 100%; 
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .card:hover .img-box img {
                    transform: scale(1.05);
                }
                
                .card h3 { 
                    margin-bottom: 12px; 
                    font-size: 1.6rem; 
                    font-weight: 700; 
                    color: #1a1a1a;
                    text-align: left;
                    line-height: 1.3;
                }
                .card p { 
                    font-size: 1.1rem; 
                    color: #666; 
                    line-height: 1.6; 
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 4; 
                    -webkit-box-orient: vertical;
                    text-align: left;
                    margin-bottom: 15px;
                }
                .card-footer {
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 15px;
                    border-top: 1px solid #f0f0f0;
                }
                .read-more {
                    color: #00b2ff;
                    font-weight: 600;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .read-more::after {
                    content: '→';
                    transition: transform 0.2s ease;
                }
                .card:hover .read-more::after {
                    transform: translateX(5px);
                }

                .no-result { text-align: center; padding: 50px; font-size: 1.5rem; color: #999; grid-column: 1 / -1; } /* Thông báo khi không tìm thấy kết quả*/

                /* RESPONSIVE */
                @media (max-width: 1200px) {
                    .card-grid { grid-template-columns: repeat(2, 1fr); } /* 2 cột cho màn hình vừa */
                }

                @media (max-width: 992px) {
                    .container { flex-direction: column; }
                    .sidebar { 
                        width: 100%; 
                        background: #fff;
                        padding: 15px;
                        border-radius: 12px;
                        margin-bottom: 20px;
                        display: ${isSidebarOpen ? 'block' : 'none'};
                        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                        border: 1px solid #eef2f6;
                        animation: slideDown 0.3s ease-out;
                    }
                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .sidebar h4, .menu-header, .static-item { padding-left: 10px; }
                    .menu-header {
                        padding: 12px 10px;
                        border-radius: 8px;
                        background: #f8fafc;
                        margin-bottom: 8px;
                    }
                    .menu-header:active {
                        background: #f1f5f9;
                    }
                    .sub-list { 
                        margin-left: 20px;
                        padding: 5px 0 15px 15px;
                        border-left: 2px solid #e2e8f0;
                    }
                    .sub {
                        padding: 10px 0;
                        font-size: 1.3rem;
                    }
                    .static-item {
                        padding: 12px 10px;
                        border-radius: 8px;
                        background: #f8fafc;
                        margin-bottom: 8px;
                    }
                    .search-bar-container { 
                        justify-content: space-between; 
                        align-items: center;
                        gap: 10px;
                        padding: 15px 20px;
                        background: #fff;
                        position: sticky;
                        top: 0;
                        z-index: 10;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    }
                    .mobile-menu-btn {
                        display: flex !important;
                        align-items: center;
                        gap: 8px;
                        background: #00b2ff;
                        color: white;
                        border: none;
                        padding: 10px 18px;
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                        box-shadow: 0 4px 12px rgba(0, 178, 255, 0.2);
                        transition: all 0.2s;
                    }
                    .mobile-menu-btn:active {
                        transform: scale(0.95);
                    }
                    .card-grid { grid-template-columns: repeat(2, 1fr); }
                }

                .mobile-menu-btn { display: none; }

                @media (max-width: 768px) {
                    .card-grid { grid-template-columns: repeat(2, 1fr); gap: 15px; }
                    .card { min-height: 350px; padding: 15px; }
                    .img-box { height: 160px; }
                    .card h3 { font-size: 1.4rem; }
                    .card p { font-size: 1rem; }
                }

                @media (max-width: 576px) {
                    .card-grid { grid-template-columns: 1fr; }
                    .content-header h2 { font-size: 1.5rem; }
                    .search-input { max-width: 200px; }
                }

                @media (max-width: 480px) {
                    .search-bar-container { padding: 15px; }
                    .search-input { font-size: 0.85rem; padding: 8px 12px; }
                    .mobile-menu-btn { font-size: 0.85rem; padding: 6px 12px; }
                    .card h3 { font-size: 1.2rem; }
                    .card p { font-size: 0.9rem; -webkit-line-clamp: 3; }
                    .sidebar h4, .menu-header, .static-item { font-size: 1.2rem; }
                    .sub { font-size: 1.1rem; }
                }
            `}</style>

            <div className="search-bar-container">
                <button 
                    className="mobile-menu-btn"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <span>{isSidebarOpen ? '✕ Đóng menu' : '☰ Danh mục'}</span>
                </button>
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Tìm kiếm món ăn..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
            </div>

            <main className="container">
<aside className="sidebar">
    <h4 
        className={activeCategory === "Tất cả" ? "active-header" : ""} 
        onClick={() => {
            setActiveCategory("Tất cả");
            if (window.innerWidth <= 992) setIsSidebarOpen(false);
        }} 
        style={{ cursor: 'pointer' }}
    >
        Tất cả danh mục
    </h4>
    
   
    {sidebarMenu.map((section) => (
        <div key={section.id} className="menu-group">
            
            {section.isStatic ? (
                <span 
                    className={`static-item ${activeCategory === section.title ? "active-sub" : ""}`}
                    onClick={() => {
                        setActiveCategory(section.title);
                        if (window.innerWidth <= 992) setIsSidebarOpen(false);
                    }} 
                >
                    {section.title}
                </span>
            ) : (
                <>
                    <div 
                        className={`menu-header ${section.items.includes(activeCategory) ? "active-header" : ""}`}
                        onClick={() => toggleSection(section.id)}
                    >
                        <span className={`chevron ${expandedSections[section.id] ? "" : "rotated"}`}></span>
                        <span>{section.title}</span>
                    </div>
                    
                    <div 
                        className="sub-list" 
                        style={{ 
                            maxHeight: expandedSections[section.id] ? `${section.items.length * 40 + 50}px` : '0',
                            opacity: expandedSections[section.id] ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'all 0.3s ease' 
                        }}
                    >
                        {section.items.map(cat => (
                            <span 
                                key={cat}
                                className={`sub ${activeCategory === cat ? "active-sub" : ""}`} 
                                onClick={() => {
                                    setActiveCategory(cat);
                                    if (window.innerWidth <= 992) setIsSidebarOpen(false); 
                                }} 
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </div>
    ))}
</aside>

                <section className="content">
                    <div className="content-header">
                        <h2>{activeCategory === "Tất cả" ? "Thực đơn và lời khuyên về chế độ ăn uống lành mạnh" : `Thực đơn ${activeCategory}`}</h2> 
                    </div>

                    <div className="card-grid"> 
                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '50px', gridColumn: '1 / -1' }}>
                                <div style={{ color: '#00b2ff', fontSize: '1.2rem', fontWeight: '600' }}>Đang tải thực đơn...</div>
                            </div>
                        ) : filteredFoods.length > 0 ? ( 
                            filteredFoods.map((food) => (  
                                <div 
                                    className="card" 
                                    key={food.id} 
                                    onClick={() => setSelectedFood(food)} 
                                >
                                    <div className="img-box"> 
                                        <img src={food.img} alt={food.title} /> 
                                    </div>
                                    <h3>{food.title}</h3>
                                    <p>{food.desc}</p>
                                    <div className="card-footer">
                                        <span className="read-more">Xem chi tiết</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-result">
                                <p>Không tìm thấy món ăn phù hợp.</p>
                                <button 
                                    onClick={handleSeedFoods}
                                    style={{
                                        marginTop: '20px',
                                        padding: '10px 20px',
                                        background: '#00b2ff',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '20px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Khởi tạo dữ liệu mẫu
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            
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