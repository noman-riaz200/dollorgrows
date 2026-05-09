<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdminController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Health check routes (for deployment monitoring)
Route::get('/health', function () {
    $status = [
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'service' => 'Dollar Growth API',
        'version' => '1.0.0',
    ];

    // Check database connection
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $status['database'] = 'connected';
    } catch (\Exception $e) {
        $status['database'] = 'disconnected';
        $status['status'] = 'unhealthy';
        $status['database_error'] = $e->getMessage();
    }

    // Check cache
    try {
        \Illuminate\Support\Facades\Cache::put('health_check', 'ok', 10);
        $cacheCheck = \Illuminate\Support\Facades\Cache::get('health_check');
        $status['cache'] = $cacheCheck === 'ok' ? 'working' : 'broken';
    } catch (\Exception $e) {
        $status['cache'] = 'error';
        $status['status'] = 'unhealthy';
        $status['cache_error'] = $e->getMessage();
    }

    return response()->json($status, $status['status'] === 'healthy' ? 200 : 503);
});

// Public routes
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/services', function () {
    return Inertia::render('Services');
})->name('services');

Route::get('/privacy', function () {
    return Inertia::render('Privacy');
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');

Route::get('/disclaimer', function () {
    return Inertia::render('Disclaimer');
})->name('disclaimer');

Route::get('/kyc', function () {
    return Inertia::render('Kyc');
})->name('kyc');

Route::get('/aml', function () {
    return Inertia::render('Aml');
})->name('aml');

// Authentication routes (handled by Breeze)
require __DIR__.'/auth.php';

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard main
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Dashboard subpages
    Route::get('/dashboard/referrals', [DashboardController::class, 'referrals'])->name('dashboard.referrals');
    Route::get('/dashboard/team', [DashboardController::class, 'team'])->name('dashboard.team');
    Route::get('/dashboard/teams', [DashboardController::class, 'teams'])->name('dashboard.teams');
    Route::get('/dashboard/commission', [DashboardController::class, 'commission'])->name('dashboard.commission');
    Route::get('/dashboard/plans', [DashboardController::class, 'plans'])->name('dashboard.plans');
    Route::get('/dashboard/exchange', [DashboardController::class, 'exchange'])->name('dashboard.exchange');
    Route::get('/dashboard/settings', [DashboardController::class, 'settings'])->name('dashboard.settings');
    Route::get('/dashboard/deposit', [DashboardController::class, 'deposit'])->name('dashboard.deposit');
    Route::get('/dashboard/wallet', [DashboardController::class, 'wallet'])->name('dashboard.wallet');
    Route::get('/dashboard/withdraw', [DashboardController::class, 'withdraw'])->name('dashboard.withdraw');
    Route::get('/dashboard/pools', [DashboardController::class, 'pools'])->name('dashboard.pools');
    Route::get('/dashboard/overview', [DashboardController::class, 'overview'])->name('dashboard.overview');
    
    // Profile routes (from Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes (with admin middleware)
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users');
    Route::get('/analytics', [AdminController::class, 'analytics'])->name('admin.analytics');
    // Additional admin routes will be added later
});
