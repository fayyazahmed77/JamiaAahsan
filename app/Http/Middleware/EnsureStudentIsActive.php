<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureStudentIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $student = auth()->guard('student')->user();

        if (!$student) {
            return redirect()->route('student.login');
        }

        $blockedStatuses = ['suspended', 'withdrawn', 'inactive'];

        if (in_array($student->status, $blockedStatuses)) {
            auth()->guard('student')->logout();
            return redirect()->route('student.login')
                ->with('error', 'Your account has been ' . $student->status . '. Please contact administration.');
        }

        return $next($request);
    }
}
