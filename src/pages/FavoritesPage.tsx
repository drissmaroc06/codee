import React from 'react';
import { useApp } from '../context/AppContext';
import { CouponCard } from '../components/CouponCard';
import { Coupon, Store } from '../types';
import { Heart, ArrowLeft } from 'lucide-react';

interface FavoritesPageProps {
  onSelectCoupon: (coupon: Coupon, store: Store) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onSelectCoupon }) => {
  const { favorites, coupons, stores, setCurrentView } = useApp();

  const favoriteCoupons = coupons.filter(c => favorites.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 to-slate-900 text-white p-8 rounded-3xl shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
            الكوبونات المحفوظة والمفضلة ({favoriteCoupons.length})
          </h1>
          <p className="text-xs text-slate-300">جميع الكوبونات التي قمت بحفظها للرجوع إليها لاحقاً عند التسوق.</p>
        </div>
      </div>

      {favoriteCoupons.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">لا توجد كوبونات في المفضلة حالياً</h3>
          <p className="text-xs text-slate-500">قم بالنقر على أيقونة القلب بجانب أي كوبون لحفظه هنا.</p>
          <button
            onClick={() => setCurrentView('home')}
            className="px-6 py-3 bg-emerald-600 text-white text-xs font-bold rounded-2xl"
          >
            تصفح الكوبونات الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCoupons.map(coupon => {
            const store = stores.find(s => s.id === coupon.storeId) || stores[0];
            return (
              <CouponCard 
                key={coupon.id} 
                coupon={coupon} 
                store={store} 
                onSelectCoupon={onSelectCoupon} 
              />
            );
          })}
        </div>
      )}

    </div>
  );
};
