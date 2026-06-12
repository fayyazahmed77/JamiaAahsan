<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureStudentHasActiveEnrollment
{
    public function handle(Request $request, Closure $next): Response
    {
        $student = auth()->guard('student')->user();

        if (!$student) {
            return redirect()->route('student.login');
        }

        // Active check: student must be active and have program and semester assigned
        if (empty($student->program_id) || empty($student->current_semester_id) || $student->status !== 'active') {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'You must have an active Program and Semester enrollment to access this page.'
                ], 403);
            }

            return redirect()->route('student.dashboard')
                ->with('error', 'You must have an active Program and Semester enrollment to access this page.');
        }

        return $next($request);
    }
}
