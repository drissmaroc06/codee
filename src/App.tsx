/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CouponModal } from './components/CouponModal';
import { SubmitCouponModal } from './components/SubmitCouponModal';

import { Home } from './pages/Home';
import { StoresPage } from './pages/StoresPage';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CouponsPage } from './pages/CouponsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Coupon, Store } from './types';

function MainLayout() {
  const { currentView, isAdmin } = useApp();
  const [selectedCoupon, setSelectedCoupon] = useState<{ coupon: Coupon; store: Store } | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectCoupon = (coupon: Coupon, store: Store) => {
    setSelectedCoupon({ coupon, store });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      
      <Navbar 
        onOpenSubmit={() => setSubmitModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <Home 
            onSelectCoupon={handleSelectCoupon}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        {currentView === 'stores' && <StoresPage />}
        {currentView === 'store-detail' && <StoreDetailPage onSelectCoupon={handleSelectCoupon} />}
        {currentView === 'categories' && <CategoriesPage />}
        {currentView === 'coupons' && <CouponsPage onSelectCoupon={handleSelectCoupon} />}
        {currentView === 'favorites' && <FavoritesPage onSelectCoupon={handleSelectCoupon} />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      <Footer />

      {/* Modals */}
      {selectedCoupon && (
        <CouponModal 
          coupon={selectedCoupon.coupon}
          store={selectedCoupon.store}
          onClose={() => setSelectedCoupon(null)}
        />
      )}

      {submitModalOpen && (
        <SubmitCouponModal onClose={() => setSubmitModalOpen(false)} />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
