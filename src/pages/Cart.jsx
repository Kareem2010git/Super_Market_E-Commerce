import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CartPage() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart).map(item => ({
          ...item,
          selectedWeight: item.selectedWeight !== undefined ? item.selectedWeight : (item.is_weightable ? 1 : 1),
          quantity: item.quantity || 1
        }));
      } catch (e) {
        console.error('Error parsing cart data:', e);
      }
    }
    return [];
  });

  const [selectedPayment, setSelectedPayment] = useState('instapay');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (id, delta) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  const updateWeight = (id, weightValue) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          return { ...item, selectedWeight: parseFloat(weightValue) };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast.info('تم حذف المنتج من السلة');
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const multiplier = item.is_weightable ? (item.selectedWeight || 1) : item.quantity;
    return acc + (item.price * multiplier);
  }, 0);

  const deliveryFee = cartItems.length > 0 ? 15.00 : 0.00;
  const total = subtotal + deliveryFee;

  const paymentNames = {
    instapay: 'انستا باي (InstaPay)',
    vodafone: 'فودافون كاش (Vodafone Cash)',
    cash: 'الدفع عند الاستلام'
  };

  const getWeightLabel = (weight) => {
    switch (weight) {
      case 0.25: return 'ربع كيلو (250 جرام)';
      case 0.5: return 'نص كيلو (500 جرام)';
      case 0.75: return 'ثلاثة أرباع كيلو (750 جرام)';
      case 1: return '1 كيلو';
      case 1.5: return '1.5 كيلو';
      case 2: return '2 كيلو';
      case 3: return '3 كيلو';
      default: return `${weight} كيلو`;
    }
  };

  const handleCheckoutWhatsApp = () => {
    if (cartItems.length === 0) {
      toast.warn('السلة فارغة، يجيب إضافة منتجات أولاً');
      return;
    }

    const phoneNumber = "201063277506";

    let message = ` *طلب جديد من هايبر مكة*\n\n`;
    message += `قائمة الطلبات :\n`;

    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      if (item.is_weightable) {
        const currentWeight = item.selectedWeight || 1;
        const itemTotal = item.price * currentWeight;
        message += `   - الوزن: ${getWeightLabel(currentWeight)}\n`;
        message += `   - سعر الكيلو: ${item.price.toFixed(2)} ج.م\n`;
        message += `   - السعر : ${itemTotal.toFixed(2)} ج.م\n\n`;
      } else {
        const itemTotal = item.price * item.quantity;
        message += `   - الكمية: ${item.quantity}\n`;
        message += `   - السعر / الواحدة ${item.price.toFixed(2)} ج.م\n`;
        message += `   - الإجمالي: ${itemTotal.toFixed(2)} ج.م\n\n`;
      }
    });

    message += `------------------------\n`;
    message += `💰 *الإجمالي* ${subtotal.toFixed(2)} ج.م\n`;
    message += `🛵 *رسوم التوصيل:* ${deliveryFee.toFixed(2)} ج.م\n`;
    message += `الإجمالي بعد التوصيل : ${total.toFixed(2)} ج.م\n`;
    message += `💳 *طريقة الدفع:* ${paymentNames[selectedPayment]}\n\n`;
    message += `يرجى تأكيد الطلب وتجهيزه للتوصيل. شكراً لكم`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    toast.success('جاري تحويلك إلى الواتساب...');
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1000);
  };

  return (
    <div dir="rtl" className="bg-[#f9f9ff] text-[#151c27] min-h-screen font-['Cairo',sans-serif]">
      <ToastContainer position="bottom-left" autoClose={3000} rtl={true} />

      <main className="max-w-7xl mx-auto px-4 md:px-16 py-12">
        <h1 className="text-3xl font-bold mb-8 text-[#151c27]">سلة التسوق</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#d1c6ab] text-center shadow-sm">
            <span className="material-symbols-outlined text-6xl text-[#735c00] mb-4">shopping_cart_off</span>
            <h2 className="text-2xl font-bold text-[#151c27] mb-2">سلة التسوق فارغة</h2>
            <p className="text-[#4d4632] mb-6">لم تقم بإضافة أي منتجات إلى السلة حتى الآن.</p>
            <a
              href="/"
              className="inline-block bg-[#facc15] text-[#6c5700] font-bold px-8 py-3 rounded-xl shadow-sm hover:opacity-90 transition-all"
            >
              العودة للتسوق
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => {
                const currentMultiplier = item.is_weightable ? (item.selectedWeight || 1) : item.quantity;
                const itemTotalPrice = item.price * currentMultiplier;

                return (
                  <div key={item.id} className="bg-white p-4 border border-[#d1c6ab] rounded-2xl flex items-center gap-4 shadow-sm relative group">
                    <div className="w-24 h-24 bg-[#dce2f3] rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-[#151c27]">{item.name}</h3>
                      {item.is_weightable ? (
                        <p className="text-sm text-[#4d4632] mt-1">سعر الكيلو: <span className="text-[#735c00] font-semibold">{item.price.toFixed(2)} ج.م</span></p>
                      ) : (
                        <p className="text-sm text-[#4d4632] mt-1">السعر للوحدة: <span className="text-[#735c00] font-semibold">{item.price.toFixed(2)} ج.م</span></p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {item.is_weightable ? (
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-[#4d4632] font-semibold">الوزن:</label>
                          <select
                            value={item.selectedWeight || 1}
                            onChange={(e) => updateWeight(item.id, e.target.value)}
                            className=" border border-[#d1c6ab] rounded-lg px-3 py-1.5 text-sm bg-white font-medium text-[#151c27] focus:outline-none focus:border-[#735c00]"
                          >
                            <option value={0.25}>ربع كيلو (250ج)</option>
                            <option value={0.5}>نص كيلو (500ج)</option>
                            <option value={0.75}>ثلاثة أرباع (750ج)</option>
                            <option value={1}>1 كيلو</option>
                            <option value={1.5}>1.5 كيلو</option>
                            <option value={2}>2 كيلو</option>
                            <option value={3}>3 كيلو</option>
                          </select>
                        </div>
                      ) : (
                        <div className="flex items-center border border-[#d1c6ab] rounded-full overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center text-[#735c00] hover:bg-[#dce2f3] transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 font-bold text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#735c00] hover:bg-[#dce2f3] transition-colors"
                          >
                            +
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="حذف المنتج"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          حذف
                        </button>
                        <p className="font-bold text-[#151c27]">{itemTotalPrice.toFixed(2)} ج.م</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#e7eefe] p-6 rounded-2xl border border-[#d1c6ab] shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-[#151c27]">ملخص الطلب</h2>

                <div className="space-y-3 mb-6 border-b border-[#d1c6ab] pb-6 text-sm text-[#4d4632]">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي</span>
                    <span>{subtotal.toFixed(2)} ج.م</span>
                  </div>
                  <div className="flex justify-between">
                    <span>رسوم التوصيل</span>
                    <span>{deliveryFee.toFixed(2)} ج.م</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold text-lg text-[#151c27]">الإجمالي</span>
                  <span className="font-bold text-2xl text-[#735c00]">{total.toFixed(2)} ج.م</span>
                </div>

                <div className="mb-8">
                  <p className="text-sm font-bold text-[#151c27] mb-4">اختر طريقة الدفع</p>
                  <div className="space-y-3">
                    <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${selectedPayment === 'instapay' ? 'border-[#735c00] bg-white' : 'border-[#d1c6ab]'}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === 'instapay'}
                        onChange={() => setSelectedPayment('instapay')}
                        className="w-4 h-4 text-[#735c00] border-[#d1c6ab] ml-3"
                      />
                      <span className="flex-grow text-sm font-medium">انستا باي (InstaPay)</span>
                      <span className="material-symbols-outlined text-[#735c00]">account_balance_wallet</span>
                    </label>

                    <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${selectedPayment === 'vodafone' ? 'border-[#735c00] bg-white' : 'border-[#d1c6ab]'}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === 'vodafone'}
                        onChange={() => setSelectedPayment('vodafone')}
                        className="w-4 h-4 text-[#735c00] border-[#d1c6ab] ml-3"
                      />
                      <span className="flex-grow text-sm font-medium">فودافون كاش (Vodafone Cash)</span>
                      <span className="material-symbols-outlined text-red-600">phone_iphone</span>
                    </label>

                    <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${selectedPayment === 'cash' ? 'border-[#735c00] bg-white' : 'border-[#d1c6ab]'}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === 'cash'}
                        onChange={() => setSelectedPayment('cash')}
                        className="w-4 h-4 text-[#735c00] border-[#d1c6ab] ml-3"
                      />
                      <span className="flex-grow text-sm font-medium">الدفع عند الاستلام</span>
                      <span className="material-symbols-outlined text-[#151c27]">payments</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full bg-[#facc15] text-[#6c5700] font-bold py-4 rounded-xl text-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>إتمام الطلب </span>
                </button>

                <p className="text-center text-xs text-[#4d4632] mt-4">بضغطك على إتمام الطلب، سيتم تحويلك مباشرة للواتساب لإرسال تفاصيل طلبك ، من فضلك قم بارفاق بيانات التوصيل بعد رسالة الطلب لتسريع الطلب .</p>
              </div>
            </div>

          </div>
        )}
      </main>

      <footer className="bg-[#e2e8f8] border-t border-[#d1c6ab] mt-20 py-6 text-center text-sm text-[#4d4632]">
        جميع الحقوق محفوظة &copy; 2026 هايبر مكة
      </footer>
    </div>
  );
}