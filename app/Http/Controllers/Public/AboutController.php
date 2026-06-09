<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\Department;
use App\Models\UserDetail;
use App\Models\Audio;
use App\Models\Video;
use App\Models\QuestionAnswer;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    /**
     * Display the central unified About Us page.
     */
    public function index(): Response
    {
        $stats = [
            'years_of_service' => now()->year - 1998,
            'students_count' => UserDetail::where('is_approved', 1)->count() + 14850,
            'faculty_count' => Teacher::where('status', true)->count(),
            'audio_count' => Audio::where('status', true)->count(),
            'video_count' => Video::where('status', true)->count(),
            'fatwa_count' => QuestionAnswer::where('status', true)->count(),
        ];

        return Inertia::render('Public/About/Index', [
            'departments' => Department::where('status', true)->orderBy('sort_order', 'asc')->get(),
            'leadership' => Teacher::where('status', true)->where('is_leadership', true)->orderBy('sort_order', 'asc')->get(),
            'faculty_preview' => Teacher::where('status', true)->where('is_leadership', false)->orderBy('sort_order', 'asc')->limit(6)->get(),
            'stats' => $stats,
        ]);
    }

    /**
     * Display the history of the institute.
     */
    public function history(): Response
    {
        return Inertia::render('Public/About/History');
    }

    /**
     * Display the leadership profiles of the institute.
     */
    public function leadership(): Response
    {
        return Inertia::render('Public/About/Leadership', [
            'leadership' => Teacher::where('status', true)->where('is_leadership', true)->orderBy('sort_order', 'asc')->get()
        ]);
    }

    /**
     * Display the faculty scholars directory.
     */
    public function faculty(): Response
    {
        return Inertia::render('Public/About/Faculty', [
            'faculty' => Teacher::where('status', true)->where('is_leadership', false)->orderBy('name', 'asc')->paginate(12)
        ]);
    }
}
