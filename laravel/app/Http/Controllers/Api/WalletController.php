<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Support\Facades\Validator;

class WalletController extends Controller
{
    /**
     * Get wallet information for authenticated user
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $wallet = Wallet::where('user_id', $user->id)->first();
        
        if (!$wallet) {
            // Create wallet if doesn't exist
            $wallet = Wallet::create([
                'user_id' => $user->id,
                'balance_wallet' => 0,
                'pool_wallet' => 0,
                'pool_commission' => 0,
            ]);
        }

        // Get recent transactions
        $transactions = Transaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return response()->json([
            'wallet' => $wallet,
            'transactions' => $transactions,
            'total_balance' => $wallet->balance_wallet + $wallet->pool_wallet
        ]);
    }

    /**
     * Deposit funds to wallet
     */
    public function deposit(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:10',
            'payment_method' => 'required|string|in:bank_transfer,crypto,card',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $wallet = Wallet::where('user_id', $user->id)->first();
        
        if (!$wallet) {
            $wallet = Wallet::create([
                'user_id' => $user->id,
                'balance_wallet' => 0,
                'pool_wallet' => 0,
                'pool_commission' => 0,
            ]);
        }

        // Create transaction record
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'type' => 'deposit',
            'amount' => $request->amount,
            'status' => 'pending',
            'description' => 'Deposit via ' . $request->payment_method,
            'reference' => 'DEP-' . strtoupper(uniqid()),
        ]);

        return response()->json([
            'message' => 'Deposit request submitted successfully',
            'transaction' => $transaction,
            'wallet' => $wallet
        ]);
    }

    /**
     * Withdraw funds from wallet
     */
    public function withdraw(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:10',
            'wallet_type' => 'required|string|in:balance,pool',
            'withdrawal_method' => 'required|string|in:bank,crypto',
            'account_details' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $wallet = Wallet::where('user_id', $user->id)->first();
        
        if (!$wallet) {
            return response()->json(['error' => 'Wallet not found'], 404);
        }

        $availableBalance = $request->wallet_type === 'balance' 
            ? $wallet->balance_wallet 
            : $wallet->pool_wallet;

        if ($request->amount > $availableBalance) {
            return response()->json(['error' => 'Insufficient balance'], 400);
        }

        // Create withdrawal request
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'type' => 'withdrawal',
            'amount' => $request->amount,
            'status' => 'pending',
            'description' => 'Withdrawal from ' . $request->wallet_type . ' wallet via ' . $request->withdrawal_method,
            'reference' => 'WTH-' . strtoupper(uniqid()),
            'metadata' => [
                'wallet_type' => $request->wallet_type,
                'withdrawal_method' => $request->withdrawal_method,
                'account_details' => $request->account_details,
            ]
        ]);

        return response()->json([
            'message' => 'Withdrawal request submitted successfully',
            'transaction' => $transaction,
            'wallet' => $wallet
        ]);
    }

    /**
     * Exchange between wallets
     */
    public function exchange(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
            'from_wallet' => 'required|string|in:balance,pool',
            'to_wallet' => 'required|string|in:balance,pool',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->from_wallet === $request->to_wallet) {
            return response()->json(['error' => 'Cannot exchange to same wallet'], 400);
        }

        $wallet = Wallet::where('user_id', $user->id)->first();
        
        if (!$wallet) {
            return response()->json(['error' => 'Wallet not found'], 404);
        }

        $fromBalance = $request->from_wallet === 'balance' 
            ? $wallet->balance_wallet 
            : $wallet->pool_wallet;

        if ($request->amount > $fromBalance) {
            return response()->json(['error' => 'Insufficient balance'], 400);
        }

        // Perform exchange
        if ($request->from_wallet === 'balance') {
            $wallet->balance_wallet -= $request->amount;
            $wallet->pool_wallet += $request->amount;
        } else {
            $wallet->pool_wallet -= $request->amount;
            $wallet->balance_wallet += $request->amount;
        }

        $wallet->save();

        // Create transaction record
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'type' => 'exchange',
            'amount' => $request->amount,
            'status' => 'completed',
            'description' => 'Exchange from ' . $request->from_wallet . ' to ' . $request->to_wallet,
            'reference' => 'EXC-' . strtoupper(uniqid()),
            'metadata' => [
                'from_wallet' => $request->from_wallet,
                'to_wallet' => $request->to_wallet,
            ]
        ]);

        return response()->json([
            'message' => 'Exchange completed successfully',
            'transaction' => $transaction,
            'wallet' => $wallet
        ]);
    }
}