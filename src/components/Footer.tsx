import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShieldCheck, Heart, ArrowUpLeft, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, categories, stores } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white">أقوى كود</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            منصة الكوبونات والعروض الأولى في المملكة العربية السعودية ودول مجلس التعاون الخليجي. نوفر لك أحدث أكواد الخصم والصفقات الحصرية الموثوقة لتوفير المال والوقت عند التسوق عبر الإنترنت.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="flex items-center gap-1 bg-slate-800 text-emerald-400 text-xs px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
              أكواد مضمونة 100%
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold text-sm mb-4 border-b border-slate-800 pb-2">روابط سريعة</h3>
          <ul className="space-y-2.5 text-xs font-medium">
            <li>
              <button onClick={() => setCurrentView('home')} className="hover:text-emerald-400 transition">الرئيسية</button>
            </li>
            <li>
              <button onClick={() => setCurrentView('stores')} className="hover:text-emerald-400 transition">جميع المتاجر ({stores.length})</button>
            </li>
            <li>
              <button onClick={() => setCurrentView('categories')} className="hover:text-emerald-400 transition">أقسام التسوق</button>
            </li>
            <li>
              <button onClick={() => setCurrentView('coupons')} className="hover:text-emerald-400 transition">أحدث الكوبونات</button>
            </li>
          </ul>
        </div>

        {/* Top Categories */}
        <div>
          <h3 className="text-white font-bold text-sm mb-4 border-b border-slate-800 pb-2">أبرز الأقسام</h3>
          <ul className="space-y-2.5 text-xs font-medium">
            {categories.slice(0, 5).map(cat => (
              <li key={cat.id}>
                <button onClick={() => setCurrentView('categories')} className="hover:text-emerald-400 transition">
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Support */}
        <div>
          <h3 className="text-white font-bold text-sm mb-4 border-b border-slate-800 pb-2">تواصل معنا والدعم</h3>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>support@aqwacode.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>+966 50 000 0000</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>الرياض، المملكة العربية السعودية</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 أقوى كود (AqwaCode). جميع الحقوق محفوظة.</p>
        <p className="flex items-center gap-1">
          صُنِع بكل <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> لمتسوقي السعودية والخليج
        </p>
      </div>
    </footer>
  );
};
