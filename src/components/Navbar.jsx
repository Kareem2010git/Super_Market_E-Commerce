import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.png';
export default function Navbar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    // دالة لحساب عدد العناصر الفريدة (عدد المنتجات المختلفة بغض النظر عن الكمية)
    const updateCartCount = () => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const items = JSON.parse(savedCart);
                // حساب عدد العناصر (الصفوف) في السلة
                setCartCount(Array.isArray(items) ? items.length : 0);
            } catch (e) {
                console.error('Error parsing cart:', e);
                setCartCount(0);
            }
        } else {
            setCartCount(0);
        }
    };

    useEffect(() => {
        // تحديث العدد عند تحميل الناف بار لأول مرة
        updateCartCount();

        // الاستماع لتحديثات التخزين المحلي في حال تغيرت السلة من صفحة أخرى
        window.addEventListener('storage', updateCartCount);

        // إنشاء مؤقت للتحقق من التحديثات لحظياً داخل نفس الصفحة دون الحاجة لريفريش
        const interval = setInterval(updateCartCount, 500);

        return () => {
            window.removeEventListener('storage', updateCartCount);
            clearInterval(interval);
        };
    }, []);

    const navItems = [
        { name: 'الرئيسية', path: '/' },
        { name: 'المنتجات', path: '/products' },
        { name: 'العروض و الخصومات', path: '/sales' }
        
    ];

    return (
        <header className="sticky top-0 z-50 bg-[#f9f9ff] border-b border-[#d1c6ab] shadow-sm" dir="rtl">
            <div className="flex flex-row-reverse justify-between items-center px-5 py-4 w-full max-w-[1280px] mx-auto">
                <div className="flex items-center gap-4">
                    <img
                        alt="هايبر مكة"
                        className="h-10 w-auto"
                        src={Logo}
                    />
                    <div className="font-['Be_Vietnam_Pro'] text-2xl font-bold text-[#735c00]">هايبر مكة</div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-base transition-colors ${isActive
                                        ? 'text-[#735c00] border-b-2 border-[#735c00] pb-1 font-medium'
                                        : 'text-[#4d4632] hover:text-[#735c00]'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        to="/cart"
                        className="scale-95 active:scale-90 transition-transform p-1 text-[#735c00] relative inline-flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined">shopping_cart</span>
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-[#ba1a1a] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-1 text-[#735c00] hover:bg-[#dce2f3] rounded-lg transition-colors flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#f9f9ff] border-t border-[#d1c6ab] px-5 py-4 flex flex-col gap-3 shadow-md animate-fadeIn">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-base py-2 px-3 rounded-lg transition-colors text-right ${isActive
                                        ? 'text-[#735c00] bg-[#dce2f3]/55 font-bold'
                                        : 'text-[#4d4632] hover:bg-[#dce2f3]/30 hover:text-[#735c00]'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            )}
        </header>
    );
}