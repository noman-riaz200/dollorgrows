<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        return Inertia::render('Admin/Index');
    }

    /**
     * Display the admin users page.
     */
    public function users()
    {
        return Inertia::render('Admin/Users');
    }

    /**
     * Display the admin analytics page.
     */
    public function analytics()
    {
        return Inertia::render('Admin/Analytics');
    }
}
