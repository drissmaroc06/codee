export type OfferType = 'discount_code' | 'automatic' | 'sale' | 'free_shipping' | 'special_deal';

export type CouponStatus = 'pending' | 'approved' | 'published' | 'expired' | 'disabled' | 'rejected';

export type CountryCode = 'SA' | 'AE' | 'KW' | 'QA' | 'BH' | 'OM' | 'ALL';

export interface Store {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  url: string;
  logo: string;
  banner?: string;
  shortDesc: string;
  fullDesc: string;
  categoryId: string;
  countries: CountryCode[];
  isFeatured: boolean;
  priority: number;
  status: 'published' | 'draft' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  title: string;
  code: string;
  description: string;
  storeId: string;
  discountValue: string; // e.g. "20%", "50 SAR", "Free"
  offerType: OfferType;
  expiryDate: string;
  country: CountryCode;
  status: CouponStatus;
  isFeatured: boolean;
  isVerified: boolean;
  isExclusive: boolean;
  priority: number;
  startDate?: string;
  affiliateUrl: string;
  usageCount: number;
  successRate: number; // e.g. 98%
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  parentId?: string;
  storeCount?: number;
  couponCount?: number;
}

export interface ImportReport {
  totalImported: number;
  successfulStores: number;
  successfulCoupons: number;
  duplicateStores: number;
  duplicateCoupons: number;
  missingLogos: number;
  invalidUrls: number;
  pendingVerification: number;
  importDate: string;
}

export interface ClickLog {
  id: string;
  couponId: string;
  storeId: string;
  timestamp: string;
  type: 'copy_code' | 'reveal_code' | 'store_visit';
  userAgent?: string;
}

export interface SiteSettings {
  siteName: string;
  siteTitleAr: string;
  siteDescriptionAr: string;
  defaultCountry: CountryCode;
  whatsappSupport: string;
  enableSubmissions: boolean;
  maintenanceMode: boolean;
}
