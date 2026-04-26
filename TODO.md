# DollorGrows MySQL + Email/Password Migration TODO

## Phase 1: Core Schema & Auth
- [x] 1. Update `prisma/schema.prisma` — MySQL datasource, new User/Wallet/Investment/Transaction models
- [x] 2. Update `lib/auth.ts` — Email/password Credentials provider with bcryptjs
- [x] 3. Update `types/next-auth.d.ts` — New Session/User types
- [x] 4. Update `prisma/seed.ts` — Seed with hashed passwords

## Phase 2: API Routes
- [x] 5. Update `app/api/admin/users/route.ts`
- [x] 6. Update `app/api/dashboard/stats/route.ts`
- [x] 7. Update `app/api/investments/route.ts`
- [x] 8. Update `app/api/matrix/route.ts`
- [x] 9. Update `app/api/team/route.ts`
- [x] 10. Update `app/api/wallet/deposit/route.ts`

## Phase 3: Pages & Components
- [x] 11. Rewrite `app/auth/signin/page.tsx` — Email/password form
- [x] 12. Update `app/dashboard/layout.tsx`
- [x] 13. Update `app/dashboard/page.tsx`
- [x] 14. Update `app/dashboard/wallet/page.tsx`
- [x] 15. Update `app/dashboard/team/page.tsx`
- [x] 16. Update `app/admin/page.tsx`
- [x] 17. Update `app/dashboard/referrals/page.tsx`

## Phase 4: Environment & Verification
- [x] 18. Update `.env` DATABASE_URL to MySQL format
- [x] 19. Run `npx prisma generate`
- [x] 20. Run `npx prisma db push`
- [x] 21. Run `npm run db:seed`
- [x] 22. Start MySQL Docker container

