import React from 'react';
import { Coupon, Store } from '../types';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Sparkles, Heart, Copy, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface CouponCardProps {
  coupon: Coupon;
  store: Store;
  onSelectCoupon: (coupon: Coupon, store: Store) => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({ coupon, store, onSelectCoupon }) => {
  const { favorites, toggleFavorite } = useApp();
  const isFav = favorites.includes(coupon.id);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Banner / Tags */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          
          {/* Store Logo & Name */}
          <button 
            onClick={() => onSelectCoupon(coupon, store)}
            className="flex items-center gap-2.5 text-right group/store"
          >
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl p-1.5 flex items-center justify-center shadow-xs group-hover/store:scale-105 transition">
              <img 
                src={store.logo} 
                alt={store.name} 
                className="max-h-full max-w-full object-contain"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm group-hover/store:text-emerald-600 transition">{store.name}</h4>
              <span className="text-[11px] text-slate-400">{coupon.successRate}% نسبة النجاح</span>
            </div>
          </button>

          {/* Badges */}
          <div className="flex items-center gap-1.5">
            {coupon.isVerified && (
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5" />
                مُجَرَّب
              </span>
            )}
            {coupon.isExclusive && (
              <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-200/60">
                <Sparkles className="w-3.5 h-3.5" />
                حصري
              </span>
            )}
            
            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(coupon.id)}
              className={`p-2 rounded-xl transition ${isFav ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400 hover:text-rose-500'}`}
              title="حفظ في المفضلة"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

        </div>

        {/* Title & Discount Value */}
        <h3 className="font-bold text-slate-800 text-base mb-2 line-clamp-2 leading-snug">
          {coupon.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-4">
          {coupon.description}
        </p>
      </div>

      {/* Footer / Code Reveal Button */}
      <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-3">
        
        {/* Discount Badge */}
        <div className="bg-emerald-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-xs">
          {coupon.discountValue}
        </div>

        {/* Action Reveal Code */}
        <button
          onClick={() => onSelectCoupon(coupon, store)}
          className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm group-hover:shadow"
        >
          <span>عرض الكوبون</span>
          <ArrowLeft className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
};
