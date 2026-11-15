import { Store, Coupon, Category, SiteSettings } from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'omit',
    });
    return res.json();
  },

  async logout() {
    const res = await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'omit' });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'omit' });
    return res.json();
  },

  // Stores
  async getStores(search = '', categoryId = '') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (categoryId && categoryId !== 'all') params.append('categoryId', categoryId.replace('cat-', ''));
    
    const res = await fetch(`${API_BASE}/stores?${params.toString()}`);
    const json = await res.json();
    return json.success ? json.data : [];
  },

  async createStore(storeData: any) {
    const res = await fetch(`${API_BASE}/stores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeData),
      credentials: 'omit',
    });
    return res.json();
  },

  async updateStore(id: number | string, storeData: any) {
    const dbId = typeof id === 'string' ? id.replace('store-', '') : id;
    const res = await fetch(`${API_BASE}/stores/${dbId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeData),
      credentials: 'omit',
    });
    return res.json();
  },

  async deleteStore(id: number | string) {
    const dbId = typeof id === 'string' ? id.replace('store-', '') : id;
    const res = await fetch(`${API_BASE}/stores/${dbId}`, {
      method: 'DELETE',
      credentials: 'omit',
    });
    return res.json();
  },

  // Coupons
  async getCoupons(search = '', storeId = '') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (storeId) params.append('storeId', storeId.replace('store-', ''));

    const res = await fetch(`${API_BASE}/coupons?${params.toString()}`);
    const json = await res.json();
    return json.success ? json.data : [];
  },

  async createCoupon(couponData: any) {
    const res = await fetch(`${API_BASE}/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponData),
      credentials: 'omit',
    });
    return res.json();
  },

  async updateCoupon(id: number | string, couponData: any) {
    const dbId = typeof id === 'string' ? id.replace('coup-', '') : id;
    const res = await fetch(`${API_BASE}/coupons/${dbId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponData),
      credentials: 'omit',
    });
    return res.json();
  },

  async deleteCoupon(id: number | string) {
    const dbId = typeof id === 'string' ? id.replace('coup-', '') : id;
    const res = await fetch(`${API_BASE}/coupons/${dbId}`, {
      method: 'DELETE',
      credentials: 'omit',
    });
    return res.json();
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    const json = await res.json();
    return json.success ? json.data : [];
  },

  // Analytics
  async logClick(couponId: string, storeId: string, type: string) {
    await fetch(`${API_BASE}/analytics/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ couponId, storeId, type }),
    });
  },

  async getClickLogs() {
    const res = await fetch(`${API_BASE}/analytics/logs`, { credentials: 'omit' });
    const json = await res.json();
    return json.success ? json.data : [];
  },

  // Import
  async runImport() {
    const res = await fetch(`${API_BASE}/import/run`, {
      method: 'POST',
      credentials: 'omit',
    });
    return res.json();
  },

  async getImportStats() {
    const res = await fetch(`${API_BASE}/import/stats`, { credentials: 'omit' });
    const json = await res.json();
    return json.success ? json.data : null;
  },

  async checkDbStatus() {
    const res = await fetch(`${API_BASE}/system/db-status`, { credentials: 'omit' });
    return res.json();
  }
};
