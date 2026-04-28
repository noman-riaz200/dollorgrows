# DollorGrows Implementation Plan

## Phase 1: Schema & API (COMPLETED)
- [x] Update `prisma/schema.prisma` — add Settings, Notification, DailyProfit models + status/network fields
- [x] Create `app/api/admin/deposits/route.ts` — GET pending + POST approve/reject
- [x] Create `app/api/admin/withdrawals/route.ts` — GET pending + POST approve/reject
- [x] Create `app/api/admin/users/[id]/block/route.ts` — POST toggle block/unblock
- [x] Create `app/api/admin/settings/route.ts` — GET/PUT platform config
- [x] Create `app/api/admin/commissions/route.ts` — GET commission report
- [x] Create `app/api/profit/claim/route.ts` — POST daily profit claiming
- [x] Create `app/api/notifications/route.ts` — GET user notifications
- [x] Create `app/api/notifications/read/route.ts` — POST mark as read
- [x] Create `app/api/settings/public/route.ts` — GET public settings (deposit addresses)
- [x] Update `app/api/wallet/deposit/route.ts` — USDT TxID flow with pending status
- [x] Update `middleware.ts` — admin role checks + blocked user protection
- [x] Fix `app/admin/page.tsx` — full admin panel with pools/deposits/withdrawals/users tabs
- [x] Run `npx prisma db push` to apply schema changes

## Phase 2: Frontend Pages (IN PROGRESS)
- [ ] Fix `app/dashboard/commission/page.tsx` — real commission history with levels
- [ ] Fix `app/dashboard/teams/page.tsx` — team stats/content
- [ ] Fix `app/dashboard/exchange/page.tsx` — exchange transaction history
- [ ] Update `app/dashboard/wallet/page.tsx` — USDT deposit flow with QR + TxID

## Phase 3: Build & Polish
- [ ] TypeScript build check
- [ ] Fix remaining lint errors
- [ ] Test admin approval flows
