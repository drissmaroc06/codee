import React from 'react';
import { useApp } from '../context/AppContext';
import { Tag, ArrowLeft } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, stores, setCurrentView, setActiveCategoryId } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-8 rounded-3xl shadow-lg">
        <h1 className="text-3xl font-black mb-2">أقسام وتصنيفات المتاجر</h1>
        <p className="text-xs text-slate-300">تصفح الكوبونات والعروض حسب التصنيف المناسب لاحتياجاتك.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(cat => {
          const catStoresCount = stores.filter(s => s.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              onClick={() => {
                setActiveCategoryId(cat.id);
                setCurrentView('stores');
              }}
              className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white rounded-2xl flex items-center justify-center transition shadow-xs mb-4">
                  <Tag className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition mb-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  {catStoresCount} متجر متاح
                </span>
                <span className="text-emerald-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                  تصفح الأقسام
                  <ArrowLeft className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
