import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StoreCard } from '../components/StoreCard';
import { CouponCard } from '../components/CouponCard';
import { Store, Coupon } from '../types';
import { Search, Tag, ShieldCheck, Zap, TrendingUp, Award, ArrowLeft, CheckCircle } from 'lucide-react';

interface HomeProps {
  onSelectCoupon: (coupon: Coupon, store: Store) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectCoupon, searchQuery, setSearchQuery }) => {
  const { stores, coupons, categories, setCurrentView, setActiveStoreId, importReport } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'exclusive' | 'codes'>('all');

  const filteredCoupons = coupons.filter(coupon => {
    if (coupon.status !== 'published') return false;
    
    if (activeTab === 'verified' && !coupon.isVerified) return false;
    if (activeTab === 'exclusive' && !coupon.isExclusive) return false;
    if (activeTab === 'codes' && coupon.offerType !== 'discount_code') return false;

    if (searchQuery.trim()) {
      const store = stores.find(s => s.id === coupon.storeId);
      const matchTitle = coupon.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCode = coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStore = store?.name.toLowerCase().includes(searchQuery.toLowerCase()) || store?.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTitle || matchCode || matchStore;
    }

    return true;
  });

  const featuredStores = stores.filter(s => s.isFeatured);
  const featuredCoupons = coupons.filter(c => c.isFeatured && c.status === 'published');

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white py-20 px-4 rounded-3xl mx-4 sm:mx-6 mt-6 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-full text-emerald-400 text-xs font-bold animate-pulse">
            <Tag className="w-4 h-4" />
            أحدث أكواد خصم وعروض السعودية والخليج لعام 2026
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            وفّر مالك مع <span className="text-emerald-400 underline decoration-emerald-500/40">أقوى كود خصم</span> وحصري
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            آلاف الكوبونات المحدثة يومياً لأشهر المتاجر العالمية والمحلية: نمشي، جرير، سيفورا، نون، والمزيد برمز خصم مضمون.
          </p>

          {/* Hero Search Box */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="bg-white p-2 rounded-2xl shadow-xl flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="ابحث عن متجر (مثل: نمشي) أو كود خصم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-3 px-2 text-slate-800 text-sm outline-none bg-transparent"
              />
              <button 
                onClick={() => setCurrentView('stores')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition shadow-md"
              >
                بحث العروض
              </button>
            </div>
          </div>

          {/* Trust stats */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-300 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>+600 متجر معتمد</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>تحديث يومي فوري</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              <span>نسبة نجاح 98%</span>
            </div>
          </div>

        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">أقسام التسوق الرئيسية</h2>
            <p className="text-xs text-slate-500 mt-1">تصفح الكوبونات حسب التصنيف والاهتمامات</p>
          </div>
          <button 
            onClick={() => setCurrentView('categories')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            عرض الكل ({categories.length})
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setCurrentView('categories');
              }}
              className="bg-white hover:bg-emerald-50/60 border border-slate-200/80 p-4 rounded-2xl text-center transition group flex flex-col items-center justify-center gap-2 shadow-xs hover:border-emerald-300"
            >
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white rounded-2xl flex items-center justify-center transition shadow-xs">
                <Tag className="w-6 h-6" />
              </div>
              <span className="font-bold text-slate-800 text-xs group-hover:text-emerald-700 transition">{cat.name}</span>
              <span className="text-[10px] text-slate-400">{cat.couponCount || 20} كوبون</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Stores Carousel / Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">أشهر المتاجر والعلامات الكبرى</h2>
            <p className="text-xs text-slate-500 mt-1">اختر متجرك المفضلة واحصل على أقوى أكواد الخصم</p>
          </div>
          <button 
            onClick={() => setCurrentView('stores')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            جميع المتاجر ({stores.length})
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredStores.slice(0, 10).map(store => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>

      {/* Main Coupons Feed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">أحدث الكوبونات والعروض الحصرية</h2>
            <p className="text-xs text-slate-500 mt-1">تم التحقق من جميع الأكواد اليوم وتعمل بكفاءة عالية</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              الكل ({coupons.length})
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'verified' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              مُجَرَّب وموثوق
            </button>
            <button
              onClick={() => setActiveTab('exclusive')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'exclusive' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              عروض حصرية
            </button>
            <button
              onClick={() => setActiveTab('codes')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'codes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              أكواد خصم فقط
            </button>
          </div>
        </div>

        {filteredCoupons.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <p className="text-lg font-bold text-slate-700">عذراً، لم نجد كوبونات مطابقة لبحثك</p>
            <p className="text-xs text-slate-500">جرب البحث بكلمة أخرى أو تصفح المتاجر المتاحة.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
              className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
            >
              إعادة ضبط البحث
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map(coupon => {
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

      {/* Import & Sync Stats Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
              استيراد البيانات المعتمد (CSV & Store Bundle)
            </span>
            <h3 className="text-2xl font-black">أكثر من {importReport.totalImported} متجر وكوبون تم جدولتها وفحصها</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              نظام الاستيراد المتقدم يطابق المتاجر وشعاراتها الرسمية ويتحقق من صلاحية الروابط تلقائياً لضمان تجربة متسوق خالية من الروابط التالفة.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center min-w-[140px]">
              <span className="text-2xl font-black text-emerald-400">{importReport.successfulStores}</span>
              <span className="text-xs text-slate-300 block mt-1">متجر نشط موثق</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center min-w-[140px]">
              <span className="text-2xl font-black text-teal-300">{importReport.successfulCoupons}</span>
              <span className="text-xs text-slate-300 block mt-1">كوبون وعرض</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
