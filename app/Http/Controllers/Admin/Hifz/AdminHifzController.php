<?php

namespace App\Http\Controllers\Admin\Hifz;

use App\Http\Controllers\Controller;
use App\Models\HifzEnrollment;
use App\Models\HifzSession;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminHifzController extends Controller
{
    // ── List all Hifz enrollments ─────────────────────────────────────────
    public function index(Request $request): Response
    {
        $query = HifzEnrollment::with(['student', 'teacher'])
            ->withCount('sessions')   // replaces N+1: HifzSession::where()->count()
            ->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('student_id_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $enrollments = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Hifz/Index', [
            'enrollments' => $enrollments->through(fn ($e) => [
                'id'                     => $e->id,
                'student_id'             => $e->student_id,
                'student_name'           => $e->student->name,
                'student_id_number'      => $e->student->student_id_number,
                'teacher_name'           => $e->teacher?->name ?? '—',
                'juz_completed'          => $e->juz_completed,
                'total_juz_target'       => $e->total_juz_target,
                'current_surah'          => $e->current_surah,
                'status'                 => $e->status,
                'start_date'             => $e->start_date->format('Y-m-d'),
                'target_completion_date' => $e->target_completion_date?->format('Y-m-d'),
                'session_count'          => $e->sessions_count,
            ]),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    // ── Show sessions for one student ─────────────────────────────────────
    public function show(int $studentId): Response
    {
        $student = Student::findOrFail($studentId);
        $enrollment = HifzEnrollment::where('student_id', $studentId)
            ->with('teacher')->first();

        $sessions = HifzSession::where('student_id', $studentId)
            ->with('teacher')
            ->latest('session_date')
            ->paginate(20);

        $teachers = User::role('Teacher')->orWhere('job_title', 'like', '%teacher%')
            ->select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Hifz/Show', [
            'student'    => [
                'id'                => $student->id,
                'name'              => $student->name,
                'student_id_number' => $student->student_id_number,
            ],
            'enrollment' => $enrollment ? [
                'id'                     => $enrollment->id,
                'teacher_id'             => $enrollment->teacher_id,
                'teacher_name'           => $enrollment->teacher?->name,
                'start_date'             => $enrollment->start_date->format('Y-m-d'),
                'target_completion_date' => $enrollment->target_completion_date?->format('Y-m-d'),
                'total_juz_target'       => $enrollment->total_juz_target,
                'juz_completed'          => $enrollment->juz_completed,
                'current_surah'          => $enrollment->current_surah,
                'current_ayah'           => $enrollment->current_ayah,
                'status'                 => $enrollment->status,
                'notes'                  => $enrollment->notes,
            ] : null,
            'sessions'   => $sessions,
            'teachers'   => $teachers,
        ]);
    }

    // ── Record / update a Hifz session ────────────────────────────────────
    public function storeSession(Request $request, int $studentId): RedirectResponse
    {
        $validated = $request->validate([
            'session_date'      => ['required', 'date'],
            'teacher_id'        => ['required', 'integer', 'exists:users,id'],
            'sabqi_from'        => ['nullable', 'string', 'max:100'],
            'sabqi_to'          => ['nullable', 'string', 'max:100'],
            'sabqi_pages'       => ['nullable', 'integer', 'min:0', 'max:50'],
            'sabqi_quality'     => ['nullable', 'in:excellent,good,average,needs_revision'],
            'manzil_from'       => ['nullable', 'string', 'max:100'],
            'manzil_to'         => ['nullable', 'string', 'max:100'],
            'manzil_quality'    => ['nullable', 'in:excellent,good,average,needs_revision'],
            'new_lesson_from'   => ['nullable', 'string', 'max:100'],
            'new_lesson_to'     => ['nullable', 'string', 'max:100'],
            'new_lesson_pages'  => ['nullable', 'integer', 'min:0', 'max:50'],
            'teacher_notes'     => ['nullable', 'string', 'max:1000'],
            'mistakes_count'    => ['nullable', 'integer', 'min:0'],
        ]);

        HifzSession::create([
            'student_id'      => $studentId,
            'teacher_id'      => $validated['teacher_id'],
            'session_date'    => $validated['session_date'],
            'sabqi_from'      => $validated['sabqi_from'],
            'sabqi_to'        => $validated['sabqi_to'],
            'sabqi_pages'     => $validated['sabqi_pages'],
            'sabqi_quality'   => $validated['sabqi_quality'],
            'manzil_from'     => $validated['manzil_from'],
            'manzil_to'       => $validated['manzil_to'],
            'manzil_quality'  => $validated['manzil_quality'],
            'new_lesson_from' => $validated['new_lesson_from'],
            'new_lesson_to'   => $validated['new_lesson_to'],
            'new_lesson_pages'=> $validated['new_lesson_pages'],
            'teacher_notes'   => $validated['teacher_notes'],
            'mistakes_count'  => $validated['mistakes_count'],
        ]);

        return redirect()->back()->with('success', 'Hifz session recorded successfully.');
    }

    // ── Update the enrollment record (juz_completed, current_surah, etc.) ─
    public function updateEnrollment(Request $request, int $studentId): RedirectResponse
    {
        $validated = $request->validate([
            'teacher_id'             => ['required', 'integer', 'exists:users,id'],
            'juz_completed'          => ['required', 'integer', 'min:0', 'max:30'],
            'current_surah'          => ['nullable', 'string', 'max:100'],
            'current_ayah'           => ['nullable', 'integer', 'min:1'],
            'total_juz_target'       => ['required', 'integer', 'min:1', 'max:30'],
            'target_completion_date' => ['nullable', 'date'],
            'status'                 => ['required', 'in:active,paused,completed,withdrawn'],
            'notes'                  => ['nullable', 'string', 'max:1000'],
        ]);

        HifzEnrollment::updateOrCreate(
            ['student_id' => $studentId],
            array_merge($validated, ['start_date' => now()->toDateString()])
        );

        return redirect()->back()->with('success', 'Hifz enrollment updated successfully.');
    }
}
