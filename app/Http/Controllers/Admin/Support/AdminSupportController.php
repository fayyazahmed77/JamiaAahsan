<?php

namespace App\Http\Controllers\Admin\Support;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminSupportController extends Controller
{
    /**
     * Display a listing of support tickets for administrators.
     */
    public function index(Request $request): Response
    {
        $query = SupportTicket::with('student')
            ->latest();

        // Filter by search query (subject, message, student name)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%")
                  ->orWhereHas('student', function ($sq) use ($search) {
                      $sq->where('name', 'like', "%{$search}%")
                        ->orWhere('student_id_number', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $tickets = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Support/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['search', 'category', 'status']),
        ]);
    }

    /**
     * Resolve a student support ticket by adding admin response.
     */
    public function resolve(Request $request, $id)
    {
        $validated = $request->validate([
            'admin_response' => ['required', 'string', 'max:1500'],
        ]);

        $ticket = SupportTicket::findOrFail($id);

        $ticket->update([
            'admin_response' => $validated['admin_response'],
            'status' => 'resolved',
            'resolved_by' => Auth::id(),
            'resolved_at' => now(),
        ]);

        return back()->with('success', 'Support ticket resolved successfully.');
    }
}
