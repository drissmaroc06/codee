import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StoreCard } from '../components/StoreCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export const StoresPage: React.FC = () => {
  const { stores, categories } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          store.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'all' || store.categoryId === selectedCat;
    return matchesSearch && matchesCat;
  });

  const totalPages = Math.ceil(filteredStores.length / pageSize);
  const paginatedStores = filteredStores.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black mb-2">دليل المتاجر الشامل ({stores.length})</h1>
          <p className="text-xs text-slate-300">تصفح جميع المتاجر والعلامات التجارية في السعودية والخليج مع أكواد خصم حصرية.</p>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن متجر..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full md:w-80 pl-4 pr-10 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs text-white placeholder-slate-300 outline-none focus:bg-white focus:text-slate-900 transition"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => { setSelectedCat('all'); setCurrentPage(1); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            selectedCat === 'all' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          جميع الأقسام
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCat(cat.id); setCurrentPage(1); }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCat === cat.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Stores Grid */}
      {paginatedStores.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <p className="text-lg font-bold text-slate-700">لم يتم العثور على متاجر مطابقة</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCat('all'); setCurrentPage(1); }}
            className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedStores.map(store => (
            <StoreCard key={store.id} store={store} />
          ))}
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
