import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('خطأ أثناء جلب العروض:', error.message);
      toast.error('حدث خطأ أثناء جلب العروض');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimOffer = (offer) => {
    const savedCart = localStorage.getItem('cart');
    let cartItems = savedCart ? JSON.parse(savedCart) : [];

    const existingIndex = cartItems.findIndex(item => item.id === offer.id && item.is_offer);

    if (existingIndex > -1) {
      cartItems[existingIndex].quantity += 1;
    } else {
      cartItems.push({
        id: offer.id,
        name: offer.title,
        price: parseFloat(offer.price) || 0,
        quantity: 1,
        is_weightable: false,
        selectedWeight: 1,
        image: offer.banner_url || 'https://via.placeholder.com/150',
        is_offer: true
      });
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
    toast.success(`تمت إضافة العرض "${offer.title}" إلى السلة بنجاح!`);
  };

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
        <p className="text-lg font-bold">جاري تحميل العروض...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-surface p-4 md:p-8 text-on-surface">
      <ToastContainer position="bottom-left" autoClose={3000} rtl={true} />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center md:text-right">
          <h1 className="text-3xl font-bold text-center text-on-surface mb-2">عروض هايبر مكة</h1>
          <p className="text-on-surface-variant">استمتع بأقوى العروض والخصومات الحصرية المتاحة الآن.</p>
        </div>

        {offers.length === 0 ? (
          <div className="text-center py-16 bg-white border border-outline-variant rounded-2xl">
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">local_offer</span>
            <p className="text-on-surface-variant font-medium">لا توجد عروض مضافة في الوقت الحالي.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div 
                key={offer.id} 
                className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="w-full h-48 bg-surface-container relative overflow-hidden">
                  {offer.banner_url ? (
                    <img 
                      src={offer.banner_url} 
                      alt={offer.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="material-symbols-outlined text-4xl">image</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                    {offer.discount_text}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-on-surface mb-2">{offer.title}</h3>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant">
                      <div>
                        <span className="text-xs text-on-surface-variant block">سعر العرض</span>
                        <span className="text-lg font-bold text-primary">
                          {offer.price ? `${offer.price} ج.م` : 'حسب المتجر'}
                        </span>
                      </div>
                      <div className="text-left">
                        ينتهي في : <span className="text-xs font-semibold text-on-surface-variant">{offer.end_date || 'غير محدد'}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleClaimOffer(offer)}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm shadow hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">shopping_cart_checkout</span>
                    <span>استفد من العرض</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}