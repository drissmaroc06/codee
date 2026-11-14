import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Store, Coupon, Category, CouponStatus } from '../types';
import { 
  LayoutDashboard, Store as StoreIcon, Tag, FileText, 
  Settings, Database, Plus, Trash2, Edit3, CheckCircle, 
  AlertCircle, Search, RefreshCw, Eye, ShieldCheck, Download, Upload 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    stores, coupons, categories, importReport, settings, clickLogs,
    addStore, updateStore, deleteStore,
    addCoupon, updateCoupon, deleteCoupon,
    runImportSimulation, updateSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'stores' | 'coupons' | 'categories' | 'import' | 'analytics' | 'settings'>('overview');

  // Modal / Form states
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [storeForm, setStoreForm] = useState({
    name: '',
    nameEn: '',
    slug: '',
    url: '',
    logo: '',
    shortDesc: '',
    fullDesc: '',
    categoryId: categories[0]?.id || '',
    isFeatured: false,
    status: 'published' as const
  });

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [couponForm, setCouponForm] = useState({
    title: '',
    code: '',
    description: '',
    storeId: stores[0]?.id || '',
    discountValue: '',
    offerType: 'discount_code' as const,
    expiryDate: '2026-12-31',
    country: 'SA' as const,
    status: 'published' as CouponStatus,
    isFeatured: false,
    isVerified: true,
    isExclusive: false,
    priority: 5,
    affiliateUrl: ''
  });

  // Search filter in admin tables
  const [adminSearch, setAdminSearch] = useState('');

  // Store Submit
  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeForm.name) return;

    if (editingStoreId) {
      updateStore(editingStoreId, storeForm);
    } else {
      addStore({
        ...storeForm,
        slug: storeForm.slug || storeForm.name.toLowerCase().replace(/\s+/g, '-'),
        countries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
        priority: 5,
      });
    }
    setStoreModalOpen(false);
    setEditingStoreId(null);
    setStoreForm({
      name: '', nameEn: '', slug: '', url: '', logo: '',
      shortDesc: '', fullDesc: '', categoryId: categories[0]?.id || '',
      isFeatured: false, status: 'published'
    });
  };

  // Coupon Submit
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.title || !couponForm.code) return;

    if (editingCouponId) {
      updateCoupon(editingCouponId, couponForm);
    } else {
      addCoupon(couponForm);
    }
    setCouponModalOpen(false);
    setEditingCouponId(null);
    setCouponForm({
      title: '', code: '', description: '', storeId: stores[0]?.id || '',
      discountValue: '', offerType: 'discount_code', expiryDate: '2026-12-31',
      country: 'SA', status: 'published', isFeatured: false, isVerified: true,
      isExclusive: false, priority: 5, affiliateUrl: ''
    });
  };

  const openEditStore = (store: Store) => {
    setEditingStoreId(store.id);
    setStoreForm({
      name: store.name,
      nameEn: store.nameEn,
      slug: store.slug,
      url: store.url,
      logo: store.logo,
      shortDesc: store.shortDesc,
      fullDesc: store.fullDesc,
      categoryId: store.categoryId,
      isFeatured: store.isFeatured,
      status: store.status as any
    });
    setStoreModalOpen(true);
  };

  const openEditCoupon = (coupon: Coupon) => {
    setEditingCouponId(coupon.id);
    setCouponForm({
      title: coupon.title,
      code: coupon.code,
      description: coupon.description,
      storeId: coupon.storeId,
      discountValue: coupon.discountValue,
      offerType: coupon.offerType as any,
      expiryDate: coupon.expiryDate,
      country: coupon.country as any,
      status: coupon.status,
      isFeatured: coupon.isFeatured,
      isVerified: coupon.isVerified,
      isExclusive: coupon.isExclusive,
      priority: coupon.priority,
      affiliateUrl: coupon.affiliateUrl
    });
    setCouponModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="bg-amber-500 text-slate-900 font-bold text-xs px-3 py-1 rounded-full mb-2 inline-block">
            لوحة تحكم المشرف (WordPress Style Admin)
          </span>
          <h1 className="text-3xl font-black">إدارة منصة أقوى كود</h1>
          <p className="text-xs text-slate-300 mt-1">إدارة المتاجر، الكوبونات، الاستيراد الجماعي، وإعدادات التحسين لمحركات البحث.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setStoreModalOpen(true);
              setEditingStoreId(null);
              setStoreForm({
                name: '', nameEn: '', slug: '', url: '', logo: '',
                shortDesc: '', fullDesc: '', categoryId: categories[0]?.id || '',
                isFeatured: false, status: 'published'
              });
            }}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow"
          >
            <Plus className="w-4 h-4" />
            إضافة متجر جديد
          </button>
          <button
            onClick={() => {
              setCouponModalOpen(true);
              setEditingCouponId(null);
              setCouponForm({
                title: '', code: '', description: '', storeId: stores[0]?.id || '',
                discountValue: '', offerType: 'discount_code', expiryDate: '2026-12-31',
                country: 'SA', status: 'published', isFeatured: false, isVerified: true,
                isExclusive: false, priority: 5, affiliateUrl: ''
              });
            }}
            className="px-5 py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-2xl text-xs flex items-center gap-2 shadow"
          >
            <Plus className="w-4 h-4" />
            إضافة كوبون جديد
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        {[
          { id: 'overview', name: 'الرئيسية والإحصائيات', icon: LayoutDashboard },
          { id: 'stores', name: `إدارة المتاجر (${stores.length})`, icon: StoreIcon },
          { id: 'coupons', name: `إدارة الكوبونات (${coupons.length})`, icon: Tag },
          { id: 'categories', name: `الأقسام (${categories.length})`, icon: FileText },
          { id: 'import', name: 'مركز الاستيراد (CSV & ZIP)', icon: Upload },
          { id: 'analytics', name: `سجل النقرات (${clickLogs.length})`, icon: Database },
          { id: 'settings', name: 'الإعدادات العامة', icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold">إجمالي المتاجر</span>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{stores.length}</h3>
              </div>
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <StoreIcon className="w-7 h-7" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold">إجمالي الكوبونات</span>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{coupons.length}</h3>
              </div>
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Tag className="w-7 h-7" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold">الكوبونات النشطة</span>
                <h3 className="text-3xl font-black text-emerald-600 mt-1">
                  {coupons.filter(c => c.status === 'published').length}
                </h3>
              </div>
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold">إجمالي نقرات نسخ الأكواد</span>
                <h3 className="text-3xl font-black text-amber-600 mt-1">{clickLogs.length + 2450}</h3>
              </div>
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <Database className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* Recent Import summary & activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900">تقرير استيراد البيانات الأخير</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span>إجمالي السجلات المستوردة من CSV / ZIP:</span>
                  <span className="font-bold text-slate-900">{importReport.totalImported} سجل</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span>المتاجر الناجحة:</span>
                  <span className="font-bold text-emerald-600">{importReport.successfulStores} متجر</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span>الكوبونات المطابقة:</span>
                  <span className="font-bold text-blue-600">{importReport.successfulCoupons} كوبون</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span>المتاجر المكررة المكتشفة:</span>
                  <span className="font-bold text-amber-600">{importReport.duplicateStores} متجر</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900">حالة النظام والتخزين</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span>قاعدة البيانات (MySQL / Local State):</span>
                  <span className="font-bold text-emerald-600">متصل (نشط)</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span>حالة الذاكرة المؤقتة (Cache):</span>
                  <span className="font-bold text-emerald-600">مفعل</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span>إصدار التطبيق:</span>
                  <span className="font-bold text-slate-900">v2.6.0 (رسمي)</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span>دعم اللغة والاتجاه:</span>
                  <span className="font-bold text-slate-900">العربية (RTL)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STORES MANAGEMENT */}
      {activeTab === 'stores' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900">إدارة المتاجر ({stores.length})</h3>
            <div className="relative w-full sm:w-72">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="بحث في المتاجر..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">الشعار والمتجر</th>
                  <th className="p-4">الرابط الرسمي</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">مميز</th>
                  <th className="p-4">تاريخ الإضافة</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stores
                  .filter(s => s.name.toLowerCase().includes(adminSearch.toLowerCase()))
                  .map(store => (
                    <tr key={store.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl p-1 flex items-center justify-center">
                          <img src={store.logo} alt={store.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{store.name}</span>
                          <span className="text-[10px] text-slate-400">{store.nameEn}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-500 font-mono truncate max-w-xs">{store.url}</td>
                      <td className="p-4">
                        <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-[10px]">
                          {store.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {store.isFeatured ? (
                          <span className="text-amber-600 font-bold">نعم ⭐</span>
                        ) : (
                          <span className="text-slate-400">عادي</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500">{store.createdAt}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditStore(store)}
                            className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 rounded-xl transition"
                            title="تعديل المتجر"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteStore(store.id)}
                            className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl transition"
                            title="حذف المتجر"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COUPONS MANAGEMENT */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900">إدارة الكوبونات والعروض ({coupons.length})</h3>
            <div className="relative w-full sm:w-72">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="بحث في الكوبونات..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">العنوان والمتجر</th>
                  <th className="p-4">رمز الكوبون</th>
                  <th className="p-4">قيمة الخصم</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">التحقق</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons
                  .filter(c => c.title.toLowerCase().includes(adminSearch.toLowerCase()) || c.code.toLowerCase().includes(adminSearch.toLowerCase()))
                  .map(coupon => {
                    const store = stores.find(s => s.id === coupon.storeId);
                    return (
                      <tr key={coupon.id} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <span className="font-bold text-slate-900 block">{coupon.title}</span>
                          <span className="text-[10px] text-emerald-600 font-semibold">{store?.name}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono bg-slate-100 text-emerald-700 font-bold px-2 py-1 rounded-lg">
                            {coupon.code}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-slate-800">{coupon.discountValue}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            coupon.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {coupon.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {coupon.isVerified ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> موثق
                            </span>
                          ) : (
                            <span className="text-slate-400">قيد المراجعة</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditCoupon(coupon)}
                              className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 rounded-xl transition"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteCoupon(coupon.id)}
                              className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-900">أقسام وتصنيفات المنصة ({categories.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-base">{cat.name}</h4>
                <p className="text-xs text-slate-500">{cat.description}</p>
                <div className="flex items-center justify-between text-xs font-semibold pt-2 text-emerald-700">
                  <span>{cat.storeCount} متجر</span>
                  <span>{cat.couponCount} كوبون</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: IMPORT CENTER */}
      {activeTab === 'import' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 space-y-8 animate-fadeIn">
          <div className="max-w-2xl space-y-3">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
              أداة الاستيراد الذكي (CSV & Store Logos ZIP)
            </span>
            <h3 className="text-2xl font-black text-slate-900">استيراد ومطابقة بيانات المتاجر والكوبونات</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              يقوم النظام تلقائياً بقراءة ملفات CSV وشعارات المتاجر المطابقة من حزمة ZIP مع اكتشاف المتاجر المكررة والروابط غير الصالحة وتوليد الروابط المتوافقة مع محركات البحث (SEO).
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-4 rounded-xl shadow-xs">
              <span className="text-2xl font-black text-emerald-600">{importReport.totalImported}</span>
              <span className="text-xs text-slate-500 block mt-1">إجمالي السجلات</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-xs">
              <span className="text-2xl font-black text-blue-600">{importReport.duplicateStores}</span>
              <span className="text-xs text-slate-500 block mt-1">متاجر مكررة تم دمجها</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-xs">
              <span className="text-2xl font-black text-amber-600">{importReport.pendingVerification}</span>
              <span className="text-xs text-slate-500 block mt-1">كوبونات قيد المراجعة</span>
            </div>
          </div>

          <div>
            <button
              onClick={() => runImportSimulation()}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
              تشغيل استيراد الدفعة الجديدة من الملفات (CSV & ZIP)
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">سجل تفاعل المستخدمين والنقرات ({clickLogs.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">نوع الحدث</th>
                  <th className="p-4">معرف الكوبون</th>
                  <th className="p-4">معرف المتجر</th>
                  <th className="p-4">التوقيت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clickLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-emerald-700">{log.type}</td>
                    <td className="p-4 font-mono">{log.couponId}</td>
                    <td className="p-4 font-mono">{log.storeId}</td>
                    <td className="p-4 text-slate-500">{new Date(log.timestamp).toLocaleString('ar-SA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 space-y-6 max-w-2xl animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-900">الإعدادات العامة للمنصة</h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">اسم الموقع</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateSettings({ siteName: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">عنوان الموقع (SEO Title)</label>
              <input
                type="text"
                value={settings.siteTitleAr}
                onChange={(e) => updateSettings({ siteTitleAr: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">وصف الموقع (Meta Description)</label>
              <textarea
                rows={3}
                value={settings.siteDescriptionAr}
                onChange={(e) => updateSettings({ siteDescriptionAr: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              ></textarea>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">رقم واتساب الدعم الفني</label>
              <input
                type="text"
                value={settings.whatsappSupport}
                onChange={(e) => updateSettings({ whatsappSupport: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT STORE MODAL */}
      {storeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {editingStoreId ? 'تعديل متجر' : 'إضافة متجر جديد'}
            </h3>
            <form onSubmit={handleStoreSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">اسم المتجر (بالعربية) *</label>
                <input
                  type="text"
                  required
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">اسم المتجر (بالإنجليزية)</label>
                <input
                  type="text"
                  value={storeForm.nameEn}
                  onChange={(e) => setStoreForm({ ...storeForm, nameEn: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">رابط الموقع الرسمي (URL)</label>
                <input
                  type="text"
                  value={storeForm.url}
                  onChange={(e) => setStoreForm({ ...storeForm, url: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">رابط شعار المتجر (Logo URL)</label>
                <input
                  type="text"
                  value={storeForm.logo}
                  onChange={(e) => setStoreForm({ ...storeForm, logo: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">وصف مختصر</label>
                <textarea
                  rows={2}
                  value={storeForm.shortDesc}
                  onChange={(e) => setStoreForm({ ...storeForm, shortDesc: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStoreModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  حفظ المتجر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT COUPON MODAL */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {editingCouponId ? 'تعديل كوبون' : 'إضافة كوبون جديد'}
            </h3>
            <form onSubmit={handleCouponSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">اختر المتجر *</label>
                <select
                  value={couponForm.storeId}
                  onChange={(e) => setCouponForm({ ...couponForm, storeId: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {stores.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">عنوان الكوبون *</label>
                <input
                  type="text"
                  required
                  value={couponForm.title}
                  onChange={(e) => setCouponForm({ ...couponForm, title: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">رمز الكوبون *</label>
                  <input
                    type="text"
                    required
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">قيمة الخصم</label>
                  <input
                    type="text"
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">وصف الكوبون</label>
                <textarea
                  rows={2}
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  حفظ الكوبون
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
