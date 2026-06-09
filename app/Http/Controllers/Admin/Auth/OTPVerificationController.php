<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OTPService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OTPVerificationController extends Controller
{
    /**
     * Show the OTP verification form.
     */
    public function show(Request $request)
    {
        if (!$request->session()->has('otp_user_id')) {
            return redirect()->route('login')->withErrors([
                'email' => 'Please sign in first.',
            ]);
        }

        $userId = $request->session()->get('otp_user_id');
        $user = User::find($userId);

        if (!$user) {
            return redirect()->route('login');
        }

        return Inertia::render('Admin/Auth/Login', [
            'initialStep' => 'otp_verify',
            'email' => $user->email,
            'status' => session('status'),
        ]);
    }

    /**
     * Verify the submitted OTP.
     */
    public function store(Request $request, OTPService $otpService)
    {
        if (!$request->session()->has('otp_user_id')) {
            return redirect()->route('login')->withErrors([
                'email' => 'Session expired. Please sign in again.',
            ]);
        }

        $request->validate([
            'otp' => 'required|string|size:6',
        ]);

        $userId = $request->session()->get('otp_user_id');
        $user = User::find($userId);

        if (!$user) {
            return redirect()->route('login');
        }

        // Verify the code
        if (!$otpService->verify($user, $request->otp)) {
            // Failed attempt: log this activity
            $this->logActivity($user->email, 'failed_otp', $user, 'Invalid or expired OTP code entered');
            
            return back()->withErrors([
                'otp' => 'The code you entered is invalid or has expired.',
            ]);
        }

        // Set email_verified_at and save
        $user->forceFill([
            'email_verified_at' => now(),
        ])->save();

        // Remove OTP session keys
        $request->session()->forget('otp_user_id');

        // Log the user in
        Auth::login($user);
        $request->session()->regenerate();

        // Log activity
        $this->logActivity($user->email, 'success', $user, 'First-time email verification completed');

        // Redirect based on role
        if ($user->hasRole('Super Admin') || $user->hasRole('Admin')) {
            return redirect()->intended(route('admin.dashboard'));
        }
        if ($user->hasRole('Student')) {
            return redirect()->intended(route('student.dashboard'));
        }

        return redirect()->intended('/');
    }

    /**
     * Resend the OTP verification code.
     */
    public function resend(Request $request, OTPService $otpService)
    {
        if (!$request->session()->has('otp_user_id')) {
            return redirect()->route('login')->withErrors([
                'email' => 'Session expired. Please sign in again.',
            ]);
        }

        $userId = $request->session()->get('otp_user_id');
        $user = User::find($userId);

        if (!$user) {
            return redirect()->route('login');
        }

        // Generate and send new OTP
        $otpService->generate($user);

        $this->logActivity($user->email, 'resend_otp', $user, 'Resent verification OTP code');

        return back()->with('status', 'A new verification code has been sent to your email.');
    }

    /**
     * Helper to log login activity.
     */
    protected function logActivity(string $email, string $status, ?User $user = null, ?string $reason = null): void
    {
        $userAgent = request()->header('User-Agent') ?? '';
        
        $deviceType = 'desktop';
        if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i', $userAgent)) {
            $deviceType = 'tablet';
        } elseif (preg_match('/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo)/i', $userAgent)) {
            $deviceType = 'mobile';
        }

        $browser = 'Unknown';
        if (preg_match('/Firefox/i', $userAgent)) $browser = 'Firefox';
        elseif (preg_match('/Chrome/i', $userAgent)) $browser = 'Chrome';
        elseif (preg_match('/Safari/i', $userAgent)) $browser = 'Safari';
        elseif (preg_match('/MSIE/i', $userAgent) || preg_match('/Trident/i', $userAgent)) $browser = 'IE';
        elseif (preg_match('/Edge/i', $userAgent)) $browser = 'Edge';

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
