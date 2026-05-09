<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Commission;
use App\Models\Investment;

class TeamController extends Controller
{
    /**
     * Get team statistics for authenticated user
     */
    public function stats(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Get direct referrals (level 1)
        $directReferrals = User::where('sponsor_id', $user->id)->count();
        
        // Get total team size (all levels)
        $totalTeam = $this->getTotalTeamSize($user->id);
        
        // Get team investment volume
        $teamInvestments = $this->getTeamInvestments($user->id);
        
        // Get commission summary
        $commissionSummary = Commission::where('user_id', $user->id)
            ->selectRaw('level, sum(amount) as total_amount, count(*) as count')
            ->groupBy('level')
            ->get()
            ->keyBy('level');

        return response()->json([
            'direct_referrals' => $directReferrals,
            'total_team' => $totalTeam,
            'team_investments' => $teamInvestments,
            'commission_summary' => $commissionSummary,
            'referral_link' => url('/register?ref=' . $user->referral_code),
            'referral_code' => $user->referral_code,
        ]);
    }

    /**
     * Get direct referrals list
     */
    public function referrals(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $referrals = User::where('sponsor_id', $user->id)
            ->with(['investments' => function($query) {
                $query->where('is_active', true);
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($referral) {
                $totalInvested = $referral->investments->sum('amount');
                
                return [
                    'id' => $referral->id,
                    'name' => $referral->name,
                    'email' => $referral->email,
                    'join_date' => $referral->created_at->format('Y-m-d'),
                    'status' => $referral->status,
                    'total_invested' => $totalInvested,
                    'investment_count' => $referral->investments->count(),
                ];
            });

        return response()->json([
            'referrals' => $referrals,
            'count' => $referrals->count()
        ]);
    }

    /**
     * Get commission history
     */
    public function commissions(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $commissions = Commission::where('user_id', $user->id)
            ->with(['fromUser'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $formattedCommissions = $commissions->map(function ($commission) {
            return [
                'id' => $commission->id,
                'date' => $commission->created_at->format('Y-m-d H:i:s'),
                'from_user' => $commission->fromUser->name ?? 'Unknown',
                'level' => $commission->level,
                'amount' => $commission->amount,
                'status' => $commission->status,
                'description' => $commission->description,
            ];
        });

        return response()->json([
            'commissions' => $formattedCommissions,
            'pagination' => [
                'total' => $commissions->total(),
                'per_page' => $commissions->perPage(),
                'current_page' => $commissions->currentPage(),
                'last_page' => $commissions->lastPage(),
            ]
        ]);
    }

    /**
     * Get downline team structure
     */
    public function downline(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $level = $request->get('level', 1);
        $maxLevel = min($level, 5); // Limit to 5 levels for performance

        $downline = $this->getDownlineUsers($user->id, 1, $maxLevel);

        return response()->json([
            'downline' => $downline,
            'current_level' => $level,
            'max_level' => $maxLevel,
        ]);
    }

    /**
     * Get commission summary by level
     */
    public function commissionSummary(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $summary = [];
        for ($level = 1; $level <= 5; $level++) {
            $total = Commission::where('user_id', $user->id)
                ->where('level', $level)
                ->sum('amount');
            
            $count = Commission::where('user_id', $user->id)
                ->where('level', $level)
                ->count();

            $summary[] = [
                'level' => $level,
                'total_amount' => $total,
                'count' => $count,
                'percentage' => $count > 0 ? round(($total / max(1, $total)) * 100, 1) : 0,
            ];
        }

        return response()->json([
            'summary' => $summary,
            'total_commission' => array_sum(array_column($summary, 'total_amount')),
            'total_count' => array_sum(array_column($summary, 'count')),
        ]);
    }

    /**
     * Helper: Get total team size recursively
     */
    private function getTotalTeamSize($userId, $level = 1, $maxLevel = 10)
    {
        if ($level > $maxLevel) {
            return 0;
        }

        $direct = User::where('sponsor_id', $userId)->count();
        $total = $direct;

        $referrals = User::where('sponsor_id', $userId)->get();
        foreach ($referrals as $referral) {
            $total += $this->getTotalTeamSize($referral->id, $level + 1, $maxLevel);
        }

        return $total;
    }

    /**
     * Helper: Get team investments recursively
     */
    private function getTeamInvestments($userId, $level = 1, $maxLevel = 10)
    {
        if ($level > $maxLevel) {
            return 0;
        }

        $directUsers = User::where('sponsor_id', $userId)->pluck('id');
        $directInvestments = Investment::whereIn('user_id', $directUsers)
            ->where('is_active', true)
            ->sum('amount');

        $total = $directInvestments;

        foreach ($directUsers as $directUserId) {
            $total += $this->getTeamInvestments($directUserId, $level + 1, $maxLevel);
        }

        return $total;
    }

    /**
     * Helper: Get downline users recursively
     */
    private function getDownlineUsers($userId, $currentLevel, $maxLevel)
    {
        if ($currentLevel > $maxLevel) {
            return [];
        }

        $users = User::where('sponsor_id', $userId)
            ->with(['investments' => function($query) {
                $query->where('is_active', true);
            }])
            ->get()
            ->map(function ($user) use ($currentLevel, $maxLevel) {
                $totalInvested = $user->investments->sum('amount');
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'level' => $currentLevel,
                    'join_date' => $user->created_at->format('Y-m-d'),
                    'total_invested' => $totalInvested,
                    'investment_count' => $user->investments->count(),
                    'status' => $user->status,
                    'downline' => $this->getDownlineUsers($user->id, $currentLevel + 1, $maxLevel),
                ];
            });

        return $users;
    }
}