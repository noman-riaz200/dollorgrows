# dollorgrows Implementation TODO

## Phase 1: Database & Schema
- [ ] Update Prisma schema to MySQL + add matrix models
- [ ] Update seed.ts for MySQL compatibility + 15 pools with bonus structure
- [ ] Run prisma migrate and seed

## Phase 2: Global Styles & Theme
- [ ] Update globals.css with exact #00d2ff / #00ff88 accents
- [ ] Add glass-morphism utilities
- [ ] Update layout.tsx metadata + dark-only theme

## Phase 3: Modular Components
- [ ] Create components/ui/GlassCard.tsx
- [ ] Create components/ui/NeonButton.tsx
- [ ] Create components/ui/StatCard.tsx
- [ ] Create components/ui/MatrixGrid.tsx
- [ ] Create components/ui/PoolCard.tsx
- [ ] Create components/ui/ReferralTree.tsx
- [ ] Create components/ui/AnimatedBackground.tsx
- [ ] Create components/ui/Sidebar.tsx

## Phase 4: API Routes — BFS Matrix Core
- [ ] Create app/api/matrix/route.ts
- [ ] Update app/api/investments/route.ts with BFS slot assignment + bonus logic
- [ ] Update app/api/team/route.ts with proper BFS traversal

## Phase 5: Pages — Branding & Design
- [ ] Update app/page.tsx (Landing)
- [ ] Update app/auth/signin/page.tsx
- [ ] Update app/dashboard/layout.tsx
- [ ] Update app/dashboard/page.tsx
- [ ] Update app/dashboard/pools/page.tsx
- [ ] Update app/dashboard/team/page.tsx
- [ ] Update app/dashboard/referrals/page.tsx
- [ ] Update app/dashboard/wallet/page.tsx

## Phase 6: Cleanup & Config
- [ ] Remove src/app/ duplicate
- [ ] Update next.config.ts
- [ ] Update lib/utils.ts helpers
- [ ] Build and test

