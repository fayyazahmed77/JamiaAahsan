<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OTPService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    /**
     * Show the admin login page.
     */
    public function show(): Response
    {
        return Inertia::render('Admin/Auth/Login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle admin login form submission.
     */
    public function store(Request $request, OTPService $otpService)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $email = $request->email;
        $user = User::where('email', $email)->first();

        // Check if user is locked out in database (lockout check)
        if ($user && $user->locked_until && Carbon::now()->isBefore($user->locked_until)) {
            $minutes = Carbon::now()->diffInMinutes($user->locked_until) + 1;
            $this->logActivity($email, 'locked', $user, 'Locked account login attempt');
            return back()->withErrors([
                'email' => "This account is temporarily locked due to too many failed attempts. Try again in {$minutes} minutes.",
            ])->onlyInput('email');
        }

        // Attempt login credentials check
        if (! Auth::validate($request->only('email', 'password'))) {
            // Failed credentials
            if ($user) {
                $user->increment('failed_attempts');
                if ($user->failed_attempts >= 5) {
                    $user->update([
                        'locked_until' => Carbon::now()->addMinutes(15),
                        'failed_attempts' => 5 // cap at 5
                    ]);
                    $this->logActivity($email, 'locked', $user, 'Account locked due to 5 consecutive failures');
                    $minutes = 15;
                    return back()->withErrors([
                        'email' => "This account has been temporarily locked due to 5 consecutive failed login attempts. Please try again in {$minutes} minutes.",
                    ])->onlyInput('email');
                } else {
                    $remaining = 5 - $user->failed_attempts;
                    $this->logActivity($email, 'failed', $user, "Invalid credentials. {$remaining} attempts remaining.");
                    return back()->withErrors([
                        'email' => "These credentials do not match our records. {$remaining} attempts remaining.",
                    ])->onlyInput('email');
                }
            } else {
                $this->logActivity($email, 'failed', null, 'Invalid email and credentials');
                return back()->withErrors([
                    'email' => 'These credentials do not match our records.',
                ])->onlyInput('email');
            }
        }

        // Login credentials verified, let's login
        Auth::attempt($request->only('email', 'password'), $request->boolean('remember'));
        $request->session()->regenerate();
        
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Reset failed login attempts on success
        $user->update([
            'failed_attempts' => 0,
            'locked_until' => null,
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        $this->logActivity($email, 'success', $user);

        // Check if first-time login verification is required (email_verified_at is null)
        if (is_null($user->email_verified_at)) {
            // Log user back out temporarily for verification flow
            Auth::logout();
            
            // Store user ID in session temporarily for OTP verification
            session(['otp_user_id' => $user->id]);
            
            // Generate OTP and send email
            $otpService->generate($user);

            // Redirect to OTP verification GET page
            return redirect()->route('login.otp');
        }

        // Redirect admin/super-admin vs student
        if ($user->hasRole('Super Admin') || $user->hasRole('Admin')) {
            return redirect()->intended(route('admin.dashboard'));
        }
        if ($user->hasRole('Student')) {
            return redirect()->intended(route('student.dashboard'));
        }

        return redirect()->intended('/');
    }

    /**
     * Log the admin out.
     */
    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    /**
     * Helper to log login activity.
     */
    protected function logActivity(string $email, string $status, ?User $user = null, ?string $reason = null): void
    {
        $userAgent = request()->header('User-Agent') ?? '';
        
        // Simple device detection
        $deviceType = 'desktop';
        if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i', $userAgent)) {
            $deviceType = 'tablet';
        } elseif (preg_match('/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo)/i', $userAgent)) {
            $deviceType = 'mobile';
        }

        // Simple browser detection
        $browser = 'Unknown';
        if (preg_match('/Firefox/i', $userAgent)) $browser = 'Firefox';
        elseif (preg_match('/Chrome/i', $userAgent)) $browser = 'Chrome';
        elseif (preg_match('/Safari/i', $userAgent)) $browser = 'Safari';
        elseif (preg_match('/MSIE/i', $userAgent) || preg_match('/Trident/i', $userAgent)) $browser = 'IE';
        elseif (preg_match('/Edge/i', $userAgent)) $browser = 'Edge';

        // Simple OS detection
        $platform = 'Unknown';
        if (preg_match('/Windows/i', $userAgent)) $platform = 'Windows';
        elseif (preg_match('/Macintosh|Mac OS X/i', $userAgent)) $platform = 'macOS';
        elseif (preg_match('/Android/i', $userAgent)) $platform = 'Android';
        elseif (preg_match('/iPhone|iPad/i', $userAgent)) $platform = 'iOS';
        elseif (preg_match('/Linux/i', $userAgent)) $platform = 'Linux';

        DB::table('login_activities')->insert([
            'user_id' => $user?->id,
            'email' => $email,
            'ip_address' => request()->ip(),
            'user_agent' => substr($userAgent, 0, 255),
            'device_type' => $deviceType,
            'browser' => $browser,
            'platform' => $platform,
            'status' => $status,
            'failure_reason' => $reason,
            'created_at' => now(),
        ]);
    }
}
