import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, ShieldAlert } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { adminLogin, setCurrentView } = useApp();
  const [email, setEmail] = useState('admin@aqwacode.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await adminLogin(email, password);
    setLoading(false);
    if (res.success) {
      setCurrentView('admin');
      onClose();
    } else {
      setError(res.error || 'فشل تسجيل الدخول');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">تسجيل دخول المشرف</h3>
          <p className="text-xs text-slate-500">أدخل بيانات الاعتماد الآمنة للوصول لوحة التحكم</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">الافتراضي: admin@aqwacode.com / admin123</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition"
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول الآمن'}
          </button>
        </form>
      </div>
    </div>
  );
};
