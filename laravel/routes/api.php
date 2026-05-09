<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    // Dashboard API
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/activities', [DashboardController::class, 'activities']);
    });

    // Wallet API
    Route::prefix('wallet')->group(function () {
        Route::get('/', [WalletController::class, 'index']);
        Route::post('/deposit', [WalletController::class, 'deposit']);
        Route::post('/withdraw', [WalletController::class, 'withdraw']);
        Route::post('/exchange', [WalletController::class, 'exchange']);
    });

    // Team API
    Route::prefix('team')->group(function () {
        Route::get('/stats', [TeamController::class, 'stats']);
        Route::get('/referrals', [TeamController::class, 'referrals']);
        Route::get('/commissions', [TeamController::class, 'commissions']);
        Route::get('/downline', [TeamController::class, 'downline']);
        Route::get('/commission-summary', [TeamController::class, 'commissionSummary']);
    });

    // Admin API (protected by admin middleware)
    Route::prefix('admin')->middleware(['admin'])->group(function () {
        Route::get('/stats', [AdminController::class, 'dashboardStats']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::put('/users/{id}/status', [AdminController::class, 'updateUserStatus']);
        Route::get('/pools', [AdminController::class, 'pools']);
        Route::post('/pools', [AdminController::class, 'updatePool']);
        Route::get('/deposits', [AdminController::class, 'deposits']);
        Route::get('/withdrawals', [AdminController::class, 'withdrawals']);
        Route::put('/withdrawals/{id}/status', [AdminController::class, 'updateWithdrawalStatus']);
        Route::get('/settings', [AdminController::class, 'settings']);
        Route::post('/settings', [AdminController::class, 'updateSettings']);
    });
});

// Public API routes (if any)
Route::get('/public/pools', function () {
    return response()->json([
        'message' => 'Public pools endpoint'
    ]);
});