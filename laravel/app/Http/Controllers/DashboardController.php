<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display the dashboard index page.
     */
    public function index()
    {
        return Inertia::render('Dashboard');
    }

    /**
     * Display the referrals page.
     */
    public function referrals()
    {
        return Inertia::render('Dashboard/Referrals');
    }

    /**
     * Display the team page.
     */
    public function team()
    {
        return Inertia::render('Dashboard/Team');
    }

    /**
     * Display the teams page.
     */
    public function teams()
    {
        return Inertia::render('Dashboard/Teams');
    }

    /**
     * Display the commission page.
     */
    public function commission()
    {
        return Inertia::render('Dashboard/Commission');
    }

    /**
     * Display the plans page.
     */
    public function plans()
    {
        return Inertia::render('Dashboard/Plans');
    }

    /**
     * Display the exchange page.
     */
    public function exchange()
    {
        return Inertia::render('Dashboard/Exchange');
    }

    /**
     * Display the settings page.
     */
    public function settings()
    {
        return Inertia::render('Dashboard/Settings');
    }

    /**
     * Display the deposit page.
     */
    public function deposit()
    {
        return Inertia::render('Dashboard/Deposit');
    }

    /**
     * Display the wallet page.
     */
    public function wallet()
    {
        return Inertia::render('Dashboard/Wallet');
    }

    /**
     * Display the withdraw page.
     */
    public function withdraw()
    {
        return Inertia::render('Dashboard/Withdraw');
    }

    /**
     * Display the pools page.
     */
    public function pools()
    {
        return Inertia::render('Dashboard/Pools');
    }

    /**
     * Display the overview page.
     */
    public function overview()
    {
        return Inertia::render('Dashboard/Overview');
    }
}
