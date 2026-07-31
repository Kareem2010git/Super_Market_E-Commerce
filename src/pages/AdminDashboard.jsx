import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../assets/logo.png';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('تمور');
  const [productPrice, setProductPrice] = useState('');
  const [quantityType, setQuantityType] = useState('piece'); 
  const [productImage, setProductImage] = useState(null);
  const [uploadingProduct, setUploadingProduct] = useState(false);

  const [offerTitle, setOfferTitle] = useState('');
  const [offerDiscount, setOfferDiscount] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [offerEndDate, setOfferEndDate] = useState('');
  const [offerImage, setOfferImage] = useState(null);
  const [uploadingOffer, setUploadingOffer] = useState(false);

  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAdminAuthenticated');
    if (!authStatus) {
      navigate('/login', { replace: true });
    } else {
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (prodError) throw prodError;
      setProducts(prodData || []);

      const { data: offData, error: offError } = await supabase
        .from('offers')
        .select('*')
        .order('id', { ascending: false });

      if (offError) throw offError;
      setOffers(offData || []);

    } catch (error) {
      console.error('خطأ أثناء جلب البيانات:', error.message);
      toast.error('حدث خطأ أثناء جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    toast.info('تم تسجيل الخروج بنجاح');
    navigate('/login', { replace: true });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setUploadingProduct(true);

    try {
      let imageUrl = null;

      if (productImage) {
        const fileExt = productImage.name.split('.').pop();
        const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('items_imgs')
          .upload(fileName, productImage);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('items_imgs')
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      const isWeightable = quantityType === 'weighted';

      const { error: insertError } = await supabase
        .from('products')
        .insert([{
          name: productName,
          category: productCategory,
          price: parseFloat(productPrice),
          is_weightable: isWeightable,
          image_url: imageUrl,
        }]);

      if (insertError) throw insertError;

      toast.success("تم رفع الصورة وإضافة المنتج بنجاح!");
      setProductName('');
      setProductPrice('');
      setQuantityType('piece');
      setProductImage(null);
      fetchData();
    } catch (error) {
      console.error("خطأ أثناء حفظ المنتج:", error.message);
      toast.error("حدث خطأ أثناء رفع المنتج.");
    } finally {
      setUploadingProduct(false);
    }
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    setUploadingOffer(true);

    try {
      let bannerUrl = null;

      if (offerImage) {
        const fileExt = offerImage.name.split('.').pop();
        const fileName = `offer_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('items_imgs')
          .upload(fileName, offerImage);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('items_imgs')
          .getPublicUrl(fileName);

        bannerUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('offers')
        .insert([{
          title: offerTitle,
          discount_text: offerDiscount,
          price: offerPrice ? parseFloat(offerPrice) : null,
          end_date: offerEndDate,
          banner_url: bannerUrl,
        }]);

      if (insertError) throw insertError;

      toast.success("تم رفع بانر العرض ونشره بنجاح!");
      setOfferTitle('');
      setOfferDiscount('');
      setOfferPrice('');
      setOfferEndDate('');
      setOfferImage(null);
      fetchData();
    } catch (error) {
      console.error("خطأ أثناء حفظ العرض:", error.message);
      toast.error("حدث خطأ أثناء نشر العرض.");
    } finally {
      setUploadingOffer(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
      const productToDelete = products.find(p => p.id === id);
      if (productToDelete && productToDelete.image_url) {
        const fileName = productToDelete.image_url.split('/').pop();
        await supabase.storage.from('items_imgs').remove([fileName]);
      }

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
      toast.success("تم حذف المنتج بنجاح");
    } catch (error) {
      console.error('خطأ أثناء الحذف:', error.message);
      toast.error("تعذر حذف المنتج.");
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا العرض؟")) return;

    try {
      const offerToDelete = offers.find(o => o.id === id);
      if (offerToDelete && offerToDelete.banner_url) {
        const fileName = offerToDelete.banner_url.split('/').pop();
        await supabase.storage.from('items_imgs').remove([fileName]);
      }

      const { error } = await supabase.from('offers').delete().eq('id', id);
      if (error) throw error;
      setOffers(offers.filter(o => o.id !== id));
      toast.success("تم حذف العرض بنجاح");
    } catch (error) {
      console.error('خطأ أثناء الحذف:', error.message);
      toast.error("تعذر حذف العرض.");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      let imageUrl = editingProduct.image_url;

      if (editingProduct.newImage) {
        const fileExt = editingProduct.newImage.name.split('.').pop();
        const fileName = `product_update_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('items_imgs')
          .upload(fileName, editingProduct.newImage);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('items_imgs')
          .getPublicUrl(fileName);

        const oldImageUrl = imageUrl;
        imageUrl = urlData.publicUrl;

        if (oldImageUrl) {
          const oldFileName = oldImageUrl.split('/').pop();
          await supabase.storage.from('items_imgs').remove([oldFileName]);
        }
      }

      const { error } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          category: editingProduct.category,
          price: parseFloat(editingProduct.price),
          is_weightable: editingProduct.is_weightable,
          image_url: imageUrl
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      toast.success("تم تحديث بيانات المنتج وصورة الغلاف بنجاح!");
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      console.error("خطأ أثناء التحديث:", error.message);
      toast.error("حدث خطأ أثناء تعديل المنتج.");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateOffer = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      let bannerUrl = editingOffer.banner_url;

      if (editingOffer.newBanner) {
        const fileExt = editingOffer.newBanner.name.split('.').pop();
        const fileName = `offer_update_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('items_imgs')
          .upload(fileName, editingOffer.newBanner);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('items_imgs')
          .getPublicUrl(fileName);

        const oldBannerUrl = bannerUrl;
        bannerUrl = urlData.publicUrl;

        if (oldBannerUrl) {
          const oldFileName = oldBannerUrl.split('/').pop();
          await supabase.storage.from('items_imgs').remove([oldFileName]);
        }
      }

      const { error } = await supabase
        .from('offers')
        .update({
          title: editingOffer.title,
          discount_text: editingOffer.discount_text,
          price: editingOffer.price ? parseFloat(editingOffer.price) : null,
          end_date: editingOffer.end_date,
          banner_url: bannerUrl
        })
        .eq('id', editingOffer.id);

      if (error) throw error;

      toast.success("تم تحديث بيانات العرض والبانر بنجاح!");
      setEditingOffer(null);
      fetchData();
    } catch (error) {
      console.error("خطأ أثناء التحديث:", error.message);
      toast.error("حدث خطأ أثناء تعديل العرض.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div dir="rtl" className="flex min-h-screen bg-surface text-on-surface">
      <ToastContainer position="bottom-left" autoClose={3000} rtl={true} />
      
      <aside className="hidden lg:flex h-screen w-64 fixed right-0 top-0 bg-surface-container border-l border-outline-variant shadow-md z-50 flex-col justify-between">
        <div>
          <div className="p-6 flex flex-col items-center gap-2 border-b border-outline-variant">
            <div className="w-20 h-20 overflow-hidden mb-2">
              <img 
                alt="Hyper Mecca Logo" 
                className="w-full h-full object-contain" 
                src={Logo} 
              />
            </div>
            <h2 className="text-xl font-bold text-on-surface">لوحة الإدارة</h2>
            <p className="text-sm text-on-surface-variant">مدير هايبر مكة</p>
          </div>

          <nav className="mt-4 flex-grow space-y-1 px-2">
            <div className="flex items-center gap-3 p-3 cursor-pointer bg-primary-container text-on-primary-container rounded-xl shadow-sm font-bold">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              <span className="text-sm">إدارة المنتجات والعروض</span>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-outline-variant flex flex-col gap-3">
          <button 
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-bold text-sm"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>تسجيل الخروج</span>
          </button>
          <div className="text-center">
            <span className="text-lg font-bold text-primary">هايبر مكة</span>
          </div>
        </div>
      </aside>

      <main className="flex-grow w-full lg:mr-64 p-4 md:p-6 transition-all duration-300">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-1">إدارة المنتجات والعروض</h1>
            <p className="text-sm md:text-base text-on-surface-variant">أضف، عدل، وتحكم في منتجات وعروض متجرك بكل سهولة.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="lg:hidden py-2 px-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2 font-bold text-sm"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>تسجيل الخروج</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          <section className="lg:col-span-6 bg-white border border-outline-variant rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
              <span className="material-symbols-outlined text-primary">add_box</span>
              <h2 className="text-lg md:text-xl font-bold text-on-surface">إضافة منتج جديد</h2>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-on-surface-variant px-1 font-semibold">اسم المنتج</label>
                <input 
                  type="text" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="مثال: تمر سكري فاخر" 
                  required
                  className="w-full rounded-xl border border-outline-variant focus:border-primary px-4 py-2.5 text-sm outline-none bg-surface" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-on-surface-variant px-1 font-semibold">الفئة</label>
                  <select 
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant px-4 py-2.5 text-sm outline-none bg-surface"
                  >
                    <option value="تمور">تمور</option>
                    <option value="فواكه">فواكه</option>
                    <option value="خضروات">خضروات</option>
                    <option value="ألبان">ألبان</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-on-surface-variant px-1 font-semibold">السعر (ج.م)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="0.00" 
                    required
                    className="w-full rounded-xl border border-outline-variant px-4 py-2.5 text-sm outline-none bg-surface" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-on-surface-variant px-1 font-semibold">نوع الكمية</label>
                <select 
                  value={quantityType}
                  onChange={(e) => setQuantityType(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant px-4 py-2.5 text-sm outline-none bg-surface font-medium"
                >
                  <option value="piece">قطعة (ثابت)</option>
                  <option value="weighted">موزون (بالوزن/الكمية في السلة)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-on-surface-variant px-1 font-semibold">صورة المنتج</label>
                <label className="border-2 border-dashed border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-secondary text-3xl">cloud_upload</span>
                  <span className="text-xs text-on-surface-variant text-center">
                    {productImage ? productImage.name : "انقر هنا لاختيار صورة المنتج"}
                  </span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setProductImage(e.target.files[0])}
                    className="hidden" 
                  />
                </label>
              </div>

              <button 
                type="submit" 
                disabled={uploadingProduct}
                className="w-full mt-2 py-3 rounded-xl bg-slate-900 text-white font-bold text-base shadow-md hover:opacity-90 transition-all disabled:opacity-50"
              >
                {uploadingProduct ? "جاري الرفع والحفظ..." : "حفظ المنتج الجديد"}
              </button>
            </form>
          </section>

          <section className="lg:col-span-6 bg-white border border-outline-variant rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
              <span className="material-symbols-outlined text-primary">local_offer</span>
              <h2 className="text-lg md:text-xl font-bold text-on-surface">إضافة عرض جديد</h2>
            </div>
            
            <form onSubmit={handleAddOffer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-on-surface-variant px-1 font-semibold">عنوان العرض</label>
                <input 
                  type="text" 
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  placeholder="مثال: عروض نهاية الأسبوع الكبرى" 
                  required
                  className="w-full rounded-xl border border-outline-variant px-4 py-2.5 text-sm outline-none bg-surface" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-on-surface-variant px-1 font-semibold">نسبة الخصم / التفاصيل</label>
                  <input 
                    type="text" 
                    value={offerDiscount}
                    onChange={(e) => setOfferDiscount(e.target.value)}
                    placeholder="مثال: خصم 20%" 
                    required
                    className="w-full rounded-xl border border-outline-variant px-4 py-2.5 text-sm outline-none bg-surface" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-on-surface-variant px-1 font-semibold">سعر العرض (ج.م)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="0.00" 
                    className="w-full rounded-xl border border-outline-variant px-4 py-2.5 text-sm outline-none bg-surface" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-on-surface-variant px-1 font-semibold">تاريخ انتهاء العرض</label>
                <input 
                  type="date" 
                  value={offerEndDate}
                  onChange={(e) => setOfferEndDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-outline-variant px-4 py-2.5 text-sm outline-none bg-surface" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-on-surface-variant px-1 font-semibold">بانر أو صورة العرض</label>
                <label className="border-2 border-dashed border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-secondary text-3xl">add_photo_alternate</span>
                  <span className="text-xs text-on-surface-variant text-center">
                    {offerImage ? offerImage.name : "انقر هنا لاختيار صورة البانر"}
                  </span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setOfferImage(e.target.files[0])}
                    className="hidden" 
                  />
                </label>
              </div>

              <button 
                type="submit" 
                disabled={uploadingOffer}
                className="w-full mt-2 py-3 rounded-xl bg-slate-900 text-white font-bold text-base shadow-md hover:opacity-90 transition-all disabled:opacity-50"
              >
                {uploadingOffer ? "جاري رفع البانر والنشر..." : "حفظ ونشر العرض"}
              </button>
            </form>
          </section>

          <section className="lg:col-span-12 bg-white border border-outline-variant rounded-2xl p-4 md:p-6 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-outline-variant pb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">format_list_bulleted</span>
                  <h2 className="text-lg md:text-xl font-bold text-on-surface">قائمة المنتجات (من قاعدة البيانات)</h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right min-w-[500px]">
                  <thead>
                    <tr className="text-on-surface-variant border-b border-outline-variant bg-surface-container-low text-xs md:text-sm font-semibold">
                      <th className="p-3">المعرف</th>
                      <th className="p-3">الصورة</th>
                      <th className="p-3">الاسم</th>
                      <th className="p-3">الفئة</th>
                      <th className="p-3">السعر</th>
                      <th className="p-3">نوع الكمية</th>
                      <th className="p-3 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant text-sm md:text-base">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="p-6 text-center text-on-surface-variant">جاري التحميل...</td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-6 text-center text-on-surface-variant">لا توجد منتجات مضافة حتى الآن.</td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="p-3 text-on-surface-variant">#{product.id}</td>
                          <td className="p-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden bg-surface border border-outline-variant">
                              {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">بدون</div>
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-bold text-on-surface">{product.name}</td>
                          <td className="p-3">
                            <span className="px-2.5 py-1 bg-surface-variant rounded-full text-xs font-medium text-on-surface">
                              {product.category || 'عام'}
                            </span>
                          </td>
                          <td className="p-3 text-primary font-bold">{product.price} ج.م</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.is_weightable ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                              {product.is_weightable ? 'موزون' : 'قطعة'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => setEditingProduct(product)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="تعديل المنتج"
                              >
                                <span className="material-symbols-outlined text-base">edit</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-error hover:bg-error-container rounded-full transition-colors"
                                title="حذف المنتج"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="lg:col-span-12 bg-white border border-outline-variant rounded-2xl p-4 md:p-6 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-outline-variant pb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">local_offer</span>
                  <h2 className="text-lg md:text-xl font-bold text-on-surface">قائمة العروض النشطة (من قاعدة البيانات)</h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right min-w-[500px]">
                  <thead>
                    <tr className="text-on-surface-variant border-b border-outline-variant bg-surface-container-low text-xs md:text-sm font-semibold">
                      <th className="p-3">المعرف</th>
                      <th className="p-3">البانر</th>
                      <th className="p-3">عنوان العرض</th>
                      <th className="p-3">نسبة الخصم / التفاصيل</th>
                      <th className="p-3">سعر العرض</th>
                      <th className="p-3">تاريخ الانتهاء</th>
                      <th className="p-3 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant text-sm md:text-base">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="p-6 text-center text-on-surface-variant">جاري التحميل...</td>
                      </tr>
                    ) : offers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-6 text-center text-on-surface-variant">لا توجد عروض مضافة حتى الآن.</td>
                      </tr>
                    ) : (
                      offers.map((offer) => (
                        <tr key={offer.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="p-3 text-on-surface-variant">#{offer.id}</td>
                          <td className="p-3">
                            <div className="w-12 h-10 md:w-16 md:h-12 rounded-xl overflow-hidden bg-surface border border-outline-variant">
                              {offer.banner_url ? (
                                <img src={offer.banner_url} alt={offer.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">بدون</div>
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-bold text-on-surface">{offer.title}</td>
                          <td className="p-3">
                            <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                              {offer.discount_text}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-primary">
                            {offer.price ? `${offer.price} ج.م` : 'غير محدد'}
                          </td>
                          <td className="p-3 text-on-surface-variant text-sm">{offer.end_date}</td>
                          <td className="p-3">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => setEditingOffer(offer)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="تعديل العرض"
                              >
                                <span className="material-symbols-outlined text-base">edit</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteOffer(offer.id)}
                                className="p-2 text-error hover:bg-error-container rounded-full transition-colors"
                                title="حذف العرض"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>
      </main>

      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-xl font-bold text-gray-900">تعديل المنتج: #{editingProduct.id}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">اسم المنتج</label>
                <input 
                  type="text" 
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 mt-1 text-sm outline-none focus:border-primary" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">الفئة</label>
                  <select 
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 mt-1 text-sm outline-none focus:border-primary"
                  >
                    <option value="تمور">تمور</option>
                    <option value="فواكه">فواكه</option>
                    <option value="خضروات">خضروات</option>
                    <option value="ألبان">ألبان</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">السعر (ج.م)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 mt-1 text-sm outline-none focus:border-primary" 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">نوع الكمية</label>
                <select 
                  value={editingProduct.is_weightable ? 'weighted' : 'piece'}
                  onChange={(e) => setEditingProduct({...editingProduct, is_weightable: e.target.value === 'weighted'})}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 mt-1 text-sm outline-none focus:border-primary"
                >
                  <option value="piece">قطعة (ثابت)</option>
                  <option value="weighted">موزون (بالوزن/الكمية في السلة)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">تغيير الصورة (اختياري)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setEditingProduct({...editingProduct, newImage: e.target.files[0]})}
                  className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" 
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  disabled={updating}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm hover:opacity-90 disabled:opacity-50"
                >
                  {updating ? "جاري التحديث..." : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingOffer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-xl font-bold text-gray-900">تعديل العرض: #{editingOffer.id}</h3>
              <button onClick={() => setEditingOffer(null)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateOffer} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">عنوان العرض</label>
                <input 
                  type="text" 
                  value={editingOffer.title}
                  onChange={(e) => setEditingOffer({...editingOffer, title: e.target.value})}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 mt-1 text-sm outline-none focus:border-primary" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">نسبة الخصم / التفاصيل</label>
                  <input 
                    type="text" 
                    value={editingOffer.discount_text}
                    onChange={(e) => setEditingOffer({...editingOffer, discount_text: e.target.value})}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 mt-1 text-sm outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">سعر العرض (ج.م)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={editingOffer.price || ''}
                    onChange={(e) => setEditingOffer({...editingOffer, price: e.target.value})}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 mt-1 text-sm outline-none focus:border-primary" 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">تاريخ انتهاء العرض</label>
                <input 
                  type="date" 
                  value={editingOffer.end_date}
                  onChange={(e) => setEditingOffer({...editingOffer, end_date: e.target.value})}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 mt-1 text-sm outline-none focus:border-primary" 
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">تغيير البانر (اختياري)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setEditingOffer({...editingOffer, newBanner: e.target.files[0]})}
                  className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" 
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setEditingOffer(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  disabled={updating}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm hover:opacity-90 disabled:opacity-50"
                >
                  {updating ? "جاري التحديث..." : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}