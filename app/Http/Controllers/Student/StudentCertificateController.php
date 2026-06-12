<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StudentCertificateController extends Controller
{
    public function index(): Response
    {
        $student = Auth::guard('student')->user();
        $certificates = Certificate::where('student_id', $student->id)
            ->orderBy('issued_date', 'desc')
            ->get();

        return Inertia::render('Student/Certificate/Index', [
            'certificates' => $certificates,
        ]);
    }

    public function download(Certificate $certificate)
    {
        $student = Auth::guard('student')->user();
        if ($certificate->student_id !== $student->id) {
            abort(403, 'Unauthorized action.');
        }

        if (!$certificate->pdf_path || !Storage::disk('public')->exists($certificate->pdf_path)) {
            $this->generatePdfFile($certificate);
        }

        if ($certificate->pdf_path && Storage::disk('public')->exists($certificate->pdf_path)) {
            return Storage::disk('public')->download($certificate->pdf_path, 'Certificate_' . $certificate->code . '.pdf');
        }

        return redirect()->back()->with('error', 'PDF is compiling. Please try again in a moment.');
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
            \Illuminate\Support\Facades\Log::error("Student Certificate PDF generation failed: " . $e->getMessage());
        }
    }
}
