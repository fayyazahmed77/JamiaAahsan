<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentSupportController extends Controller
{
    /**
     * Display a listing of support tickets.
     */
    public function index(): Response
    {
        $tickets = SupportTicket::where('student_id', Auth::guard('student')->id())
            ->latest()
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'subject' => $t->subject,
                'category' => $t->category,
                'message' => $t->message,
                'status' => $t->status,
                'admin_response' => $t->admin_response,
                'created_at' => $t->created_at->format('Y-m-d H:i:s'),
                'resolved_at' => $t->resolved_at?->format('Y-m-d H:i:s'),
            ]);

        return Inertia::render('Student/Support/Index', [
            'tickets' => $tickets
        ]);
    }

    /**
     * Store a newly created support ticket in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject'  => ['required', 'string', 'max:200'],
            'category' => ['required', 'in:academic,financial,technical,other'],
            'message'  => ['required', 'string', 'max:1500'],
        ]);

        Auth::guard('student')->user()->supportTickets()->create($validated);

        return back()->with('success', 'Support ticket submitted successfully.');
    }
}
