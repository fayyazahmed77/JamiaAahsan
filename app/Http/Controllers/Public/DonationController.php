<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DonationController extends Controller
{
    /**
     * Display the Zakat & Sadaqah Donation page.
     */
    public function index(): Response
    {
        return Inertia::render('Public/Donation/Index');
    }
}
