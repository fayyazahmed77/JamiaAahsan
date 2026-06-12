<?php

namespace App\Http\Controllers\Admin\Finance;

use App\Http\Controllers\Controller;
use App\Models\StudentInvoice;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminInvoiceController extends Controller
{
    /**
     * Display listing of all student invoices.
     */
    public function index(Request $request): Response
    {
        $query = StudentInvoice::with('student')
            ->latest();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhere('title', 'like', "%{$search}%")
                  ->orWhereHas('student', function ($sq) use ($search) {
                      $sq->where('name', 'like', "%{$search}%")
                        ->orWhere('student_id_number', 'like', "%{$search}%");
                  });
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $invoices = $query->paginate(15)->withQueryString();

        // Active students list for invoice creation dropdown
        $students = Student::active()
            ->orderBy('name')
            ->get(['id', 'name', 'student_id_number']);

        return Inertia::render('Admin/Invoices/Index', [
            'invoices' => $invoices,
            'students' => $students,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Issue/store a new invoice.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'title' => ['required', 'string', 'max:255'],
            'title_ur' => ['nullable', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:1'],
            'due_date' => ['required', 'date'],
        ]);

        // Generate a unique invoice number
        $year = now()->format('Y');
        $random = Str::upper(Str::random(6));
        $invoiceNumber = "INV-{$year}-{$random}";

        // Ensure unique check
        while (StudentInvoice::where('invoice_number', $invoiceNumber)->exists()) {
            $random = Str::upper(Str::random(6));
            $invoiceNumber = "INV-{$year}-{$random}";
        }

        StudentInvoice::create($validated + [
            'invoice_number' => $invoiceNumber,
            'status' => 'unpaid',
        ]);

        return back()->with('success', 'New invoice issued successfully.');
    }

    /**
     * Approve a pending payment receipt.
     */
    public function approvePayment($id)
    {
        $invoice = StudentInvoice::findOrFail($id);

        if ($invoice->status !== 'pending') {
            return back()->withErrors(['invoice' => 'Only invoices with pending payment proofs can be approved.']);
        }

        $invoice->update([
            'status' => 'paid',
            'paid_at' => now(),
            'admin_notes' => 'Payment receipt approved by administration.',
        ]);

        return back()->with('success', 'Payment proof approved successfully.');
    }

    /**
     * Reject a pending payment receipt.
     */
    public function rejectPayment(Request $request, $id)
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $invoice = StudentInvoice::findOrFail($id);

        if ($invoice->status !== 'pending') {
            return back()->withErrors(['invoice' => 'Only invoices with pending payment proofs can be rejected.']);
        }

        // Delete invalid receipt file
        if ($invoice->receipt_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($invoice->receipt_path);
        }

        $invoice->update([
            'status' => 'unpaid',
            'receipt_path' => null,
            'payment_method' => null,
            'admin_notes' => 'Receipt Rejected: ' . $request->reason,
        ]);

        return back()->with('success', 'Payment proof rejected and invoice reset to unpaid.');
    }
}
