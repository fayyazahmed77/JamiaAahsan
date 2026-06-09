<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Klass;
use App\Models\ClassSession;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    /**
     * Display all academic courses and programs.
     */
    public function index(): Response
    {
        return Inertia::render('Public/Education/Index', [
            'courses' => Klass::where('status', true)->orderBy('sort', 'asc')->get()
        ]);
    }

    /**
     * Display details for a specific course/klass including active schedules/sessions.
     */
    public function show(string $slug): Response
    {
        $klass = Klass::where('slug', $slug)->firstOrFail();

        return Inertia::render('Public/Education/Show', [
            'klass' => $klass,
            'sessions' => ClassSession::with(['teacher', 'book', 'year'])
                ->where('class_id', $klass->id)
                ->where('status', true)
                ->get()
        ]);
    }
}
