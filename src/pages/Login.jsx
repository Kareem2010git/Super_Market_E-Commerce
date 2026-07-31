import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('admin_id', adminId)
        .maybeSingle();

      if (error) {
        console.error("Supabase Error Details:", error);
        throw new Error(error.message || 'خطأ في قاعدة البيانات');
      }

      if (!data) {
        throw new Error('المعرف غير موجود');
      }

      if (data.password_hash !== password) {
        throw new Error('كلمة المرور غير صحيحة');
      }

      setLoading(false);
      setSuccess(true);
      
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      toast.success('تم تسجيل الدخول بنجاح');

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);

    } catch (err) {
      console.error("Catch Error:", err);
      setLoading(false);
      toast.error(err.message || 'حدث خطأ في الاتصال');
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col justify-center items-center p-4 md:p-12 bg-[#f9f9ff] font-['Work_Sans',sans-serif] relative overflow-x-hidden text-[#151c27]">
      <ToastContainer position="bottom-left" autoClose={3000} rtl={true} />
      
      <div className="fixed top-0 left-0 w-full h-2 bg-[#facc15] opacity-50"></div>
      <div className="fixed -bottom-20 -right-20 w-64 h-64 bg-[#e2e8f8] rounded-full blur-3xl opacity-40"></div>
      <div className="fixed -top-20 -left-20 w-64 h-64 bg-[#eec200] rounded-full blur-3xl opacity-20"></div>

      <div className="absolute top-4 left-4 md:top-6 md:right-6">
        <Link to="/" className="flex items-center gap-2 text-[#4d4632] font-semibold text-sm hover:text-[#735c00] transition-colors">
          <span className="material-symbols-outlined">arrow_forward</span>
          <span>العودة للمتجر</span>
        </Link>
      </div>

      <main className="w-full max-w-[440px] flex flex-col items-center z-10">
        
        <div className="mb-8 flex flex-col items-center">
          <div className="w-32 h-32 mb-4 overflow-hidden rounded-md transition-all duration-300 hover:scale-105 shadow-sm">
            <img 
              alt="هايبر مكة" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLsFy-PUIvhGisW190yK_S7HWjp2Dm4GOprbtMJS7NstJVXYVew1YKQsM0O4eeeFkYaQkdsYOrD3QfQvkx_AANFGkE-2OcXoEnDpH4x9mD4cpsrtqR0BJuiMwEvrAoTQVriCb0egHLYpdFWsef_HVl0BeV5iUWSwkKGsI2ZrCsuvEbEsdY-FTv-U4Tyw_JnsySwmseC40nuaMayyvM8koZVIRoBYlPvp5ITYkJLO7rAFphJrmqTS7aVUCpzh" 
            />
          </div>
          <h1 className="text-2xl font-bold text-[#151c27] text-center tracking-tight font-['Be_Vietnam_Pro',sans-serif]">
            لوحة التحكم الإدارية
          </h1>
          <p className="text-sm text-[#4d4632] mt-1 text-center opacity-80">
            أهلاً بك في نظام إدارة هايبر مكة 
          </p>
        </div>

        <div className="w-full bg-white border border-gray-200 shadow-md rounded-xl p-6 md:p-8">
          
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[#151c27]" htmlFor="admin_id">
                المعرف الخاص بالمدير
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  id="admin_id" 
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="مثال: admin" 
                  required 
                  className="w-full h-12 px-4 pr-12 rounded-lg bg-[#f0f3ff] border border-[#d1c6ab] text-base transition-all focus:outline-none focus:border-[#facc15] focus:ring-2 focus:ring-[#facc15]/20"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#7f7660]">
                  badge
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[#151c27]" htmlFor="password">
                كلمة المرور
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                  className="w-full h-12 px-4 pr-12 rounded-lg bg-[#f0f3ff] border border-[#d1c6ab] text-base transition-all focus:outline-none focus:border-[#facc15] focus:ring-2 focus:ring-[#facc15]/20"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#7f7660]">
                  lock
                </span>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7f7660] hover:text-[#151c27] transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || success}
              className={`w-full h-14 rounded-lg flex items-center justify-center gap-2 font-bold text-lg transition-all shadow-sm ${
                success 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-[#facc15] text-[#6c5700] hover:brightness-105 active:scale-[0.98]'
              }`}
            >
              {loading && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
              {success && <span className="material-symbols-outlined">check_circle</span>}
              <span>{loading ? 'جارِ التحقق...' : success ? 'تم الدخول بنجاح' : 'تسجيل الدخول'}</span>
              {!loading && !success && <span className="material-symbols-outlined">login</span>}
            </button>

          </form>
        </div>

        <div className="mt-8 w-full flex flex-col items-center gap-1">
          <p className="text-xs text-[#4d4632] text-center opacity-60">
            © 2026 جميع الحقوق محفوظة لـ هايبر مكة.
          </p>
        </div>

      </main>
    </div>
  );
}