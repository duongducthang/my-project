//Trang Blog 
//useMemo để tối ưu hiệu suất khi lọc dữ liệu

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useEffect } from 'react';
import FoodDetailModal from '../../components/common/FoodDetailModal';

// Import ảnh (giả định theo cấu trúc thư mục của bạn)
import PotatoesImg from '../../assets/img/Potatoes.svg';
import VegetablesImg from '../../assets/img/Vegetables.jpg';
import MushroomsImg from '../../assets/img/Mushroom.jpg';
import TitleImg from '../../assets/img/img-blog.svg';


const Blog = () => {
    const [selectedFood, setSelectedFood] = useState(null); // Lưu món ăn người dùng nhấn vào để xem chi tiết (Modal)
    const [searchTerm, setSearchTerm] = useState("");      // Lưu từ khóa tìm kiếm mà người dùng nhập
    const [activeCategory, setActiveCategory] = useState("Tất cả"); // Danh mục hiện tại đang được chọn để lọc

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

    // Trạng thái đóng/mở của các mục có menu con trong Sidebar
    // Dữ liệu được lấy từ localStorage để ghi nhớ trạng thái người dùng đã chọn trước đó 
    const [expandedSections, setExpandedSections] = useState(() => {
        const saved = localStorage.getItem('blog_sidebar_expanded');
        return saved ? JSON.parse(saved) : {
            time: true,
            day: true,
            popular: true
        };
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State cho mobile sidebar

    // Cập nhật localStorage mỗi khi người dùng đóng/mở một mục trong Sidebar
    useEffect(() => {
        localStorage.setItem('blog_sidebar_expanded', JSON.stringify(expandedSections));
    }, [expandedSections]); 

    // Tự động mở rộng danh mục trong Sidebar nếu người dùng chọn một mục con bên trong nó
    useEffect(() => {
        sidebarMenu.forEach(section => {
            if (section.items && section.items.includes(activeCategory)) {
                if (!expandedSections[section.id]) {
                    setExpandedSections(prev => ({ ...prev, [section.id]: true }));
                }
            }
        });
    }, [activeCategory]);

    // Hàm xử lý việc đóng/mở các mục trong Sidebar
    const toggleSection = (sectionId) => { 
        setExpandedSections(prev => ({ 
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    // DỮ LIỆU DANH SÁCH MÓN ĂN (MOCK DATA)
    const foods = [
        { 
            id: 1, 
            category: "Bữa sáng", 
            title: "Potatoes", 
            desc: "Potatoes are very high in vitamin C, their skins are packed with fiber and, although they are higher....", 
            fullDesc: "Potatoes are very high in vitamin C, their skins are packed with fiber and, although they are higher in carbs, these starchy complex carbohydrates are converted into energy and will keep you feeling fuller for longer. Check out our Potatoes and Potato Products Calorie Chart below for more nutritional information",
            img: PotatoesImg, 
            details: [
                { name: "Baked Potato", serving: "1 piece (173g)", calories: "212 " },
                { name: "Croquettes", serving: "1piece,small(19g)", calories: "34 " },
                { name: "Curly Fries", serving: "1 portion (85g)", calories: "150 " },
                { name: "French Fries", serving: "1 portion (120g)", calories: "374 " },
                { name: "Gnocchi", serving: "1 portion (200g)", calories: "326 " },
                { name: "Hash Browns", serving: "1 piece (50g)", calories: "86 " },
                { name: "Latkes", serving: "1 piece, small (25g)", calories: "49 " }
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
                { name: "Arrowroot", serving: "1 piece (33 g)", calories: "21 " },
                { name: "Artichoke", serving: "1 piece (128 g)", calories: "56 " },
                { name: "Asparagus", serving: "1 piece, small (12 g)", calories: "2 " },
                { name: "Asparagus, cooked", serving: "1 portion (125 g)", calories: "19 " },
                { name: "Azuki Beans", serving: "1 portion (60 g)", calories: "217 " },
                { name: "Baked Beans", serving: "1 cup (253 g)", calories: "266 " }
            ]
        },
        { 
            id: 3, 
            category: "Bữa tối", 
            title: "Mushrooms", 
            desc: "High in protein and low in calories, mushrooms that have been grown...", 
            img: MushroomsImg,
        },
        { id: 4, category: "Thứ 2", title: "Title", desc: "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.", img: TitleImg },
        { id: 5, category: "Thứ 3", title: "Title", desc: "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.", img: TitleImg },
        { id: 6, category: "Title.....", title: "Title", desc: "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.", img: TitleImg },
    ];

    // LOGIC LỌC VÀ TÌM KIẾM MÓN ĂN
    // Sử dụng useMemo để tránh việc tính toán lại danh sách mỗi khi component re-render không cần thiết
    const filteredFoods = useMemo(() => {
        return foods.filter(food => {
            // Kiểm tra xem món ăn có thuộc danh mục đang chọn không (hoặc là "Tất cả")
            const matchesCategory = activeCategory === "Tất cả" || food.category === activeCategory;
            // Kiểm tra xem tiêu đề món ăn có chứa từ khóa tìm kiếm không
            const matchesSearch = food.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, activeCategory]); // Chỉ tính toán lại khi searchTerm hoặc activeCategory thay đổi

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

        {/* CHỨC NĂNG 1: TÌM KIẾM */}
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
                    onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm khi người dùng nhập liệu
                />
            </div>

            <main className="container">
        {/* CHỨC NĂNG 2: LỌC THEO CATEGORY TẠI SIDEBAR */}
<aside className="sidebar">
        {/* Mục "Tất cả": Reset bộ lọc để hiển thị toàn bộ món ăn */}
    <h4 
        className={activeCategory === "Tất cả" ? "active-header" : ""} // Active class nếu đang chọn tất cả
        onClick={() => {
            setActiveCategory("Tất cả");
            if (window.innerWidth <= 992) setIsSidebarOpen(false);
        }} // Cập nhật state lọc về mặc định
        style={{ cursor: 'pointer' }}
    >
        Tất cả danh mục
    </h4>
    
    {/* Duyệt qua mảng cấu trúc menu sidebarMenu để render từng nhóm */}
    {sidebarMenu.map((section) => (
        <div key={section.id} className="menu-group">
            
            {/* KIỂM TRA LOẠI MENU: isStatic nghĩa là mục đơn, không có menu con */}
            {section.isStatic ? (
                <span 
                    className={`static-item ${activeCategory === section.title ? "active-sub" : ""}`}
                    onClick={() => {
                        setActiveCategory(section.title);
                        if (window.innerWidth <= 992) setIsSidebarOpen(false);
                    }} // Nhấn vào là lọc ngay theo tiêu đề section
                >
                    {section.title}
                </span>
            ) : (
                /* NẾU LÀ MENU ĐA CẤP: Có tiêu đề và danh sách các mục con (sub-items) */
                <>
                    {/* Header của nhóm menu (vd: Thực đơn theo bữa) */}
                    <div 
                        className={`menu-header ${section.items.includes(activeCategory) ? "active-header" : ""}`}
                        onClick={() => toggleSection(section.id)} // Logic đóng/mở menu con
                    >
                        {/* Biểu tượng mũi tên, xoay dựa trên trạng thái expanded (đã mở hay chưa) */}
                        <span className={`chevron ${expandedSections[section.id] ? "" : "rotated"}`}></span>
                        <span>{section.title}</span>
                    </div>
                    
                    {/* Danh sách các mục con (sub-list) */}
                    <div 
                        className="sub-list" 
                        style={{ 
                            /* Hiệu ứng mượt (Transition): Tính toán chiều cao dựa trên số lượng item để trượt xuống */
                            maxHeight: expandedSections[section.id] ? `${section.items.length * 40 + 50}px` : '0',
                            opacity: expandedSections[section.id] ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'all 0.3s ease' // Thời gian hiệu ứng 0.3 giây
                        }}
                    >
                        {/* Duyệt qua mảng các mục con của section (vd: Bữa sáng, Bữa trưa...) */}
                        {section.items.map(cat => (
                            <span 
                                key={cat}
                                className={`sub ${activeCategory === cat ? "active-sub" : ""}`} // Đánh dấu mục đang chọn
                                onClick={() => {
                                    setActiveCategory(cat);
                                    if (window.innerWidth <= 992) setIsSidebarOpen(false); // Đóng sidebar trên mobile sau khi chọn
                                }} // Cập nhật danh mục cần lọc
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
                        {/* dùng === để tránh các trường hợp ép kiểu như : 1==='1' :false */}
                        <h2>{activeCategory === "Tất cả" ? "Thực đơn và lời khuyên về chế độ ăn uống lành mạnh" : `Thực đơn ${activeCategory}`}</h2> {/* Tiêu đề thay đổi theo danh mục đang chọn  */}
                    </div>

                    <div className="card-grid"> {/* LƯỚI HIỂN THỊ CÁC CARD MÓN ĂN */}
                        {filteredFoods.length > 0 ? ( // Nếu có món ăn sau khi lọc
                            filteredFoods.map((food) => (  // Lặp qua danh sách món ăn đã lọc để hiển thị
                                <div 
                                    className="card" 
                                    key={food.id} 
                                    onClick={() => setSelectedFood(food)} // CHỨC NĂNG 3: MỞ MODAL
                                >
                                    <div className="img-box"> { /* Khung chứa ảnh */ }
                                        <img src={food.img} alt={food.title} /> {/* Ảnh món ăn */ }
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
            {selectedFood && ( //nếu có món ăn được chọn thì hiển thị modal
                <FoodDetailModal //hiển thị chi tiết món ăn
                    food={selectedFood}     //truyền món ăn được chọn vào modal 
                    onClose={() => setSelectedFood(null)} //hàm đóng modal,đặt món ăn được chọn về null(null:gtri trống-undefined:gtri k tồn tại)
                />
            )}
        </div>
    );
};

export default Blog;