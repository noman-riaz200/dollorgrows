<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

Route::get('/health', function () {
    $status = [
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'service' => 'Dollar Growth API',
        'version' => '1.0.0',
    ];

    // Check database connection
    try {
        DB::connection()->getPdo();
        $status['database'] = 'connected';
    } catch (\Exception $e) {
        $status['database'] = 'disconnected';
        $status['status'] = 'unhealthy';
        $status['database_error'] = $e->getMessage();
    }

    // Check cache
    try {
        Cache::put('health_check', 'ok', 10);
        $cacheCheck = Cache::get('health_check');
        $status['cache'] = $cacheCheck === 'ok' ? 'working' : 'broken';
    } catch (\Exception $e) {
        $status['cache'] = 'error';
        $status['status'] = 'unhealthy';
        $status['cache_error'] = $e->getMessage();
    }

    // Check storage
    try {
        $storagePath = storage_path();
        $status['storage'] = is_writable($storagePath) ? 'writable' : 'readonly';
        if ($status['storage'] === 'readonly') {
            $status['status'] = 'degraded';
        }
    } catch (\Exception $e) {
        $status['storage'] = 'error';
        $status['storage_error'] = $e->getMessage();
    }

    // Application metrics
    $status['metrics'] = [
        'php_version' => PHP_VERSION,
        'laravel_version' => app()->version(),
        'environment' => app()->environment(),
        'timezone' => config('app.timezone'),
        'maintenance_mode' => app()->isDownForMaintenance(),
    ];

    return response()->json($status, $status['status'] === 'healthy' ? 200 : 503);
});

Route::get('/health/detailed', function () {
    if (!app()->environment('local') && !request()->hasValidSignature()) {
        abort(403);
    }

    $details = [
        'system' => [
            'php_version' => PHP_VERSION,
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
            'server_name' => $_SERVER['SERVER_NAME'] ?? 'unknown',
            'memory_limit' => ini_get('memory_limit'),
            'max_execution_time' => ini_get('max_execution_time'),
        ],
        'application' => [
            'name' => config('app.name'),
            'env' => app()->environment(),
            'debug' => config('app.debug'),
            'url' => config('app.url'),
            'timezone' => config('app.timezone'),
            'locale' => config('app.locale'),
            'maintenance_mode' => app()->isDownForMaintenance(),
        ],
        'database' => [],
        'cache' => [],
        'queues' => [],
    ];

    // Database connections
    foreach (config('database.connections', []) as $name => $config) {
        try {
            DB::connection($name)->getPdo();
            $details['database'][$name] = 'connected';
        } catch (\Exception $e) {
            $details['database'][$name] = 'disconnected: ' . $e->getMessage();
        }
    }

    // Cache stores
    foreach (config('cache.stores', []) as $name => $config) {
        try {
            Cache::store($name)->put('health_check', 'ok', 10);
            $check = Cache::store($name)->get('health_check');
            $details['cache'][$name] = $check === 'ok' ? 'working' : 'broken';
        } catch (\Exception $e) {
            $details['cache'][$name] = 'error: ' . $e->getMessage();
        }
    }

    return response()->json($details);
});