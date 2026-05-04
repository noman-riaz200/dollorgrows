# Next.js Data Fetcher for MySQL with Prisma

This solution provides a comprehensive data fetching utility for fetching live data from a MySQL database using Prisma in a Next.js application. The utility is designed to serve data for the following pages:

1. **Dashboard** - User stats, wallet balances, team size, recent activity
2. **Referral Link** - User referral code and basic info
3. **Referral Team** - Team tree structure and statistics
4. **Teams** - Team statistics and level breakdown
5. **Team Commission** - Commission history and totals
6. **Plans** - Investment plans and user investments
7. **Exchange History** - Transaction history
8. **Settings** - User profile data

## Installation & Setup

The solution is already integrated into the existing Next.js project. Key components:

1. **Prisma Configuration**: `prisma/schema.prisma` defines the database schema
2. **Database Connection**: `lib/prisma.ts` provides the Prisma client instance
3. **Data Fetcher Utility**: `lib/data-fetcher.ts` contains all data fetching functions
4. **Updated API Route**: `app/api/dashboard/stats/route.ts` uses the new utility

## Data Fetcher Functions

### 1. `fetchDashboardData(userId: string)`
Fetches all data needed for the dashboard page.

**Returns:**
```typescript
{
  stats: {
    totalInvested: number;
    totalEarnings: number;
    availableBalance: number;
    balanceWallet: number;
    poolWallet: number;
    poolCommission: number;
    teamSize: number;
    activeReferrals: number;
    pendingUsers: number;
    sponsorName: string;
    totalWithdrawal: number;
    totalExchange: number;
    dailyROI: number;
  };
  recentActivity: Transaction[];
  chartData: ChartDatum[];
  poolDistribution: PoolDistItem[];
}
```

**Usage:**
```typescript
import { fetchDashboardData } from '@/lib/data-fetcher';

const data = await fetchDashboardData(userId);
console.log(data.stats.balanceWallet); // $1,234.56
```

### 2. `fetchReferralLinkData(userId: string)`
Fetches user data needed for the referral link page.

**Returns:**
```typescript
{
  user: {
    name: string;
    email: string;
    phone: string;
    referralCode: string;
    avatar: string | null;
  };
}
```

### 3. `fetchTeamData(userId: string, depth?: number)`
Fetches team tree structure and statistics.

**Parameters:**
- `userId`: The current user's ID
- `depth`: How many levels deep to fetch (default: 3)

**Returns:**
```typescript
{
  root: TeamMember;
  tree: TeamMember[] | null;
  total: number;
  directReferrals: number;
  level: string;
  levelNumber: number;
  nextLevelRequirement: number;
  progress: {
    current: number;
    required: number;
    remaining: number;
  };
  stats: {
    totalDownline: number;
    activeDownline: number;
    levelCounts: Record<string, number>;
    conversionRate: number;
  };
}
```

### 4. `fetchCommissionData(userId: string)`
Fetches commission history and statistics.

**Returns:**
```typescript
{
  commissions: Commission[];
  stats: {
    totalEarned: number;
    level1Total: number;
    level2Total: number;
    level3Total: number;
    totalCount: number;
  };
}
```

### 5. `fetchExchangeHistory(userId: string)`
Fetches transaction history for exchange, deposit, and withdrawal.

**Returns:**
```typescript
{
  transactions: Transaction[];
}
```

### 6. `fetchUserSettings(userId: string)`
Fetches user profile data for settings page.

**Returns:**
```typescript
{
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    country: string | null;
    phoneCode: string | null;
    avatar: string | null;
    hasPin: boolean;
  };
}
```

### 7. `fetchPlansData(userId: string)`
Fetches investment plans and user's current investments.

**Returns:**
```typescript
{
  plans: Plan[];
  userInvestments: Investment[];
}
```

### 8. `getCurrentUserId()`
Helper function to get the current authenticated user ID from session.

**Returns:** `Promise<string | null>`

## Usage Examples

### Server Component Example

```typescript
// app/dashboard/page.tsx (Server Component)
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchDashboardData } from "@/lib/data-fetcher";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const data = await fetchDashboardData(session.user.id);
  
  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <div>Balance: ${data.stats.balanceWallet}</div>
      <div>Team Size: {data.stats.teamSize}</div>
      {/* Render other data */}
    </div>
  );
}
```

### API Route Example

```typescript
// app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchDashboardData } from "@/lib/data-fetcher";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await fetchDashboardData(session.user.id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
```

### Client Component Example

```typescript
// app/dashboard/client-page.tsx (Client Component - using API route)
"use client";

import { useEffect, useState } from "react";

export default function DashboardClientPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Balance: ${data.stats.balanceWallet}</h1>
      {/* Render other data */}
    </div>
  );
}
```

## Database Schema

The solution works with the following key tables (defined in `prisma/schema.prisma`):

- `users` - User accounts and profiles
- `wallets` - User wallet balances
- `investments` - User investments in pools
- `commissions` - Referral commission records
- `transactions` - Deposit, withdrawal, exchange transactions
- `pools` - Investment pool definitions
- `withdrawal_requests` - Withdrawal requests
- `matrix_slots` - Matrix slot data
- `matrix_bonuses` - Matrix bonus records

## Testing

Two test scripts are provided:

1. `test-db-connection.js` - Tests the MySQL database connection
2. `test-data-fetcher.js` - Tests all data fetcher functions

Run the tests:
```bash
node test-db-connection.js
node test-data-fetcher.js
```

## Example Component

A complete example server component is available at `app/examples/dashboard-server-example.tsx` that demonstrates:

- Server-side data fetching with authentication
- Real-time data display from MySQL
- Responsive UI with stat cards
- Error handling and loading states

## Integration with Existing Pages

The data fetcher utility is designed to work seamlessly with the existing page structure:

- **Dashboard**: Uses `fetchDashboardData()` via API route
- **Referral Link**: Can use `fetchReferralLinkData()`
- **Team Pages**: Can use `fetchTeamData()` and `fetchCommissionData()`
- **Exchange History**: Can use `fetchExchangeHistory()`
- **Settings**: Can use `fetchUserSettings()`
- **Plans**: Can use `fetchPlansData()`

## Performance Considerations

1. **Caching**: Consider implementing caching for frequently accessed data
2. **Pagination**: For large datasets (transactions, commissions), implement pagination
3. **Selective Fields**: The utility uses `select` to fetch only needed fields
4. **Connection Pooling**: Prisma handles connection pooling automatically

## Environment Variables

Ensure these environment variables are set in `.env`:

```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Troubleshooting

1. **Database Connection Issues**: Check MySQL service is running and credentials are correct
2. **Prisma Client Not Generated**: Run `npx prisma generate`
3. **Schema Not Synced**: Run `npx prisma db push` or `npx prisma migrate dev`
4. **Authentication Errors**: Ensure session is properly configured in `lib/auth.ts`

## Conclusion

This data fetcher utility provides a robust, type-safe solution for fetching live data from MySQL using Prisma in a Next.js application. It follows best practices for server-side data fetching, supports all required pages, and integrates seamlessly with the existing project structure.