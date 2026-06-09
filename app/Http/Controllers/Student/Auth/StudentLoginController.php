<?php

namespace App\Http\Controllers\Student\Auth;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentLoginHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StudentLoginController extends Controller
{
    public function showLogin(): Response
    {
        if (Auth::guard('student')->check()) {
            return Inertia::location(route('student.dashboard'));
        }

        return Inertia::render('Student/Auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Rate limit: 5 attempts per minute per IP
        $throttleKey = 'student-login:' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => "Too many login attempts. Please try again in {$seconds} seconds.",
            ]);
        }

        $credentials = $request->only('email', 'password');
        $remember    = $request->boolean('remember');

        if (!Auth::guard('student')->attempt($credentials, $remember)) {
            RateLimiter::hit($throttleKey);

            // Log failed attempt
            $this->logLogin($request, null, 'failed', 'Invalid credentials');

            throw ValidationException::withMessages([
                'email' => 'These credentials do not match our records.',
            ]);
        }

        RateLimiter::clear($throttleKey);
        $request->session()->regenerate();

        /** @var Student $student */
        $student = Auth::guard('student')->user();

        // Update last login
        $student->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        // Ensure settings exist
        $student->settings()->firstOrCreate(['student_id' => $student->id]);

        // Log successful login
        $this->logLogin($request, $student, 'success');

        return redirect()->intended(route('student.dashboard'));
    }

    public function logout(Request $request)
    {
        Auth::guard('student')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('student.login');
    }

    private function logLogin(Request $request, ?Student $student, string $status, string $reason = null): void
    {
        if (!$student && $status === 'failed') {
            // Try to find student for logging
            $student = Student::where('email', $request->email)->first();
        }

        if (!$student) return;

        StudentLoginHistory::create([
            'student_id'    => $student->id,
            'ip_address'    => $request->ip(),
            'user_agent'    => $request->userAgent(),
            'device_type'   => $this->detectDevice($request->userAgent()),
            'status'        => $status,
            'failed_reason' => $reason,
            'logged_in_at'  => now(),
        ]);
    }

    private function detectDevice(?string $ua): string
    {
        if (!$ua) return 'unknown';
        if (str_contains($ua, 'Mobile') || str_contains($ua, 'Android')) return 'mobile';
        if (str_contains($ua, 'Tablet') || str_contains($ua, 'iPad')) return 'tablet';
        return 'desktop';
    }
}
