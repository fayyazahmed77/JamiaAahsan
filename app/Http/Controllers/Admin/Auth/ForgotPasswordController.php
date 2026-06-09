<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OTPService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ForgotPasswordController extends Controller
{
    /**
     * Show the forgot password screen.
     */
    public function show(Request $request)
    {
        return Inertia::render('Admin/Auth/Login', [
            'initialStep' => 'forgot_password',
            'status' => session('status'),
            'email' => session('email'),
            'otpSent' => session('otp_sent'),
            'otpVerified' => session('otp_verified'),
        ]);
    }

    /**
     * Send password reset OTP code.
     */
    public function sendResetCode(Request $request, OTPService $otpService)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'We could not find a user with that email address.',
            ]);
        }

        // Check if locked out
        if ($user->locked_until && now()->isBefore($user->locked_until)) {
            $minutes = now()->diffInMinutes($user->locked_until) + 1;
            return back()->withErrors([
                'email' => "This account is temporarily locked. Try again in {$minutes} minutes.",
            ]);
        }

        // Generate OTP code
        $otpService->generate($user);

        // Put user ID in session for reference, clear verification flag
        session([
            'forgot_password_user_id' => $user->id,
            'forgot_password_otp_verified' => false,
        ]);

        return back()->with([
            'status' => 'We have emailed your password reset verification code.',
            'email' => $user->email,
            'otp_sent' => true
        ]);
    }

    /**
     * Verify the password reset OTP code.
     */
    public function verifyResetCode(Request $request, OTPService $otpService)
    {
        $request->validate([
            'otp' => 'required|string|size:6',
        ]);

        if (!session()->has('forgot_password_user_id')) {
            return back()->withErrors([
                'otp' => 'Session expired. Please restart the forgot password flow.',
            ]);
        }

        $userId = session('forgot_password_user_id');
        $user = User::find($userId);

        if (!$user) {
            return redirect()->route('password.request');
        }

        if (!$otpService->verify($user, $request->otp)) {
            return back()->withErrors([
                'otp' => 'The code you entered is invalid or has expired.',
            ]);
        }

        // Mark OTP as verified in session
        session(['forgot_password_otp_verified' => true]);

        return back()->with([
            'status' => 'Code verified successfully. Please enter your new password.',
            'email' => $user->email,
            'otp_sent' => true,
            'otp_verified' => true
        ]);
    }

    /**
     * Reset the user's password.
     */
    public function resetPassword(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Password reset submission', [
            'has_user_id' => session()->has('forgot_password_user_id'),
            'user_id' => session('forgot_password_user_id'),
            'otp_verified' => session('forgot_password_otp_verified'),
        ]);

        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        if (!session()->has('forgot_password_user_id') || !session('forgot_password_otp_verified')) {
            return back()->withErrors([
                'password' => 'Unauthorized action. Please complete verification steps first.',
            ]);
        }

        $userId = session('forgot_password_user_id');
        $user = User::find($userId);

        if (!$user) {
            return redirect()->route('login');
        }

        // Update password and clear failed attempts
        $user->forceFill([
            'password' => Hash::make($request->password),
            'failed_attempts' => 0,
            'locked_until' => null,
            // If they can reset password via email OTP, their email is verified!
            'email_verified_at' => $user->email_verified_at ?? now(),
        ])->save();

        // Clear session fields
        session()->forget([
            'forgot_password_user_id',
            'forgot_password_otp_verified'
        ]);

        // Log action in audit log
        $this->logActivity($user->email, 'password_reset', $user, 'Password reset via email OTP code');

        return redirect()->route('login')->with('status', 'Your password has been reset successfully! You can now sign in with your new password.');
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
