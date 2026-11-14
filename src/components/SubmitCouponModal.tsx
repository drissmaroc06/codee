import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface SubmitCouponModalProps {
  onClose: () => void;
}

export const SubmitCouponModal: React.FC<SubmitCouponModalProps> = ({ onClose }) => {
  const { stores, addCoupon } = useApp();
  const [storeId, setStoreId] = useState(stores[0]?.id || '');
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code || !storeId) return;

    const store = stores.find(s => s.id === storeId);

    addCoupon({
      title,
      code: code.toUpperCase(),
      description: description || 'كوبون مقدم من زوار المنصة',
      storeId,
      discountValue: discountValue || 'خصم خاص',
      offerType: 'discount_code',
      expiryDate: '2026-12-31',
      country: 'SA',
      status: 'pending', // Pending review queue in admin
      isFeatured: false,
      isVerified: false,
      isExclusive: false,
      priority: 5,
      affiliateUrl: store?.url || 'https://www.google.com',
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold">شارك كوبون خصم جديد</h3>
          <p className="text-sm text-slate-300 mt-1">ساهم معنا في مساعدة آلاف المتسوقين ووفر عليهم المال.</p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-800">تم إرسال الكوبون بنجاح!</h4>
            <p className="text-sm text-slate-600">سيتم مراجعة الكوبون من قبل فريق الإدارة ونشره فوراً في المنصة.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">اختر المتجر *</label>
              <select
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              >
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name} ({store.nameEn})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">عنوان العرض أو نسبة الخصم *</label>
              <input
                type="text"
                placeholder="مثال: خصم 20% على جميع المنتجات"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">رمز الكوبون *</label>
                <input
                  type="text"
                  placeholder="مثال: SAVE20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">قيمة الخصم</label>
                <input
                  type="text"
                  placeholder="مثال: 20%"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">تفاصيل إضافية عن الخصم</label>
              <textarea
                rows={3}
                placeholder="اكتب تفاصيل شروط الاستخدام أو الحد الأدنى للطلب..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20"
            >
              <Send className="w-5 h-5" />
              إرسال الكوبون للمراجعة
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
