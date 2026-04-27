# Settings Module Implementation

## Steps
- [x] Update `prisma/schema.prisma` — add `avatar` field to User model
- [x] Update `types/next-auth.d.ts` — add `avatar` to Session.user
- [x] Update `lib/auth.ts` — include avatar in JWT & session callbacks
- [x] Create `lib/validations/settings.ts` — Zod schemas for profile, email, PIN
- [x] Create `app/api/settings/route.ts` — GET current user settings
- [x] Create `app/api/settings/profile/route.ts` — PUT update profile (name, phone, country, avatar)
- [x] Create `app/api/settings/email/route.ts` — PUT change email with password verification
- [x] Create `app/api/settings/pin/route.ts` — PUT update 6-digit security PIN
- [x] Rewrite `app/dashboard/settings/page.tsx` — full tabbed settings UI with:
  - Tab 1: Update Profile (avatar upload, name, phone, country)
  - Tab 2: Change Email (new email + current password)
  - Tab 3: Security PIN (6-digit numeric keypad)
- [x] Run `npm run db:push` to apply schema changes
- [x] Fix TypeScript errors (Zod `.issues`, unreachable comparisons, icon imports)
- [x] Build check — settings module compiles cleanly (remaining errors are pre-existing in other files)

