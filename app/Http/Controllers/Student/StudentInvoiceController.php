<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\StudentInvoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class StudentInvoiceController extends Controller
{
    /**
     * Display a listing of the student's invoices.
     */
    public function index(): Response
    {
        $student = Auth::guard('student')->user();
        
        $invoices = StudentInvoice::where('student_id', $student->id)
            ->latest()
            ->get()
            ->map(fn($inv) => [
                'id' => $inv->id,
                'invoice_number' => $inv->invoice_number,
                'title' => $inv->title,
                'title_ur' => $inv->title_ur,
                'amount' => (float)$inv->amount,
                'due_date' => $inv->due_date->format('Y-m-d'),
                'paid_at' => $inv->paid_at?->format('Y-m-d H:i:s'),
                'payment_method' => $inv->payment_method,
                'status' => $inv->status,
                'receipt_url' => $inv->receipt_path ? asset('storage/' . $inv->receipt_path) : null,
                'admin_notes' => $inv->admin_notes,
            ]);

        return Inertia::render('Student/Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    /**
     * Upload a payment receipt for a specific invoice.
     */
    public function uploadReceipt(Request $request, $id)
    {
        $student = Auth::guard('student')->user();
        $invoice = StudentInvoice::where('student_id', $student->id)->findOrFail($id);

        if (!in_array($invoice->status, ['unpaid', 'overdue'])) {
            return back()->withErrors(['invoice' => 'Receipt can only be uploaded for unpaid or overdue invoices.']);
        }

        $request->validate([
            'receipt' => ['required', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:5120'], // Max 5MB
            'payment_method' => ['required', 'string', 'in:bank_transfer,easy_paisa,jazz_cash,other'],
        ]);

        if ($request->hasFile('receipt')) {
            // Delete old receipt if any
            if ($invoice->receipt_path) {
                Storage::disk('public')->delete($invoice->receipt_path);
            }

            // Secure file name
            $extension = $request->file('receipt')->getClientOriginalExtension();
            $fileName = 'receipt_' . $invoice->invoice_number . '_' . time() . '.' . $extension;
            $path = $request->file('receipt')->storeAs('receipts', $fileName, 'public');

            $invoice->update([
                'receipt_path' => $path,
                'payment_method' => $request->payment_method,
                'status' => 'pending',
            ]);
        }

        return back()->with('success', 'Receipt uploaded successfully. Awaiting administration approval.');
    }

    /**
     * Download a PDF copy of the invoice.
     */
    public function downloadPdf($id)
    {
        $student = Auth::guard('student')->user();
        $invoice = StudentInvoice::where('student_id', $student->id)
            ->with(['student.program'])
            ->findOrFail($id);

        $pdf = Pdf::loadView('pdf.invoice', compact('invoice', 'student'));
        
        return $pdf->download('Invoice_' . $invoice->invoice_number . '.pdf');
    }
}
