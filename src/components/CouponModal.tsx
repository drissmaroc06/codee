import React, { useState } from 'react';
import { Coupon, Store } from '../types';
import { useApp } from '../context/AppContext';
import { X, Copy, Check, ExternalLink, ShieldCheck, Clock, ThumbsUp, AlertCircle, Share2 } from 'lucide-react';

interface CouponModalProps {
  coupon: Coupon | null;
  store: Store | null;
  onClose: () => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({ coupon, store, onClose }) => {
  const { logClick } = useApp();
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);

  if (!coupon || !store) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    logClick(coupon.id, store.id, 'copy_code');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleGoToStore = () => {
    logClick(coupon.id, store.id, 'store_visit');
    window.open(coupon.affiliateUrl || store.url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-md p-2 flex items-center justify-center mb-3">
            <img 
              src={store.logo} 
              alt={store.name} 
              className="max-h-full max-w-full object-contain rounded-lg"
              onError={(e) => {
                // Fallback image
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-1">
            {store.name}
          </span>
          <h3 className="text-xl font-bold">{coupon.title}</h3>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Coupon Code Box */}
          <div className="bg-slate-50 border-2 border-dashed border-emerald-300 rounded-xl p-4 text-center relative">
            <span className="text-xs text-slate-500 block mb-1">رمز الكوبون النشط</span>
            <div className="text-3xl font-black tracking-widest text-emerald-700 font-mono my-2 select-all">
              {coupon.code}
            </div>
            
            <button
              onClick={handleCopyCode}
              className={`w-full py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  تم نسخ الكوبون بنجاح!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  نسخ الكود والانتقال للمتجر
                </>
              )}
            </button>
          </div>

          {/* Description & Details */}
          <div className="space-y-3 text-sm text-slate-600">
            <p className="bg-slate-100 p-3 rounded-xl">{coupon.description}</p>
            
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                كوبون موثوق 100%
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-500" />
                صالح حتى: {coupon.expiryDate}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4 text-blue-500" />
                {coupon.successRate}% نجاح ({coupon.usageCount} استخدام)
              </span>
            </div>
          </div>

          {/* Go to store action */}
          <div className="pt-2">
            <button
              onClick={handleGoToStore}
              className="w-full py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow"
            >
              <ExternalLink className="w-5 h-5" />
              فتح موقع {store.name} وتطبيق الخصم
            </button>
          </div>

          {/* Feedback section */}
          <div className="bg-slate-50 p-4 rounded-xl text-center space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">هل عمل معك هذا الكوبون بنجاح؟</span>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setFeedbackGiven('yes')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  feedbackGiven === 'yes' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50'
                }`}
              >
                👍 نعم، عمل بنجاح
              </button>
              <button
                onClick={() => setFeedbackGiven('no')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  feedbackGiven === 'no' ? 'bg-rose-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50'
                }`}
              >
                👎 لا، لم يعمل
              </button>
            </div>
            {feedbackGiven && (
              <p className="text-xs text-emerald-600 font-medium pt-1">شكراً لمساهمتك في تقييم الكوبون لمساعدة الآخرين!</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
