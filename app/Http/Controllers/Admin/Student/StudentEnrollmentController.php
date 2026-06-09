<?php

namespace App\Http\Controllers\Admin\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Student;
use App\Models\StudentCourseEnrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * D6: Admin-driven student course enrollment.
 * Lets admins enroll a student in multiple courses in one action,
 * or drop existing enrollments.
 */
class StudentEnrollmentController extends Controller
{
    /**
     * Show enrollment management for a specific student.
     */
    public function show(Student $student): Response
    {
        $student->load('program', 'klass');

        // Courses the student is already enrolled in
        $enrollments = StudentCourseEnrollment::where('student_id', $student->id)
            ->with('course.teacher')
            ->get();

        $enrolledCourseIds = $enrollments->pluck('course_id');

        // Available courses (active, not yet enrolled)
        $availableCourses = Course::where('is_active', true)
            ->whereNotIn('id', $enrolledCourseIds)
            ->with('teacher')
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'credit_hours', 'teacher_id']);

        return Inertia::render('Admin/Student/Enrollment', [
            'student'          => $student->only(['id', 'name', 'student_id_number', 'current_year', 'current_semester']),
            'enrollments'      => $enrollments->map(fn($e) => [
                'id'           => $e->id,
                'course_id'    => $e->course_id,
                'course_name'  => $e->course?->name,
                'course_code'  => $e->course?->code,
                'teacher_name' => $e->course?->teacher?->name,
                'status'       => $e->status,
                'enrolled_at'  => $e->enrolled_at?->format('d M Y'),
                'grade'        => $e->grade,
            ]),
            'available_courses' => $availableCourses->map(fn($c) => [
                'id'           => $c->id,
                'name'         => $c->name,
                'code'         => $c->code,
                'credit_hours' => $c->credit_hours,
                'teacher_name' => $c->teacher?->name,
            ]),
        ]);
    }

    /**
     * Enroll the student in one or more courses.
     */
    public function enroll(Request $request, Student $student): RedirectResponse
    {
        $request->validate([
            'course_ids'   => ['required', 'array', 'min:1'],
            'course_ids.*' => ['exists:courses,id'],
        ]);

        $enrolled = [];
        foreach ($request->course_ids as $courseId) {
            // Skip if already enrolled
            $exists = StudentCourseEnrollment::where('student_id', $student->id)
                ->where('course_id', $courseId)->exists();

            if (!$exists) {
                StudentCourseEnrollment::create([
                    'student_id'  => $student->id,
                    'course_id'   => $courseId,
                    'status'      => 'active',
                    'enrolled_at' => now(),
                ]);
                $enrolled[] = $courseId;
            }
        }

        \App\Models\AuditLog::recordSystem('enrollment.added', [
            'student_id'  => $student->id,
            'course_ids'  => $enrolled,
            'enrolled_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', count($enrolled) . ' course(s) enrolled successfully.');
    }

    /**
     * Drop (remove) a single enrollment.
     */
    public function drop(StudentCourseEnrollment $enrollment): RedirectResponse
    {
        $studentId = $enrollment->student_id;
        $courseId  = $enrollment->course_id;
        $enrollment->delete();

        \App\Models\AuditLog::recordSystem('enrollment.dropped', [
            'student_id'  => $studentId,
            'course_id'   => $courseId,
            'dropped_by'  => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Course enrollment removed.');
    }

    /**
     * Index: list all students with their enrollment counts.
     */
    public function index(Request $request): Response
    {
        $search   = $request->input('search', '');
        $students = Student::where('status', 'active')
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('student_id_number', 'like', "%{$search}%"))
            ->withCount('courseEnrollments as enrolled_count')
            ->orderBy('name')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Admin/Student/EnrollmentIndex', [
            'students' => $students,
            'filters'  => ['search' => $search],
        ]);
    }
}
