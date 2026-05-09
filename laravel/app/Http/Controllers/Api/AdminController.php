<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Pool;
use App\Models\Investment;
use App\Models\Transaction;
use App\Models\Commission;
use App\Models\WithdrawalRequest;
use App\Models\Settings;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * Check if user is admin
     */
    private function checkAdmin()
    {
        $user = Auth::user();
        return $user && $user->role === 'admin';
    }

    /**
     * Get admin dashboard statistics
     */
    public function dashboardStats(Request $request)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $totalUsers = User::count();
        $activeUsers = User::where('status', 'active')->count();
        $pendingUsers = User::where('status', 'pending')->count();
        
        $totalInvestments = Investment::sum('amount');
        $activeInvestments = Investment::where('is_active', true)->sum('amount');
        
        $totalDeposits = Transaction::where('type', 'deposit')
            ->where('status', 'completed')
            ->sum('amount');
        
        $totalWithdrawals = Transaction::where('type', 'withdrawal')
            ->where('status', 'completed')
            ->sum('amount');
        
        $pendingWithdrawals = WithdrawalRequest::where('status', 'pending')
            ->sum('amount');
        
        $totalCommissions = Commission::sum('amount');
        $paidCommissions = Commission::where('status', 'paid')->sum('amount');

        // Recent activities
        $recentUsers = User::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        $recentTransactions = Transaction::orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'pending_users' => $pendingUsers,
                'total_investments' => $totalInvestments,
                'active_investments' => $activeInvestments,
                'total_deposits' => $totalDeposits,
                'total_withdrawals' => $totalWithdrawals,
                'pending_withdrawals' => $pendingWithdrawals,
                'total_commissions' => $totalCommissions,
                'paid_commissions' => $paidCommissions,
            ],
            'recent_users' => $recentUsers,
            'recent_transactions' => $recentTransactions,
            'timestamp' => now()->toDateTimeString(),
        ]);
    }

    /**
     * Get all users with pagination
     */
    public function users(Request $request)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $perPage = $request->get('per_page', 20);
        $search = $request->get('search', '');
        $status = $request->get('status', '');

        $query = User::with(['wallet', 'investments' => function($query) {
            $query->where('is_active', true);
        }]);

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('referral_code', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $formattedUsers = $users->map(function ($user) {
            $totalInvested = $user->investments->sum('amount');
            $referralCount = User::where('sponsor_id', $user->id)->count();
            
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'country' => $user->country,
                'status' => $user->status,
                'role' => $user->role,
                'referral_code' => $user->referral_code,
                'sponsor_id' => $user->sponsor_id,
                'total_invested' => $totalInvested,
                'referral_count' => $referralCount,
                'wallet_balance' => $user->wallet ? $user->wallet->balance_wallet : 0,
                'pool_balance' => $user->wallet ? $user->wallet->pool_wallet : 0,
                'join_date' => $user->created_at->format('Y-m-d H:i:s'),
                'last_login' => $user->last_login,
            ];
        });

        return response()->json([
            'users' => $formattedUsers,
            'pagination' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
            ]
        ]);
    }

    /**
     * Update user status
     */
    public function updateUserStatus(Request $request, $id)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,pending,suspended,blocked',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $oldStatus = $user->status;
        $user->status = $request->status;
        $user->save();

        return response()->json([
            'message' => 'User status updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'old_status' => $oldStatus,
                'new_status' => $user->status,
            ]
        ]);
    }

    /**
     * Get all pools
     */
    public function pools(Request $request)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $pools = Pool::withCount(['investments' => function($query) {
            $query->where('is_active', true);
        }])
        ->withSum(['investments' => function($query) {
            $query->where('is_active', true);
        }], 'amount')
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json([
            'pools' => $pools,
            'count' => $pools->count(),
        ]);
    }

    /**
     * Create or update pool
     */
    public function updatePool(Request $request)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'id' => 'nullable|exists:pools,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'minimum_investment' => 'required|numeric|min:0',
            'maximum_investment' => 'required|numeric|min:0|gte:minimum_investment',
            'daily_return' => 'required|numeric|min:0|max:100',
            'duration_days' => 'required|integer|min:1',
            'is_active' => 'boolean',
            'total_capacity' => 'nullable|numeric|min:0',
            'commission_level_1' => 'required|numeric|min:0|max:100',
            'commission_level_2' => 'required|numeric|min:0|max:100',
            'commission_level_3' => 'required|numeric|min:0|max:100',
            'bonus_percent' => 'nullable|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        
        if ($request->has('id')) {
            $pool = Pool::find($request->id);
            $pool->update($data);
            $message = 'Pool updated successfully';
        } else {
            $pool = Pool::create($data);
            $message = 'Pool created successfully';
        }

        return response()->json([
            'message' => $message,
            'pool' => $pool
        ]);
    }

    /**
     * Get deposit requests
     */
    public function deposits(Request $request)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $deposits = Transaction::where('type', 'deposit')
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'deposits' => $deposits,
            'pagination' => [
                'total' => $deposits->total(),
                'per_page' => $deposits->perPage(),
                'current_page' => $deposits->currentPage(),
                'last_page' => $deposits->lastPage(),
            ]
        ]);
    }

    /**
     * Get withdrawal requests
     */
    public function withdrawals(Request $request)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $withdrawals = WithdrawalRequest::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'withdrawals' => $withdrawals,
            'pagination' => [
                'total' => $withdrawals->total(),
                'per_page' => $withdrawals->perPage(),
                'current_page' => $withdrawals->currentPage(),
                'last_page' => $withdrawals->lastPage(),
            ]
        ]);
    }

    /**
     * Update withdrawal status
     */
    public function updateWithdrawalStatus(Request $request, $id)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,approved,rejected,completed',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $withdrawal = WithdrawalRequest::find($id);
        
        if (!$withdrawal) {
            return response()->json(['error' => 'Withdrawal request not found'], 404);
        }

        $oldStatus = $withdrawal->status;
        $withdrawal->status = $request->status;
        
        if ($request->notes) {
            $withdrawal->admin_notes = $request->notes;
        }
        
        $withdrawal->processed_at = now();
        $withdrawal->save();

        // If approved, deduct from user's wallet
        if ($request->status === 'approved' && $oldStatus !== 'approved') {
            $user = $withdrawal->user;
            $wallet = $user->wallet;
            
            if ($wallet) {
                if ($withdrawal->wallet_type === 'balance') {
                    $wallet->balance_wallet -= $withdrawal->amount;
                } else {
                    $wallet->pool_wallet -= $withdrawal->amount;
                }
                $wallet->save();
            }
        }

        return response()->json([
            'message' => 'Withdrawal status updated successfully',
            'withdrawal' => $withdrawal
        ]);
    }

    /**
     * Get system settings
     */
    public function settings(Request $request)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $settings = Settings::all()->pluck('value', 'key');

        return response()->json([
            'settings' => $settings
        ]);
    }

    /**
     * Update system settings
     */
    public function updateSettings(Request $request)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $settings = $request->all();
        
        foreach ($settings as $key => $value) {
            Settings::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => $settings
        ]);
    }
}