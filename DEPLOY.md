# Deployment Guide - Vercel with TiDB Cloud

## Prerequisites
- GitHub account
- Vercel account (vercel.com)
- TiDB Cloud account (tidbcloud.com)

## Database Connection Details

```
Host:     gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com
Port:     4000
Username: 2uThyiwAJFJysZ1.root
Password: GEQy2ICGgHgbW5ka
Database: sys
```

**DATABASE_URL (for Vercel):**
```
mysql://2uThyiwAJFJysZ1.root:GEQy2ICGgHgbW5ka@gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com:4000/sys?ssl={"rejectUnauthorized":true}
```

## Step 1: Push Changes to GitHub

```bash
git add .
git commit -m "Update Prisma schema for MySQL (TiDB)"
git push origin main
```

## Step 2: Import Project to Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository "dollorgrows"

## Step 3: Configure Environment Variables

In Vercel project settings, add these environment variables:

| Variable | Value |
|----------|-------|
| DATABASE_URL | `mysql://2uThyiwAJFJysZ1.root:GEQy2ICGgHgbW5ka@gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com:4000/sys?ssl={"rejectUnauthorized":true}` |
| NEXTAUTH_SECRET | Generate a secure random string (use: `openssl rand -base64 32`) |
| NEXTAUTH_URL | `https://dollorgrows.vercel.app` |
| NEXT_PUBLIC_BSC_RPC_URL | `https://data-seed-prebsc-1-s1.binance.org:8545` |
| NEXT_PUBLIC_LEVEL1_COMMISSION | `10` |
| NEXT_PUBLIC_LEVEL2_COMMISSION | `5` |
| NEXT_PUBLIC_LEVEL3_COMMISSION | `3` |

## Step 4: Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete

## Step 5: Initialize Database

After deployment, run Prisma commands to create tables:

```bash
# Connect to TiDB and push schema
npx prisma db push
```

Or use TiDB Cloud console to run the SQL from `dollorgrows.sql`.

## Troubleshooting

### Connection Issues
- Verify DATABASE_URL is correct
- Check TiDB Cloud whitelist allows Vercel's IP
- Ensure database "sys" exists

### Build Errors
- Ensure all environment variables are set
- Check Prisma client was generated: `npx prisma generate`

### Database Migration
If you need to migrate data from SQLite:
1. Export SQLite data to SQL or JSON
2. Import to TiDB using migration tools
