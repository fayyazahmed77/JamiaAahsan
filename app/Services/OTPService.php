<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use App\Notifications\SendOTPVerificationCode;

class OTPService
{
    /**
     * Generate a secure 6-digit OTP, save its hash in the database, and send it to the user.
     */
    public function generate(User $user): string
    {
        // Generate a cryptographically secure 6-digit numeric OTP
        $otp = (string) random_int(100000, 999999);

        // Store the hashed OTP in the database for security (similar to password hashing)
        $user->update([
            'otp_code' => Hash::make($otp),
            'otp_expires_at' => Carbon::now()->addMinutes(10),
        ]);

        // Send OTP via notification (which sends an email in the background)
        $user->notify(new SendOTPVerificationCode($otp));

        return $otp;
    }

    /**
     * Verify the provided OTP against the stored hash and check expiration.
     */
    public function verify(User $user, string $otp): bool
    {
        if (!$user->otp_code || !$user->otp_expires_at) {
            return false;
        }

        // Check if the OTP is expired
        if (Carbon::now()->isAfter($user->otp_expires_at)) {
            return false;
        }

        // Verify the hashed OTP code
        if (Hash::check($otp, $user->otp_code)) {
            // Success: clear OTP details and reset login failures
            $user->update([
                'otp_code' => null,
                'otp_expires_at' => null,
                'failed_attempts' => 0,
                'locked_until' => null,
            ]);
            return true;
        }

        return false;
    }
}
