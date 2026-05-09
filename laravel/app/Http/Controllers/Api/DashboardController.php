<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Wallet;
use App\Models\Investment;
use App\Models\Commission;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics for authenticated user
     */
    public function stats(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Get wallet balance
        $wallet = Wallet::where('user_id', $user->id)->first();
        
        // Get active investments
        $activeInvestments = Investment::where('user_id', $user->id)
            ->where('is_active', true)
            ->count();
        
        $totalInvested = Investment::where('user_id', $user->id)
            ->where('is_active', true)
            ->sum('amount');
        
        // Get total commissions
        $totalCommission = Commission::where('user_id', $user->id)
            ->sum('amount');
        
        // Get pending commissions
        $pendingCommission = Commission::where('user_id', $user->id)
            ->where('status', 'pending')
            ->sum('amount');
        
        // Get referral count
        $referralCount = User::where('sponsor_id', $user->id)->count();

        return response()->json([
            'stats' => [
                'balance' => $wallet ? $wallet->balance_wallet : 0,
                'pool_balance' => $wallet ? $wallet->pool_wallet : 0,
                'active_investments' => $activeInvestments,
                'total_invested' => $totalInvested,
                'total_commission' => $totalCommission,
                'pending_commission' => $pendingCommission,
                'referral_count' => $referralCount,
            ],
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'referral_code' => $user->referral_code,
            ]
        ]);
    }

    /**
     * Get recent activities for dashboard
     */
    public function activities(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Get recent investments
        $recentInvestments = Investment::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($investment) {
                return [
                    'type' => 'investment',
                    'amount' => $investment->amount,
                    'pool' => $investment->pool->name ?? 'Unknown',
                    'date' => $investment->created_at->format('Y-m-d H:i:s'),
                    'status' => $investment->status,
                ];
            });
        
        // Get recent commissions
        $recentCommissions = Commission::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($commission) {
                return [
                    'type' => 'commission',
                    'amount' => $commission->amount,
                    'from_user' => $commission->fromUser->name ?? 'Unknown',
                    'level' => $commission->level,
                    'date' => $commission->created_at->format('Y-m-d H:i:s'),
                    'status' => $commission->status,
                ];
            });

        $activities = $recentInvestments->merge($recentCommissions)
            ->sortByDesc('date')
            ->values()
            ->take(10);

        return response()->json([
            'activities' => $activities
        ]);
    }
}