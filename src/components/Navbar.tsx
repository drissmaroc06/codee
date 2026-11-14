import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode } from '../types';
import { Search, Heart, ShieldCheck, PlusCircle, LayoutDashboard, Menu, X, Sparkles, LogOut, Tag } from 'lucide-react';
import { LoginModal } from './LoginModal';

interface NavbarProps {
  onOpenSubmit: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSubmit, searchQuery, setSearchQuery }) => {
  const { 
    selectedCountry, 
    setSelectedCountry, 
    favorites, 
    isAdmin, 
    adminUser,
    adminLogout,
    setCurrentView, 
    currentView,
    categories,
    coupons,
    stores
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const countries: { code: CountryCode; name: string; flag: string }[] = [
    { code: 'SA', name: 'السعودية', flag: '🇸🇦' },
    { code: 'AE', name: 'الإمارات', flag: '🇦🇪' },
    { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
    { code: 'QA', name: 'قطر', flag: '🇶🇦' },
    { code: 'BH', name: 'البحرين', flag: '🇧🇭' },
    { code: 'OM', name: 'عمان', flag: '🇴🇲' },
    { code: 'ALL', name: 'الخليج والكل', flag: '🌍' },
  ];

  const currentCountryObj = countries.find(c => c.code === selectedCountry) || countries[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      
      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              أكواد خصم مجربة ومحدثة يومياً لعام 2026
            </span>
            <span className="hidden md:inline-block text-slate-400">|</span>
            <span className="hidden md:inline-block text-slate-300">أكثر من {stores.length} متجر و {coupons.length} كوبون حصري</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Country Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-full transition text-xs font-medium"
              >
                <span>{currentCountryObj.flag}</span>
                <span>{currentCountryObj.name}</span>
              </button>

              {countryDropdownOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-slate-800">
                  {countries.map(c => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setSelectedCountry(c.code);
                        setCountryDropdownOpen(false);
                      }}
                      className={`w-full text-right px-4 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition ${
                        selectedCountry === c.code ? 'bg-emerald-50 text-emerald-700 font-bold' : ''
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Authentication Action */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{currentView === 'admin' ? 'العودة للموقع' : 'لوحة التحكم'}</span>
                </button>
                <button
                  onClick={() => adminLogout()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 hover:bg-rose-900 text-rose-300 transition"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>دخول المشرف</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 text-right group"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                أقوى <span className="text-emerald-600">كود</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">كوبونات وعروض حصرية</p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700">
            <button 
              onClick={() => setCurrentView('home')}
              className={`px-3 py-2 rounded-xl transition ${currentView === 'home' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-100'}`}
            >
              الرئيسية
            </button>
            <button 
              onClick={() => setCurrentView('stores')}
              className={`px-3 py-2 rounded-xl transition ${currentView === 'stores' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-100'}`}
            >
              المتاجر ({stores.length})
            </button>
            <button 
              onClick={() => setCurrentView('categories')}
              className={`px-3 py-2 rounded-xl transition ${currentView === 'categories' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-100'}`}
            >
              الأقسام
            </button>
            <button 
              onClick={() => setCurrentView('coupons')}
              className={`px-3 py-2 rounded-xl transition ${currentView === 'coupons' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-100'}`}
            >
              أحدث الكوبونات
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن متجر (مثل: نمشي، جرير، سيفورا) أو كود خصم..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'stores' && currentView !== 'coupons' && e.target.value.trim() !== '') {
                  setCurrentView('stores');
                }
              }}
              className="w-full pl-4 pr-10 py-2.5 bg-slate-100 hover:bg-slate-200/60 focus:bg-white border border-transparent focus:border-emerald-500 rounded-2xl text-xs focus:ring-4 focus:ring-emerald-500/10 outline-none transition"
            />
          </div>
        </div>

        {/* Actions (Favorites & Submit Coupon) */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={onOpenSubmit}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-2xl text-xs transition border border-emerald-200"
          >
            <PlusCircle className="w-4 h-4" />
            <span>شارك كوبون</span>
          </button>

          {/* Favorites Button */}
          <button
            onClick={() => setCurrentView('favorites')}
            className="relative p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition"
            title="الكوبونات المحفوظة"
          >
            <Heart className="w-5 h-5 text-rose-500" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 bg-slate-100 text-slate-700 rounded-2xl"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 p-4 space-y-3 animate-fadeIn">
          <div className="relative md:hidden mb-3">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن متجر أو كود خصم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-slate-100 rounded-xl text-xs outline-none"
            />
          </div>
          <button 
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="w-full text-right px-4 py-2 rounded-xl font-semibold text-sm hover:bg-slate-50"
          >
            الرئيسية
          </button>
          <button 
            onClick={() => { setCurrentView('stores'); setMobileMenuOpen(false); }}
            className="w-full text-right px-4 py-2 rounded-xl font-semibold text-sm hover:bg-slate-50"
          >
            المتاجر
          </button>
          <button 
            onClick={() => { setCurrentView('categories'); setMobileMenuOpen(false); }}
            className="w-full text-right px-4 py-2 rounded-xl font-semibold text-sm hover:bg-slate-50"
          >
            الأقسام
          </button>
          <button 
            onClick={() => { setCurrentView('coupons'); setMobileMenuOpen(false); }}
            className="w-full text-right px-4 py-2 rounded-xl font-semibold text-sm hover:bg-slate-50"
          >
            أحدث الكوبونات
          </button>
          <button 
            onClick={() => { onOpenSubmit(); setMobileMenuOpen(false); }}
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl text-center text-xs"
          >
            شارك كوبون خصم
          </button>
        </div>
      )}

      {loginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} />
      )}

    </header>
  );
};
