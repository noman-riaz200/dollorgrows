# Wallet Dashboard Implementation TODO

## Steps
- [ ] Create/rewrite `app/dashboard/wallet/page.tsx` with all features
  - [ ] Fix syntax error (stray `status: string;` in imports)
  - [ ] Connect Wallet button (MetaMask via window.ethereum)
  - [ ] BEP20 status indicator card
  - [ ] Exchange form (source/target wallet + amount)
  - [ ] Withdrawal section: Total Available + Total Donated cards
  - [ ] Withdrawal form with address + amount
  - [ ] Transaction table with status badges (Pending/Success/Failed)
  - [ ] Toast notifications via sonner
  - [ ] Proper data fetching from /api/wallet and /api/wallet/deposit
- [ ] Run `npm run build` to verify
  - Transaction table with status badges (Pending=amber, Success=green, Failed=red)
  - Toast notifications via sonner
- [x] `app/dashboard/exchange/page.tsx` — Real exchange history table

## Testing
- [ ] Run `npm run dev`
- [ ] Test MetaMask connect
- [ ] Test exchange flow
- [ ] Test withdrawal flow

