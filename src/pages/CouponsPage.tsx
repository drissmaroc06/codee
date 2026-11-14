import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CouponCard } from '../components/CouponCard';
import { Coupon, Store } from '../types';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface CouponsPageProps {
  onSelectCoupon: (coupon: Coupon, store: Store) => void;
}

export const CouponsPage: React.FC<CouponsPageProps> = ({ onSelectCoupon }) => {
  const { coupons, stores } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'verified' | 'exclusive'>('all');
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const filtered = coupons.filter(coupon => {
    if (coupon.status !== 'published') return false;
    if (filterType === 'verified' && !coupon.isVerified) return false;
    if (filterType === 'exclusive' && !coupon.isExclusive) return false;

    if (query.trim()) {
      const store = stores.find(s => s.id === coupon.storeId);
      return coupon.title.toLowerCase().includes(query.toLowerCase()) || 
             coupon.code.toLowerCase().includes(query.toLowerCase()) ||
             store?.name.toLowerCase().includes(query.toLowerCase());
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedCoupons = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black mb-2">أحدث الكوبونات والعروض الفعالة</h1>
          <p className="text-xs text-slate-300">جميع الأكواد مجربة وتعمل بفاعلية تامة مع تحديثات يومية مستمرة.</p>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن كود أو متجر..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
              className="w-full md:w-80 pl-4 pr-10 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs text-white placeholder-slate-300 outline-none focus:bg-white focus:text-slate-900 transition"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setFilterType('all'); setCurrentPage(1); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            filterType === 'all' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          كل الكوبونات ({coupons.length})
        </button>
        <button
          onClick={() => { setFilterType('verified'); setCurrentPage(1); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            filterType === 'verified' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          الموثوقة والمجربة
        </button>
        <button
          onClick={() => { setFilterType('exclusive'); setCurrentPage(1); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            filterType === 'exclusive' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          العروض الحصرية
        </button>
      </div>

      {/* Coupons Grid */}
      {paginatedCoupons.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-base font-bold text-slate-700">لا توجد كوبونات مطابقة للبحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCoupons.map(coupon => {
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-40 hover:bg-slate-50 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-bold px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl">
            الصفحة {currentPage} من {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-40 hover:bg-slate-50 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
