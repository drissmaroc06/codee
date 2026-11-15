import dotenv from 'dotenv';
dotenv.config();

import { prisma } from '../config/db';
import { runFullDataImport } from '../services/importer.service';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyAndImport() {
  console.log('=== AQWACODE PRODUCTION DATABASE VERIFICATION ===');

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('ERROR: DATABASE_URL environment variable is not set in .env or environment.');
    console.log('Please ensure DATABASE_URL is configured in Hostinger Environment Variables.');
    process.exit(1);
  }

  let dbHost = 'unknown';
  let dbName = 'unknown';
  try {
    const urlObj = new URL(dbUrl.replace(/^mysql:\/\//, 'http://'));
    dbHost = urlObj.hostname;
    dbName = urlObj.pathname.replace(/^\//, '');
  } catch (e) {
    dbHost = 'parsed-from-env';
  }

  console.log(`Database Host: ${dbHost}`);
  console.log(`Database Name: ${dbName}`);

  try {
    await prisma.$connect();
    console.log('Successfully connected to Hostinger MySQL database.');
  } catch (connErr) {
    console.error('ERROR: Failed to connect to Hostinger MySQL database:', connErr);
    process.exit(1);
  }

  const csvPath = path.resolve(__dirname, '../../public/assets/aistudio/coupons_export_2026-11-12_0605b934.csv');
  const csvExists = fs.existsSync(csvPath);
  console.log(`Original CSV file available: ${csvExists ? 'YES (' + csvPath + ')' : 'NO'}`);

  let totalStores = await prisma.store.count({ where: { deletedAt: null } });
  let totalCoupons = await prisma.coupon.count({ where: { deletedAt: null } });

  console.log(`Current MySQL Counts -> Stores: ${totalStores}, Coupons: ${totalCoupons}`);

  if (totalStores < 600 && csvExists) {
    console.log('Dataset incomplete (< 600 stores). Running full CSV import into Hostinger MySQL...');
    const importResult = await runFullDataImport();
    console.log('Import Result:', JSON.stringify(importResult.stats, null, 2));
  } else {
    console.log('Hostinger MySQL already populated with full dataset.');
  }

  const [
    finalTotalStores,
    finalTotalCoupons,
    publishedStores,
    activeCoupons,
    expiredCoupons,
    validLinkedCoupons,
    missingLogosCount,
    failedBatches
  ] = await Promise.all([
    prisma.store.count({ where: { deletedAt: null } }),
    prisma.coupon.count({ where: { deletedAt: null } }),
    prisma.store.count({ where: { status: 'published', deletedAt: null } }),
    prisma.coupon.count({ where: { status: 'published', deletedAt: null } }),
    prisma.coupon.count({ where: { status: 'expired', deletedAt: null } }),
    prisma.coupon.count({ where: { store: { deletedAt: null }, deletedAt: null } }),
    prisma.store.count({ where: { OR: [{ logoUrl: null }, { logoUrl: '' }], deletedAt: null } }),
    prisma.importBatch.count({ where: { status: 'failed' } }),
  ]);

  console.log('\n=== FINAL HOSTINGER MYSQL VERIFICATION RESULTS ===');
  console.log(`1. Total Stores (SQL count): ${finalTotalStores}`);
  console.log(`2. Total Coupons (SQL count): ${finalTotalCoupons}`);
  console.log(`3. Published Stores: ${publishedStores}`);
  console.log(`4. Active Coupons: ${activeCoupons}`);
  console.log(`5. Expired Coupons: ${expiredCoupons}`);
  console.log(`6. Coupons linked to valid stores: ${validLinkedCoupons}`);
  console.log(`7. Missing Logos: ${missingLogosCount}`);
  console.log(`8. Failed Import Batches: ${failedBatches}`);
  console.log('==================================================');

  await prisma.$disconnect();
}

verifyAndImport().catch(err => {
  console.error('Verification script error:', err);
  process.exit(1);
});
