<?php

use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Admin\Auth\OTPVerificationController;
use App\Http\Controllers\Admin\Auth\ForgotPasswordController;
use Illuminate\Support\Facades\Route;

// ── Universal Auth Routes ──────────────────────────────────────────────────────
Route::get('login', [LoginController::class, 'show'])
    ->name('login')
    ->middleware('guest');

Route::post('login', [LoginController::class, 'store'])
    ->name('login.store')
    ->middleware(['guest', 'lockout']);

Route::post('logout', [LoginController::class, 'destroy'])
    ->name('logout')
    ->middleware('auth');

// ── Guest Auth Flow Routes ─────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    // OTP verification for first-time login
    Route::get('login/otp', [OTPVerificationController::class, 'show'])
        ->name('login.otp');
    Route::post('login/otp', [OTPVerificationController::class, 'store'])
        ->name('login.otp.verify');
    Route::post('login/otp/resend', [OTPVerificationController::class, 'resend'])
        ->name('login.otp.resend');

    // Forgot Password Flow
    Route::get('forgot-password', [ForgotPasswordController::class, 'show'])
        ->name('password.request');
    Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetCode'])
        ->name('password.email')
        ->middleware('lockout');
    Route::post('forgot-password/verify', [ForgotPasswordController::class, 'verifyResetCode'])
        ->name('password.verify_otp');
    Route::post('password/reset', [ForgotPasswordController::class, 'resetPassword'])
        ->name('password.update');
});
