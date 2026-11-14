import React from 'react';
import { Store } from '../types';
import { useApp } from '../context/AppContext';
import { Tag, ArrowLeft } from 'lucide-react';

interface StoreCardProps {
  store: Store;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const { coupons, setActiveStoreId, setCurrentView } = useApp();
  const storeCoupons = coupons.filter(c => c.storeId === store.id && c.status === 'published');

  const handleClick = () => {
    setActiveStoreId(store.id);
    setCurrentView('store-detail');
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl p-2 flex items-center justify-center shadow-xs group-hover:scale-105 transition">
            <img 
              src={store.logo} 
              alt={store.name} 
              className="max-h-full max-w-full object-contain rounded-xl"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          </div>
          {store.isFeatured && (
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              مميز
            </span>
          )}
        </div>

        <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-emerald-600 transition">
          {store.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {store.shortDesc}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <span className="flex items-center gap-1.5 text-slate-600 font-semibold bg-slate-100 px-3 py-1.5 rounded-xl">
          <Tag className="w-3.5 h-3.5 text-emerald-600" />
          {storeCoupons.length} كوبون فعال
        </span>
        <span className="text-emerald-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
          تصفح العروض
          <ArrowLeft className="w-3.5 h-3.5" />
        </span>
      </div>

    </div>
  );
};
