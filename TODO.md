# My Team React-Flow Implementation Plan

## Information Gathered
- **Project:** Next.js 16 + React 19, Tailwind CSS v4, dark theme with glass morphism
- **Database:** Prisma + SQLite, `User` model has `id`, `name`, `email`, `createdAt`, `sponsorId`, `referrals[]`
- **Current Team Page:** `/dashboard/team` has a collapsible list/tree view (not graphical)
- **Current API:** `/api/team` returns tree data but **missing `createdAt`** (join date)
- **React-Flow:** **NOT installed** — need to add `@xyflow/react`
- **Design System:** Cyan (`#00d2ff`) + Green (`#00ff88`) accents, `GlassCard`, `StatCard`, `AnimatedBackground`

---

## Plan

### Step 1: Install Dependencies
- Install `@xyflow/react` (React-Flow v12)

### Step 2: Update `/api/team/route.ts`
- Modify `buildTeamTree` to include `createdAt` (join date) and `referralCode` in each node
- Add new endpoint/response field for **current user** as root node
- Add `directReferrals` count (immediate referrals count) for progress bar
- Add `level` calculation based on direct referral count tiers

### Step 3: Create React-Flow Components

#### `components/team/CustomTeamNode.tsx`
- Custom React-Flow node showing:
  - User Name
  - User ID (shortened)
  - Join Date (`createdAt` formatted)
- Different styling for root node (current user) vs downline nodes
- Use glass morphism card design matching the app theme

#### `components/team/TeamFlowGraph.tsx`
- Main React-Flow wrapper component
- Accepts `rootUser` + `children` data
- Converts tree data to React-Flow `nodes` and `edges` with auto-layout
- Uses `useNodesState`, `useEdgesState`, `useReactFlow`, `Background`, `Controls`
- Implements custom layout: root in center, children branch out radially/horizontally
- Dark theme React-Flow styling

#### `components/team/FlowControls.tsx`
- Custom top control bar with:
  - **Zoom In** button
  - **Zoom Out** button
  - **Fit** button (fit view to all nodes)
  - **Center on Me** button (center on root user node)
- Styled with glass morphism + neon accents

### Step 4: Update `/app/dashboard/team/page.tsx`
- Replace current list/tree view with `TeamFlowGraph`
- Add **progress bar at top**:
  - "Need X more direct referrals to reach next level"
  - Visual progress bar showing current / required
- Add **Level indicator**:
  - e.g., "Level 1 (2/3 users)"
- Keep existing stat cards (Total Downline, Active Members, etc.)
- Keep AnimatedBackground and header

### Step 5: Update `app/globals.css`
- Add React-Flow dark theme overrides
- Style handles, edges, minimap, controls to match dark theme

---

## Dependent Files to Edit
| File | Change |
|------|--------|
| `package.json` | Add `@xyflow/react` dependency |
| `app/api/team/route.ts` | Add `createdAt`, root user, `directReferrals`, `level` to response |
| `app/dashboard/team/page.tsx` | Complete rewrite with React-Flow + progress bar + level |
| `components/team/CustomTeamNode.tsx` | **New** - Custom node component |
| `components/team/TeamFlowGraph.tsx` | **New** - Main React-Flow graph component |
| `components/team/FlowControls.tsx` | **New** - Custom controls bar |
| `app/globals.css` | Add React-Flow dark theme styles |

## Follow-up Steps
1. Run `npm install` to install React-Flow
2. Run `npm run dev` to verify the build
3. Test the graphical tree view rendering
4. Test Zoom In/Out, Fit, Center on Me controls
5. Verify progress bar and level display accuracy

