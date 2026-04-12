# Firebase Storage URL Migration Guide

## Overview

This guide will help you migrate all Firebase Storage URLs from your old project to your new project.

**Old Project:** `component-pulse-ec45f.firebasestorage.app`  
**New Project:** `componentpulse-dda65.firebasestorage.app`

## Prerequisites

1. ✅ Make sure you have the correct Firebase Admin credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-new-project-id
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   ```

2. ✅ Install dependencies (including `tsx`):
   ```bash
   npm install
   # or
   yarn install
   ```

## Migration Steps

### Step 1: Dry Run (Preview Changes)

First, run the migration in **dry-run mode** to see what will be changed WITHOUT making any actual updates:

```bash
npm run migrate:urls:dry
# or
yarn migrate:urls:dry
```

This will:
- ✅ Scan all collections (products, posts, deals, trainingModules, categories, testimonials, users)
- ✅ Show you which documents contain old URLs
- ✅ Display the old and new URLs side-by-side
- ✅ Give you a summary of how many documents will be updated
- ❌ **NOT make any changes to your database**

### Step 2: Review the Output

Carefully review the dry-run output. You should see something like:

```
============================================================
Processing collection: products
============================================================

📝 Document: 0OJ1LwavjEwKTMZVaKkJ
  ✓ Updated field: images[0].url
    OLD: https://firebasestorage.googleapis.com/v0/b/component-pulse-ec45f.firebasestorage.app/o/products%2F...
    NEW: https://firebasestorage.googleapis.com/v0/b/componentpulse-dda65.firebasestorage.app/o/products%2F...

📊 Summary for products:
   Total documents: 150
   Documents with updates: 45
```

### Step 3: Execute the Migration

If everything looks good, run the migration with the `--execute` flag:

```bash
npm run migrate:urls:execute
# or
yarn migrate:urls:execute
```

⚠️ **WARNING:** This will make actual changes to your Firestore database!

The script will:
1. Wait 3 seconds before starting (giving you time to cancel with Ctrl+C)
2. Update all documents with old URLs
3. Show progress for each collection
4. Display a final summary

### Step 4: Verify the Migration

After the migration completes:

1. ✅ Check your application to ensure images are loading correctly
2. ✅ Verify a few documents in Firebase Console to confirm URLs are updated
3. ✅ Test creating new content to ensure new uploads work properly

## Collections Updated

The migration script will update URLs in these collections:

- ✅ `products` - Product images
- ✅ `posts` - Blog post cover images
- ✅ `deals` - Deal images
- ✅ `trainingModules` - Training module images
- ✅ `categories` - Category images
- ✅ `testimonials` - Testimonial images
- ✅ `users` - User profile images

## What Gets Updated

The script recursively searches for and updates:
- Direct URL fields (e.g., `coverUrl`, `imageUrl`)
- Nested URL fields (e.g., `images[0].url`)
- Any string field containing the old storage bucket URL

## Troubleshooting

### Error: "Firebase Admin not initialized"
- Make sure your `.env.local` file has the correct Firebase Admin credentials
- Verify the credentials are for the **NEW** project (componentpulse-dda65)

### Error: "Permission denied"
- Ensure your Firebase Admin service account has Firestore read/write permissions
- Check Firebase Console → Project Settings → Service Accounts

### Some images still show old URLs
- The migration only updates URLs in Firestore documents
- If you have hardcoded URLs in your code, you'll need to update those manually
- Clear your browser cache and reload the page

### Need to rollback?
- Unfortunately, this script doesn't create backups
- **IMPORTANT:** Before running `--execute`, make sure to:
  1. Export your Firestore data as a backup
  2. Or run the dry-run multiple times to be absolutely sure

## Manual Backup (Recommended)

Before executing the migration, create a backup:

```bash
# Using Firebase CLI
firebase firestore:export gs://your-backup-bucket/backup-$(date +%Y%m%d)
```

## Support

If you encounter any issues:
1. Check the error messages in the console
2. Verify your Firebase credentials
3. Review the dry-run output carefully
4. Contact your development team for assistance

---

**Last Updated:** April 12, 2026
