<?php

namespace App\Http\Controllers\Admin\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Program;
use App\Models\DigitalStudentId;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class AdminIdCardController extends Controller
{
    /**
     * Display a listing of students and their ID card statuses.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('view students');

        $query = Student::with(['program', 'digitalId']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('student_id_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('program_id')) {
            $query->where('program_id', $request->input('program_id'));
        }

        if ($request->filled('photo_status')) {
            $query->where('photo_status', $request->input('photo_status'));
        }

        $students = $query->paginate(15)->through(function ($student) {
            return [
                'id' => $student->id,
                'name' => $student->name,
                'student_id_number' => $student->student_id_number,
                'program_name' => $student->program?->name,
                'current_semester' => $student->current_semester,
                'profile_photo_url' => $student->profile_photo_url,
                'pending_profile_photo_url' => $student->pending_profile_photo_url,
                'photo_status' => $student->photo_status,
                'has_card' => $student->digitalId !== null,
                'card_number' => $student->digitalId?->card_number,
                'card_active' => $student->digitalId?->is_active ?? false,
            ];
        });

        $programs = Program::active()->get(['id', 'name']);

        return Inertia::render('Admin/Student/IdCard/Index', [
            'students' => $students,
            'programs' => $programs,
            'filters' => $request->only(['search', 'program_id', 'photo_status']),
        ]);
    }

    /**
     * Approve a student's pending profile photo and generate/update their ID Card.
     */
    public function approvePhoto(Student $student): RedirectResponse
    {
        Gate::authorize('edit students');

        if (!$student->pending_profile_photo) {
            return back()->with('error', 'No pending photo to approve.');
        }

        // Delete old profile photo from disk if it exists
        if ($student->profile_photo) {
            Storage::disk('public')->delete($student->profile_photo);
        }

        // Promote pending photo to active profile photo
        $student->profile_photo = $student->pending_profile_photo;
        $student->pending_profile_photo = null;
        $student->photo_status = 'approved';
        $student->save();

        // Issue or update Digital ID Card
        $student->digitalId()->updateOrCreate(
            ['student_id' => $student->id],
            [
                'card_number' => 'JA-ID-' . str_pad($student->id, 6, '0', STR_PAD_LEFT),
                'issued_at' => now(),
                'valid_until' => now()->addYears(2),
                'is_active' => true,
            ]
        );

        return back()->with('success', "Student photo approved and ID Card issued successfully.");
    }

    /**
     * Reject a student's pending profile photo.
     */
    public function rejectPhoto(Student $student): RedirectResponse
    {
        Gate::authorize('edit students');

        if (!$student->pending_profile_photo) {
            return back()->with('error', 'No pending photo to reject.');
        }

        // Delete pending photo from disk
        Storage::disk('public')->delete($student->pending_profile_photo);

        $student->pending_profile_photo = null;
        $student->photo_status = 'rejected';
        $student->save();

        return back()->with('success', 'Student photo rejected.');
    }

    /**
     * Manually issue or update a student's ID Card.
     */
    public function issueCard(Student $student): RedirectResponse
    {
        Gate::authorize('edit students');

        if (!$student->profile_photo) {
            return back()->with('error', 'Student must have an approved profile photo before issuing an ID card.');
        }

        $student->photo_status = 'approved';
        $student->save();

        $student->digitalId()->updateOrCreate(
            ['student_id' => $student->id],
            [
                'card_number' => 'JA-ID-' . str_pad($student->id, 6, '0', STR_PAD_LEFT),
                'issued_at' => now(),
                'valid_until' => now()->addYears(2),
                'is_active' => true,
            ]
        );

        return back()->with('success', 'ID Card generated and issued.');
    }
}
