/**
 * Firebase Storage URL Migration Script
 * 
 * This script updates all Firebase Storage URLs from the old project to the new project.
 * 
 * OLD: component-pulse-ec45f.firebasestorage.app
 * NEW: componentpulse-dda65.firebasestorage.app
 * 
 * Usage:
 * 1. Make sure you have the correct Firebase credentials in .env.local
 * 2. Run: npx tsx scripts/migrate-storage-urls.ts
 * 3. Review the changes and confirm
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// Initialize Firebase Admin
if (!getApps().length) {
  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  };

  initializeApp({
    credential: cert(serviceAccount as any),
  });
}

const db = getFirestore();

// Configuration
const OLD_STORAGE_BUCKET = 'component-pulse-ec45f.firebasestorage.app';
const NEW_STORAGE_BUCKET = 'componentpulse-dda65.firebasestorage.app';

// Collections that may contain image URLs
const COLLECTIONS_TO_UPDATE = [
  'products',
  'posts', // blog posts
  'deals',
  'trainingModules',
  'categories',
  'testimonials',
  'users', // profile images
];

/**
 * Recursively update URLs in an object
 */
function updateUrlsInObject(obj: any): { updated: boolean; newObj: any } {
  if (!obj || typeof obj !== 'object') {
    return { updated: false, newObj: obj };
  }

  let hasUpdates = false;
  const newObj: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'string' && value.includes(OLD_STORAGE_BUCKET)) {
      // Update the URL
      newObj[key] = value.replace(OLD_STORAGE_BUCKET, NEW_STORAGE_BUCKET);
      hasUpdates = true;
      console.log(`  ✓ Updated field: ${key}`);
      console.log(`    OLD: ${value.substring(0, 100)}...`);
      console.log(`    NEW: ${newObj[key].substring(0, 100)}...`);
    } else if (typeof value === 'object' && value !== null) {
      // Recursively check nested objects
      const result = updateUrlsInObject(value);
      newObj[key] = result.newObj;
      if (result.updated) {
        hasUpdates = true;
      }
    } else {
      newObj[key] = value;
    }
  }

  return { updated: hasUpdates, newObj };
}

/**
 * Migrate a single collection
 */
async function migrateCollection(collectionName: string, dryRun: boolean = true) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing collection: ${collectionName}`);
  console.log('='.repeat(60));

  try {
    const snapshot = await db.collection(collectionName).get();
    
    if (snapshot.empty) {
      console.log(`⚠️  Collection "${collectionName}" is empty. Skipping.`);
      return { total: 0, updated: 0 };
    }

    let updatedCount = 0;
    const totalDocs = snapshot.size;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const result = updateUrlsInObject(data);

      if (result.updated) {
        console.log(`\n📝 Document: ${doc.id}`);
        
        if (!dryRun) {
          await db.collection(collectionName).doc(doc.id).update(result.newObj);
          console.log(`✅ Updated successfully`);
        } else {
          console.log(`🔍 [DRY RUN] Would update this document`);
        }
        
        updatedCount++;
      }
    }

    console.log(`\n📊 Summary for ${collectionName}:`);
    console.log(`   Total documents: ${totalDocs}`);
    console.log(`   Documents with updates: ${updatedCount}`);
    
    return { total: totalDocs, updated: updatedCount };
  } catch (error) {
    console.error(`❌ Error processing collection ${collectionName}:`, error);
    return { total: 0, updated: 0 };
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('\n🚀 Firebase Storage URL Migration Tool');
  console.log('=====================================\n');
  console.log(`OLD Bucket: ${OLD_STORAGE_BUCKET}`);
  console.log(`NEW Bucket: ${NEW_STORAGE_BUCKET}\n`);

  // Check if running in dry-run mode
  const dryRun = process.argv.includes('--dry-run') || !process.argv.includes('--execute');
  
  if (dryRun) {
    console.log('🔍 Running in DRY RUN mode (no changes will be made)');
    console.log('💡 To execute the migration, run: npx tsx scripts/migrate-storage-urls.ts --execute\n');
  } else {
    console.log('⚠️  EXECUTING MIGRATION - Changes will be written to Firestore!');
    console.log('⏳ Starting in 3 seconds... (Press Ctrl+C to cancel)\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  let totalDocs = 0;
  let totalUpdated = 0;

  // Process each collection
  for (const collectionName of COLLECTIONS_TO_UPDATE) {
    const result = await migrateCollection(collectionName, dryRun);
    totalDocs += result.total;
    totalUpdated += result.updated;
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total documents scanned: ${totalDocs}`);
  console.log(`Documents with URL updates: ${totalUpdated}`);
  
  if (dryRun) {
    console.log('\n🔍 This was a DRY RUN - no changes were made');
    console.log('💡 To execute the migration, run:');
    console.log('   npx tsx scripts/migrate-storage-urls.ts --execute');
  } else {
    console.log('\n✅ Migration completed successfully!');
  }
  
  console.log('\n');
}

// Run the migration
migrate()
  .then(() => {
    console.log('✨ Script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
