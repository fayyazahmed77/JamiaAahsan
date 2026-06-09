<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class StudentSettingsController extends Controller
{
    public function index(): Response
    {
        $student  = Auth::guard('student')->user();
        $settings = $student->settings()->firstOrCreate(['student_id' => $student->id]);

        $loginHistory = $student->loginHistory()->limit(10)->get()->map(fn ($h) => [
            'ip_address'   => $h->ip_address,
            'device_type'  => $h->device_type,
            'browser'      => $h->browser,
            'os'           => $h->os,
            'status'       => $h->status,
            'logged_in_at' => $h->logged_in_at?->diffForHumans(),
        ]);

        return Inertia::render('Student/Settings/Index', [
            'settings'     => $settings,
            'loginHistory' => $loginHistory,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'language'            => ['nullable', 'in:en,ur'],
            'theme'               => ['nullable', 'in:light,dark,system'],
            'notify_assignment'   => ['nullable', 'boolean'],
            'notify_exam'         => ['nullable', 'boolean'],
            'notify_result'       => ['nullable', 'boolean'],
            'notify_attendance'   => ['nullable', 'boolean'],
            'notify_notice'       => ['nullable', 'boolean'],
            'notify_hifz'         => ['nullable', 'boolean'],
            'notify_support'      => ['nullable', 'boolean'],
            'notify_certificate'  => ['nullable', 'boolean'],
            'notify_teacher'      => ['nullable', 'boolean'],
            'login_notifications' => ['nullable', 'boolean'],
        ]);

        $student = Auth::guard('student')->user();
        $student->settings()->updateOrCreate(
            ['student_id' => $student->id],
            $validated
        );

        return back()->with('success', 'Settings saved successfully.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password'      => ['required', 'string'],
            'password'              => ['required', 'confirmed', Password::min(8)],
        ]);

        $student = Auth::guard('student')->user();

        if (!Hash::check($request->current_password, $student->password)) {
            return back()->withErrors(['current_password' => 'The current password is incorrect.']);
        }

        $student->update(['password' => Hash::make($request->password)]);

        return back()->with('success', 'Password updated successfully.');
    }
}
