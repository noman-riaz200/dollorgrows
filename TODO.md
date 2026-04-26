# Modern Login & Register Pages - Implementation Plan

## Files to Create/Edit

### 1. Prisma Schema Update
- [x] `prisma/schema.prisma` - Add phone, country, phoneCountryCode fields to User model

### 2. API Routes
- [x] `app/api/auth/register/route.ts` - Create registration API endpoint
- [x] `app/api/auth/geoip/route.ts` - Create GeoIP detection API endpoint

### 3. Utility Libraries
- [x] `lib/countries.ts` - Country data with flags and dial codes
- [x] `lib/geoip.ts` - Geolocation helper
- [x] `lib/validations/auth.ts` - Zod validation schemas

### 4. UI Components
- [x] `components/ui/CountrySelect.tsx` - Country dropdown with flags
- [x] `components/ui/PhoneInput.tsx` - Phone input with country code

### 5. Auth Pages
- [x] `app/auth/signin/page.tsx` - Redesign login page (dark neon, Google sign-in, remember me)
- [x] `app/auth/register/page.tsx` - Create register page (dark neon, auto-detect country, referral code)

### 6. Config Updates
- [x] `lib/auth.ts` - Add Google OAuth provider
- [x] `middleware.ts` - Ensure auth routes are public

### 7. Database Migration
- [ ] Run `npx prisma db push` to apply schema changes

### 8. Build & Test
- [ ] Run `npm run build` to verify compilation

