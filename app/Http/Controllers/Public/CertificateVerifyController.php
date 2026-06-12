<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CertificateVerifyController extends Controller
{
    public function show(string $code): Response
    {
        $certificate = Certificate::where('code', $code)
            ->with('student')
            ->firstOrFail();

        return Inertia::render('Public/Certificate/Verify', [
            'certificate' => $certificate,
        ]);
    }
}
