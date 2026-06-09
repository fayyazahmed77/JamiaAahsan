<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ContactController extends Controller
{
    /**
     * Display the Contact and Location page.
     */
    public function index(): Response
    {
        return Inertia::render('Public/Contact');
    }

    /**
     * Store feedback or contact query from a website visitor.
     */
    public function store(\App\Http\Requests\Public\ContactRequest $request): RedirectResponse
    {

        Feedback::create([
            'name' => $request->name,
            'email' => $request->email,
            'country' => $request->country,
            'phone' => $request->phone,
            'comment' => $request->comment,
            'rating' => $request->rating,
        ]);

        return back()->with('success', 'Thank you for your feedback! Your message has been received.');
    }
}
