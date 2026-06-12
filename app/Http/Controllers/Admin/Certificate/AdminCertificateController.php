<?php

namespace App\Http\Controllers\Admin\Certificate;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AdminCertificateController extends Controller
{
    public function index(): Response
    {
        $certificates = Certificate::with('student')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        $students = Student::get(['id', 'name', 'student_id_number']);

        return Inertia::render('Admin/Certificate/Index', [
            'certificates' => $certificates,
            'students' => $students,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'type' => 'required|in:completion,hifz,participation',
            'title' => 'required|string|max:255',
            'title_ur' => 'nullable|string|max:255',
            'issued_date' => 'required|date',
            'valid_until' => 'nullable|date|after_or_equal:issued_date',
        ]);

        $validated['created_by'] = auth()->id();

        $certificate = Certificate::create($validated);

        // Generate PDF if Barryvdh\DomPDF\Facade\Pdf exists
        $this->generatePdfFile($certificate);

        return redirect()->route('admin.certificates.index')->with('success', 'Certificate issued successfully.');
    }

    public function destroy(Certificate $certificate): RedirectResponse
    {
        if ($certificate->pdf_path) {
            Storage::disk('public')->delete($certificate->pdf_path);
        }
        $certificate->delete();

        return redirect()->route('admin.certificates.index')->with('success', 'Certificate deleted successfully.');
    }

    public function download(Certificate $certificate)
    {
        if (!$certificate->pdf_path || !Storage::disk('public')->exists($certificate->pdf_path)) {
            $this->generatePdfFile($certificate);
        }

        if ($certificate->pdf_path && Storage::disk('public')->exists($certificate->pdf_path)) {
            return Storage::disk('public')->download($certificate->pdf_path, 'Certificate_' . $certificate->code . '.pdf');
        }

        return redirect()->back()->with('error', 'PDF generation is currently compiling. Please try again later.');
    }

    private function generatePdfFile(Certificate $certificate): void
    {
        try {
            if (class_exists(\Barryvdh\DomPDF\Facade\Pdf::class)) {
                $certificate->load('student');
                $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.certificate', compact('certificate'))
                    ->setPaper('a4', 'landscape');
                
                $pdfPath = 'certificates/' . $certificate->code . '.pdf';
                Storage::disk('public')->put($pdfPath, $pdf->output());
                $certificate->update(['pdf_path' => $pdfPath]);
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Certificate PDF generation failed: " . $e->getMessage());
        }
    }
}
