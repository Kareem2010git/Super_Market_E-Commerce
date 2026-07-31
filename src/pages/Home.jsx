import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroBg from '../assets/hero.jpeg';

export default function Home() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div dir="rtl" className="bg-[#f9f9ff] text-[#151c27] overflow-x-hidden font-sans">

      <main>
        {/* Hero Section */}
        <section className="relative w-full min-h-[550px] md:min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div 
              className="w-full h-full bg-cover bg-center brightness-75" 
              style={{ backgroundImage: `url(${heroBg})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-l from-[#151c27]/80 to-transparent"></div>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 text-right">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
                كل اللي بيتك محتاجه في مكان واحد..<br />
                <span className="text-[#facc15]">طازة و يوصل لحد عندك</span>
              </h1>
              <p className="text-base md:text-lg text-[#f0f3ff] mb-6 max-w-lg opacity-90">
                من أول الخضار والفاكهة لحد المنظفات والمعلبات.. كل طلباتك بتجيلك في أسرع وقت وبأعلى جودة من هايبر مكة.
              </p>
              <div className="flex flex-col sm:flex-row-reverse gap-3">
                <button 
                  onClick={() => navigate('/products')}
                  className="bg-[#facc15] text-[#6c5700] px-6 py-3 rounded-xl font-bold text-base md:text-lg shadow-md hover:saturate-150 transition-all active:scale-95 cursor-pointer"
                >
                  اشتري دلوقتي
                </button>
                <button 
                  onClick={() => navigate('/sales')}
                  className="bg-white/15 backdrop-blur-md text-white border border-white/30 px-6 py-3 rounded-xl font-bold text-base md:text-lg hover:bg-white/25 transition-all active:scale-95 cursor-pointer"
                >
                  شوف العروض
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-20 bg-[#f9f9ff]">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#151c27] mb-2">لماذا تختار هايبر مكة</h2>
              <div className="w-20 h-1 bg-[#735c00] mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Freshness Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#d1c6ab] hover:shadow-md transition-shadow group text-center">
                <div className="w-16 h-16 bg-[#facc15]/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#735c00] text-3xl">eco</span>
                </div>
                <h3 className="text-lg font-bold text-[#151c27] mb-2">جودة مضمونة</h3>
                <p className="text-sm md:text-base text-[#4d4632]">نحضر لكم الخضروات والفواكه يومياً من مزارع محلية موثوقة لضمان أعلى مستويات الجودة.</p>
              </div>

              {/* Fast Delivery Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#d1c6ab] hover:shadow-md transition-shadow group text-center">
                <div className="w-16 h-16 bg-[#d9dff5] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#5c6274] text-3xl">local_shipping</span>
                </div>
                <h3 className="text-lg font-bold text-[#151c27] mb-2">توصيل سريع</h3>
                <p className="text-sm md:text-base text-[#4d4632]">نصل اليكم في أسرع وقت ممكن مع أعلى جودة نقل  لمشترايتكم</p>
              </div>

              {/* Best Prices Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#d1c6ab] hover:shadow-md transition-shadow group text-center">
                <div className="w-16 h-16 bg-[#e2e8f8] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#735c00] text-3xl">sell</span>
                </div>
                <h3 className="text-lg font-bold text-[#151c27] mb-2">أفضل الأسعار</h3>
                <p className="text-sm md:text-base text-[#4d4632]">عروضنا لا تنتهي! نوفر لكم أجود المنتجات بأسعار تنافسية تناسب ميزانية كل أسرة في  طنطا .</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories Bento Grid */}
        <section className="py-16 md:py-20 bg-[#f0f3ff]">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
              <div className="text-right">
                <h2 className="text-2xl md:text-3xl font-bold text-[#151c27] mb-2">أقسامنا المميزة</h2>
                <p className="text-sm md:text-base text-[#4d4632]">استكشف تشكيلتنا الواسعة في هايبر مكة</p>
              </div>
              <button onClick={() => navigate('/products')} className="text-[#735c00] font-bold hover:underline cursor-pointer">عرض الكل</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:auto-rows-[250px]">
              
              {/* Vegetables */}
              <div 
                onClick={() => handleCategoryClick('خضروات')}
                className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group min-h-[250px] cursor-pointer shadow-sm hover:shadow-md transition-all"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDY_Vj7olMkwCPGViAUptpWhc6hdtkaLijVPDKqSrRvoQgoSUnyguWQ11yHMz6vcZj0YD3uZQijwOypm00JOZZT9SUeZ8TIboabzm77qZ3XKORj5ewtfryro0Df4nYZA2pnGQzq2p48C33fJUtycJyn7YdLTGwKuJvFNcVYFHv5VUMLAUxvHAcOLOOuPSQ3721U4YwRmz0eGNbONUr9O7CYrS1J43JIW6vBP4ACLJ3C5rIEcgWSbg5iiw')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 right-0 p-6 text-right">
                  <h3 className="text-white text-lg md:text-xl font-bold mb-1">خضروات فريش</h3>
                  <p className="text-white/80 text-sm mb-3">من المزارع لبيتك مباشر</p>
                  <span className="inline-block bg-[#facc15] text-[#6c5700] px-4 py-2 rounded-full font-bold text-sm">تسوق الآن</span>
                </div>
              </div>

              {/* Meat */}
              <div 
                onClick={() => handleCategoryClick('لحوم')}
                className="md:col-span-2 relative rounded-xl overflow-hidden group min-h-[220px] cursor-pointer shadow-sm hover:shadow-md transition-all"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZCJWDAeB3m3CoLjIMJDdiCq-ehTI54mQThHyZP2_gT6RQRoDGhZGjL0ZllQ8X2QpYvla5V9a5Wxd_ujN2TW0pt9A6SqdnNhq0FYETpYmOZTX_H_vkFk_UFPR_WW7LJMiCRXIeZ_9Qtk6pzf4VcoePBfMb-gNA7holEEvR7ygsGTOKbHCITO_TK9bsDtryQbkxFmRZwem-lm3wBhZUzZK6EP6Dvx4M_Ard5-SU3zHQNuEbCIuR6HZGJA')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 right-0 p-5 text-right">
                  <h3 className="text-white text-lg font-bold">اللحوم والدواجن</h3>
                </div>
              </div>

              {/* Dairy */}
              <div 
                onClick={() => handleCategoryClick('ألبان')}
                className="relative rounded-xl overflow-hidden group min-h-[220px] cursor-pointer shadow-sm hover:shadow-md transition-all"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCyj1wJb7yfgR0SUajfQZra_HArcfGpNkN7e1ZijHKCO40TG91vIzASkefu-oGRXH9wOULJph1Rq4PqkwdBpD7r4Tw_HebYGP_pcL88bmzWWeZRvo4LnnrObCWhrwMGl2dkz4MZBdXGk9F2JbjCHnqmstU2lXtQ4C809mZ9Jf3QypyLMlnM0IgjSqRmirF7cahImvhVlz-c2mZqSfJ12bvzYsLYXNZgxnKYZJs_qlR6UpU18maAdvQoTg')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 right-0 p-5 text-right">
                  <h3 className="text-white text-lg font-bold">الألبان والأجبان</h3>
                </div>
              </div>

              {/* Fruits */}
              <div 
                onClick={() => handleCategoryClick('فواكه')}
                className="relative rounded-xl overflow-hidden group min-h-[220px] cursor-pointer shadow-sm hover:shadow-md transition-all"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUVnh_PXWpbbxlh00W8e6ErcciuwSkmepVnXjD3UMYIM4pXFtIdD_xV6pE6pIR8aT16v2wzQeUOVXl25eEUhina1MdEJsaE0NPiU2-039T9rzh6Nr8ymDj7qwHjsJEK1YYr9tElSOshkfnwnNr_k_07KjWUbLLiS1ml-F8APUzUPPESUkCBL_GKn5rTMD2XlAduz5dvSgh0psykneGxLTibH0CWhF-fHyfLc9wQFan36K6brShJCGfjw')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 right-0 p-5 text-right">
                  <h3 className="text-white text-lg font-bold">الفواكه الموسمية</h3>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Location & Contact Map Section */}
        <section className="py-16 md:py-20 bg-[#f9f9ff]">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-[#151c27] mb-2">موقعنا على الخريطة</h2>
              <p className="text-sm md:text-base text-[#4d4632]">تفضل بزيارة فرعنا أو اطلب أينما كنت</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-[#d1c6ab] flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#151c27] mb-4 text-right">تواصل معنا مباشرة</h3>
                  <p className="text-sm text-[#4d4632] mb-6 text-right">يسعدنا تلقي طلباتكم واستفساراتكم عبر قنوات التواصل الاجتماعي وخدمة العملاء:</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <a 
                    href="https://wa.me/0201558006989" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#151c27] transition-all font-semibold"
                  >
                    <span className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center text-lg font-bold">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </span>
                    <div className="text-right flex-1">
                      <span className="block text-xs text-[#4d4632]">للشكاوي و الاستفسارات</span>
                      <span className="text-sm font-bold text-[#151c27]">راسلنا الآن</span>
                    </div>
                  </a>

                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#151c27] transition-all font-semibold"
                  >
                    <span className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-lg font-bold">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </span>
                    <div className="text-right flex-1">
                      <span className="block text-xs text-[#4d4632]">تابعنا على فيسبوك</span>
                      <span className="text-sm font-bold text-[#151c27]">Hyper Makkah</span>
                    </div>
                  </a>

                  <a 
                    href="https://tiktok.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-black/5 hover:bg-black/10 border border-black/20 text-[#151c27] transition-all font-semibold"
                  >
                    <span className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </span>
                    <div className="text-right flex-1">
                      <span className="block text-xs text-[#4d4632]">تابعنا على تيك توك</span>
                      <span className="text-sm font-bold text-[#151c27]">@hyper.makkah</span>
                    </div>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-2 w-full h-[400px] md:h-[450px] rounded-xl overflow-hidden shadow-md relative border border-[#d1c6ab]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3427.1580808523363!2d30.987411899999998!3d30.798200899999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f7cb8caa145c17%3A0x751be45e6cc886b7!2s2YfYp9mK2KjYsSDZhdin2LHZg9iqINmF2YPZhyDYp9mE2YXZg9ix2YXYqQ!5e0!3m2!1sen!2seg!4v1785473747141!5m2!1sen!2seg" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#dce2f3] border-t border-[#d1c6ab]">
        <div className="py-4 px-4 md:px-6 text-center">
          <p className="text-sm text-[#4d4632]">© 2026 هايبر مكة. جميع الحقوق محفوظة.</p>
        </div>
      </footer>

    </div>
  );
}