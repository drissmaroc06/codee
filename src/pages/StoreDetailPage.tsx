import React from 'react';
import { useApp } from '../context/AppContext';
import { CouponCard } from '../components/CouponCard';
import { Coupon, Store } from '../types';
import { Globe, ShieldCheck, Tag, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';

interface StoreDetailPageProps {
  onSelectCoupon: (coupon: Coupon, store: Store) => void;
}

export const StoreDetailPage: React.FC<StoreDetailPageProps> = ({ onSelectCoupon }) => {
  const { stores, coupons, activeStoreId, setCurrentView, logClick } = useApp();

  const store = stores.find(s => s.id === activeStoreId) || stores[0];
  const storeCoupons = coupons.filter(c => c.storeId === store.id && c.status === 'published');
  const expiredCoupons = coupons.filter(c => c.storeId === store.id && c.status === 'expired');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Back button */}
      <button
        onClick={() => setCurrentView('stores')}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600 transition"
      >
        <ArrowRight className="w-4 h-4" />
        العودة لجميع المتاجر
      </button>

      {/* Store Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-right">
          <div className="w-28 h-28 bg-slate-50 border border-slate-200 rounded-3xl p-4 flex items-center justify-center shadow-md">
            <img 
              src={store.logo} 
              alt={store.name} 
              className="max-h-full max-w-full object-contain rounded-xl"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{store.name}</h1>
              <span className="text-sm font-semibold text-slate-400">({store.nameEn})</span>
              {store.isFeatured && (
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                  متجر موصى به
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {store.fullDesc || store.shortDesc}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
                <Tag className="w-4 h-4" />
                {storeCoupons.length} كوبون وعرض فعال
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                تم التحقق اليوم
              </span>
            </div>
          </div>
        </div>

        <div>
          <a
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => logClick('', store.id, 'store_visit')}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition whitespace-nowrap"
          >
            <Globe className="w-4 h-4" />
            زيارة الموقع الرسمي
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Active Coupons Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          أكواد خصم وعروض {store.name} الفعالة
        </h2>

        {storeCoupons.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-base font-bold text-slate-700">لا توجد كوبونات فعالة حالياً لهذا المتجر</p>
            <p className="text-xs text-slate-500 mt-1">ترقب أحدث العروض قريباً أو تصفح المتاجر الأخرى.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeCoupons.map(coupon => (
              <CouponCard 
                key={coupon.id} 
                coupon={coupon} 
                store={store} 
                onSelectCoupon={onSelectCoupon} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Expired / Past Coupons */}
      {expiredCoupons.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-700">الكوبونات المنتهية سابقاً (للاطلاع)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
            {expiredCoupons.map(coupon => (
              <CouponCard 
                key={coupon.id} 
                coupon={coupon} 
                store={store} 
                onSelectCoupon={onSelectCoupon} 
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
