import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('الكل');
    }
  }, [categoryParam]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('خطأ أثناء جلب المنتجات:', error.message);
      toast.error('حدث خطأ أثناء جلب المنتجات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'الكل') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  const addToCart = (product) => {
    const savedCart = localStorage.getItem('cart');
    let cartItems = savedCart ? JSON.parse(savedCart) : [];

    const existingIndex = cartItems.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      cartItems[existingIndex].quantity += 1;
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        quantity: 1,
        is_weightable: product.is_weightable,
        selectedWeight: product.is_weightable ? 1 : 1,
        image: product.image_url || 'https://via.placeholder.com/150'
      });
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
    toast.success(`تمت إضافة "${product.name}" إلى السلة بنجاح!`);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = selectedCategory === 'الكل' || product.category === selectedCategory;
    if (!matchesCategory && selectedCategory === 'لحوم' && product.category?.includes('لحوم')) {
      matchesCategory = true;
    }

    const matchesPrice = parseFloat(product.price || 0) <= parseFloat(maxPrice);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12">
      <ToastContainer position="bottom-left" autoClose={3000} rtl={true} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

        <aside className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">الأقسام</h3>
            <ul className="space-y-3 text-sm">
              {['الكل', 'خضروات', 'فواكه', 'لحوم', 'ألبان', 'المعلبات', 'تمور'].map((category) => (
                <li key={category}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="categoryFilter"
                      checked={selectedCategory === category}
                      onChange={() => handleCategoryChange(category)}
                      className="accent-amber-600 w-4 h-4 cursor-pointer"
                    />
                    <span className="capitalize">{category}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">نطاق السعر</h3>
            <input
              type="range"
              min="0"
              max="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0 ج.م</span>
              <span>{maxPrice} ج.م</span>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-3 space-y-6">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedCategory === 'الكل' ? 'تسوق جميع المنتجات' : `منتجات قسم: ${selectedCategory}`}
            </h2>
            <div className="relative w-full md:w-96">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث عن منتج..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium text-sm">جاري تحميل المنتجات ، برجاء الإنتظار ...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-500">
              لا توجد منتجات مطابقة لخيارات البحث أو الفلترة الحالية.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                      ) : (
                        <span className="text-xs text-gray-400">لا توجد صورة</span>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-xs text-amber-600 font-semibold">{product.category}</span>
                      <h3 className="font-bold text-gray-900 text-base">{product.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {product.is_weightable ? 'يباع بالكيلو (وزني)' : (product.quantity_type || 'قطعة / واحدة')}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 pt-0 flex items-center justify-between mt-4">
                    <span className="font-bold text-amber-700 text-lg">
                      {product.price} <span className="text-xs">{product.is_weightable ? 'ج.م / للكيلو' : 'ج.م'}</span>
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span>أضف للسلة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>

      </div>
    </div>
  );
}