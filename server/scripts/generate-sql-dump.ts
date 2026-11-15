import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function getOfficialStoreUrl(storeName: string, rawUrl: string): string {
  if (rawUrl && !rawUrl.includes('couponava.com')) {
    return rawUrl;
  }
  const name = storeName.toLowerCase();
  if (name.includes('نمشي') || name.includes('namshi')) return 'https://www.namshi.com';
  if (name.includes('نون') || name.includes('noon')) return 'https://www.noon.com';
  if (name.includes('جرير') || name.includes('jarir')) return 'https://www.jarir.com';
  if (name.includes('سيفورا') || name.includes('sephora')) return 'https://www.sephora.ae';
  if (name.includes('6 ستريت') || name.includes('6th')) return 'https://en-sa.6thstreet.com';
  if (name.includes('أوناس') || name.includes('ounass')) return 'https://www.ounass.sa';
  if (name.includes('اتش اند ام') || name.includes('h&m')) return 'https://www.hm.com/sa';
  if (name.includes('أمازون') || name.includes('amazon')) return 'https://www.amazon.sa';
  if (name.includes('أديام') || name.includes('adidas')) return 'https://www.adidas.com.sa';
  if (name.includes('سيفي') || name.includes('sivvi')) return 'https://www.sivvi.com';
  if (name.includes('مكياجي') || name.includes('mikyajy')) return 'https://www.mikyajy.com';
  if (name.includes('نايكي') || name.includes('nike')) return 'https://www.nike.sa';
  
  const cleanSlug = name.replace(/[\s\-_]+/g, '').replace(/[^\w]/g, '');
  return `https://www.${cleanSlug || 'store'}.com`;
}

async function generateSafeSQLDump() {
  const csvPath = path.resolve(__dirname, '../../public/assets/aistudio/coupons_export_2026-11-12_0605b934.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV export file not found!');
    return;
  }

  const csvText = fs.readFileSync(csvPath, 'utf8');
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  const rows = lines.slice(1);

  const storeMap = new Map<string, { id: number; name: string; url: string; logo: string; slug: string }>();
  const couponsList: Array<{ storeName: string; title: string; code: string; desc: string; discount: string; offerType: string; expiry: string; status: string; url: string }> = [];

  let storeIdCounter = 1;

  for (const line of rows) {
    const cols = parseCSVLine(line);
    if (cols.length < 11) continue;

    const storeName = cols[0].replace(/^["']|["']$/g, '').trim();
    const storeLogoUrl = cols[1].replace(/^["']|["']$/g, '').trim();
    const rawStoreUrl = cols[2].replace(/^["']|["']$/g, '').trim();
    const couponTitle = cols[3].replace(/^["']|["']$/g, '').trim();
    const couponCode = cols[4].replace(/^["']|["']$/g, '').trim() || 'SAVE';
    const couponUrl = cols[5].replace(/^["']|["']$/g, '').trim();
    const description = cols[6].replace(/^["']|["']$/g, '').trim();
    const offerTypeCSV = cols[7].replace(/^["']|["']$/g, '').trim();
    const discount = cols[8].replace(/^["']|["']$/g, '').trim();
    const expiryDate = cols[9].replace(/^["']|["']$/g, '').trim();
    const statusCSV = cols[10].replace(/^["']|["']$/g, '').trim();

    if (!storeName) continue;

    let store = storeMap.get(storeName);
    if (!store) {
      const officialUrl = getOfficialStoreUrl(storeName, rawStoreUrl);
      const slug = storeName.toLowerCase().replace(/[\s\-_]+/g, '-').replace(/[^\w\-]+/g, '') || `store-${storeIdCounter}`;
      store = {
        id: storeIdCounter++,
        name: storeName,
        url: officialUrl,
        logo: storeLogoUrl || '/public/assets/aistudio/____-logo_da95592c.jpg',
        slug,
      };
      storeMap.set(storeName, store);
    }

    couponsList.push({
      storeName,
      title: couponTitle || `كود خصم ${storeName} الحصري`,
      code: couponCode.toUpperCase(),
      desc: description || `استخدم كود خصم ${storeName} (${couponCode}) لتوفير المال.`,
      discount: discount || 'خصم خاص',
      offerType: offerTypeCSV.toLowerCase().includes('sale') ? 'sale' : 'discount_code',
      expiry: expiryDate || '2026-12-31',
      status: statusCSV.toLowerCase().includes('expired') ? 'expired' : 'published',
      url: couponUrl && !couponUrl.includes('couponava.com') ? couponUrl : store.url,
    });
  }

  let sql = `-- ========================================================\n`;
  sql += `-- AQWACODE SAFE PRODUCTION DATA IMPORT SQL\n`;
  sql += `-- Compatible with Hostinger MySQL and utf8mb4\n`;
  sql += `-- NO DROP TABLE / NO TRUNCATE TABLE (Preserves existing data)\n`;
  sql += `-- Contains ${storeMap.size} Stores and ${couponsList.length} Coupons\n`;
  sql += `-- ========================================================\n\n`;

  sql += `SET NAMES utf8mb4;\n`;
  sql += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

  // Categories (INSERT IGNORE)
  sql += `-- 1. Categories\n`;
  sql += `INSERT IGNORE INTO \`Category\` (\`id\`, \`nameAr\`, \`nameEn\`, \`slug\`, \`description\`, \`icon\`, \`createdAt\`, \`updatedAt\`) VALUES\n`;
  sql += `(1, 'الأزياء والموضة', 'Fashion', 'fashion', 'أحدث صيحات الموضة والأزياء', 'Shirt', NOW(), NOW()),\n`;
  sql += `(2, 'الجمال والعطور', 'Beauty & Perfumes', 'beauty-perfumes', 'أفضل العطور العالمية ومستحضرات التجميل', 'Sparkles', NOW(), NOW()),\n`;
  sql += `(3, 'الإلكترونيات والتقنية', 'Electronics', 'electronics', 'هواتف ذكية وأجهزة منزلية ذكية', 'Laptop', NOW(), NOW()),\n`;
  sql += `(4, 'التسوق العام والهايبرماركت', 'General Shopping', 'general-shopping', 'متاجر التسوق الشامل والهايبرماركت', 'ShoppingBag', NOW(), NOW()),\n`;
  sql += `(5, 'الطعام والتوصيل', 'Food & Delivery', 'food-delivery', 'تطبيقات توصيل الطعام والمطاعم', 'Utensils', NOW(), NOW()),\n`;
  sql += `(6, 'السفر والسياحة', 'Travel & Tourism', 'travel-tourism', 'حجوزات الفنادق والطيران', 'Plane', NOW(), NOW()),\n`;
  sql += `(7, 'الأطفال والرضع', 'Kids & Baby', 'kids-baby', 'ملابس الأطفال ومستلزمات المواليد', 'Baby', NOW(), NOW()),\n`;
  sql += `(8, 'المنزل والأثاث', 'Home & Furniture', 'home-furniture', 'أثاث منزلي ومفروشات وديكورات', 'Home', NOW(), NOW());\n\n`;

  // Stores (INSERT IGNORE)
  sql += `-- 2. Stores (${storeMap.size} stores)\n`;
  sql += `INSERT IGNORE INTO \`Store\` (\`id\`, \`nameAr\`, \`nameEn\`, \`slug\`, \`url\`, \`logoUrl\`, \`shortDescAr\`, \`fullDescAr\`, \`categoryId\`, \`isFeatured\`, \`priority\`, \`status\`, \`seoTitle\`, \`seoDesc\`, \`focusKeyword\`, \`createdAt\`, \`updatedAt\`) VALUES\n`;
  
  const storeArray = Array.from(storeMap.values());
  const storeSqlChunks: string[] = [];
  for (let i = 0; i < storeArray.length; i++) {
    const s = storeArray[i];
    const escName = s.name.replace(/'/g, "''");
    const escUrl = s.url.replace(/'/g, "''");
    const escLogo = s.logo.replace(/'/g, "''");
    const escSlug = s.slug.replace(/'/g, "''");
    const shortDesc = `أحدث عروض وأكواد خصم ${escName} الفعالة في السعودية والخليج.`.replace(/'/g, "''");
    const fullDesc = `متجر ${escName} يوفر أفضل المنتجات. احصل على أقوى كود خصم ${escName} لتوفير المال.`.replace(/'/g, "''");
    const seoTitle = `كود خصم ${escName} 2026 - عروض حصرية`.replace(/'/g, "''");
    const seoDesc = `استخدم أحدث كوبون خصم ${escName} للحصول على تخفيضات فورية وحصرية.`.replace(/'/g, "''");
    const focusKeyword = `كود خصم ${escName}`.replace(/'/g, "''");
    const isFeatured = i < 15 ? 1 : 0;
    
    storeSqlChunks.push(`(${s.id}, '${escName}', '${escName}', '${escSlug}', '${escUrl}', '${escLogo}', '${shortDesc}', '${fullDesc}', 1, ${isFeatured}, 10, 'published', '${seoTitle}', '${seoDesc}', '${focusKeyword}', NOW(), NOW())`);
  }
  sql += storeSqlChunks.join(',\n') + ';\n\n';

  // Coupons (INSERT IGNORE)
  sql += `-- 3. Coupons (${couponsList.length} coupons)\n`;
  
  const batchSize = 500;
  for (let i = 0; i < couponsList.length; i += batchSize) {
    const batch = couponsList.slice(i, i + batchSize);
    sql += `INSERT IGNORE INTO \`Coupon\` (\`titleAr\`, \`code\`, \`descriptionAr\`, \`storeId\`, \`discountValue\`, \`offerType\`, \`expiryDate\`, \`countryId\`, \`status\`, \`isFeatured\`, \`isVerified\`, \`isExclusive\`, \`priority\`, \`affiliateUrl\`, \`usageCount\`, \`successRate\`, \`createdAt\`, \`updatedAt\`) VALUES\n`;
    
    const couponChunks: string[] = [];
    for (let j = 0; j < batch.length; j++) {
      const c = batch[j];
      const store = storeMap.get(c.storeName);
      const storeId = store ? store.id : 1;
      const title = c.title.replace(/'/g, "''");
      const code = c.code.replace(/'/g, "''");
      const desc = c.desc.replace(/'/g, "''");
      const discount = c.discount.replace(/'/g, "''");
      const offerType = c.offerType.replace(/'/g, "''");
      const expiry = c.expiry.replace(/'/g, "''");
      const status = c.status.replace(/'/g, "''");
      const affUrl = c.url.replace(/'/g, "''");
      const isFeatured = j < 10 ? 1 : 0;
      const isExclusive = j % 3 === 0 ? 1 : 0;
      const usageCount = Math.floor(Math.random() * 500) + 50;

      couponChunks.push(`('${title}', '${code}', '${desc}', ${storeId}, '${discount}', '${offerType}', '${expiry}', NULL, '${status}', ${isFeatured}, 1, ${isExclusive}, 5, '${affUrl}', ${usageCount}, 98, NOW(), NOW())`);
    }
    sql += couponChunks.join(',\n') + ';\n\n';
  }

  sql += `SET FOREIGN_KEY_CHECKS = 1;\n\n`;

  // 4. Verification SQL queries section
  sql += `-- ========================================================\n`;
  sql += `-- 4. MANDATORY VERIFICATION SQL QUERIES\n`;
  sql += `-- Run these queries after import to verify table counts\n`;
  sql += `-- ========================================================\n`;
  sql += `SELECT 'Categories Count' AS metric, COUNT(*) AS count FROM \`Category\`\n`;
  sql += `UNION ALL\n`;
  sql += `SELECT 'Stores Count', COUNT(*) FROM \`Store\`\n`;
  sql += `UNION ALL\n`;
  sql += `SELECT 'Coupons Count', COUNT(*) FROM \`Coupon\`\n`;
  sql += `UNION ALL\n`;
  sql += `SELECT 'Published Stores', COUNT(*) FROM \`Store\` WHERE \`status\` = 'published'\n`;
  sql += `UNION ALL\n`;
  sql += `SELECT 'Active Coupons', COUNT(*) FROM \`Coupon\` WHERE \`status\` = 'published'\n`;
  sql += `UNION ALL\n`;
  sql += `SELECT 'Expired Coupons', COUNT(*) FROM \`Coupon\` WHERE \`status\` = 'expired';\n`;

  const outPath = path.resolve(__dirname, '../../public/aqwacode_safe_production_data.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log(`Successfully generated safe production SQL import file at ${outPath} with ${storeMap.size} stores and ${couponsList.length} coupons!`);
}

generateSafeSQLDump();
