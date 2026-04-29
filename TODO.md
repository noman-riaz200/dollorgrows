# Dashboard UI/UX Fix TODO

## Plan: Fix Tailwind CSS Layout, Visual Inconsistencies & Responsiveness

---

### Step 1: Critical DOM/Layout Bugs ✅
- [x] `app/dashboard/page.tsx` — Fixed unclosed `<div>`, added responsive text sizing
- [x] `app/dashboard/layout.tsx` — Removed redundant `min-h-screen`, added overflow-x-hidden

### Step 2: Color Standardization (Named → Exact Hex) 🔄
- [ ] `app/dashboard/teams/page.tsx` — Replace `cyan-400`, `emerald-400` with `[#00d2ff]`, `[#00ff88]`
- [ ] `app/dashboard/commission/page.tsx` — Replace all named colors with hex equivalents
- [ ] `app/dashboard/exchange/page.tsx` — Replace named colors with hex equivalents
- [ ] `app/dashboard/plans/page.tsx` — Standardize accent colors, replace raw disabled button

### Step 3: Component Improvements
- [ ] `components/ui/StatCard.tsx` — Add responsive value text sizing
- [ ] `components/ui/NeonButton.tsx` — Ensure consistent disabled styling

### Step 4: CSS Utilities & Responsiveness
- [ ] `app/globals.css` — Add mobile table card-layout utilities, standardize focus rings

### Step 5: Tables & Mobile UX
- [ ] Standardize all table header border colors
- [ ] Add mobile-friendly responsive table patterns

### Step 6: Testing
- [ ] Run `npm run dev` and verify all pages render correctly
- [ ] Test mobile viewport (375px, 768px, 1440px)
