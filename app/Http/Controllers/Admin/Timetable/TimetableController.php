<?php

namespace App\Http\Controllers\Admin\Timetable;

use App\Http\Controllers\Controller;
use App\Models\TimetableSlot;
use App\Models\Course;
use App\Models\Teacher;
use App\Models\ClassRoom;
use App\Models\Program;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class TimetableController extends Controller
{
    /**
     * Display a listing of the timetable slots.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('view classes');

        $query = TimetableSlot::with(['course.program', 'course.semesterModel', 'teacher', 'room']);

        if ($request->filled('program_id')) {
            $query->whereHas('course', function ($q) use ($request) {
                $q->where('program_id', $request->input('program_id'));
            });
        }

        if ($request->filled('semester_id')) {
            $query->whereHas('course', function ($q) use ($request) {
                $q->where('semester_id', $request->input('semester_id'));
            });
        }

        if ($request->filled('teacher_id')) {
            $query->where('teacher_id', $request->input('teacher_id'));
        }

        if ($request->filled('room_id')) {
            $query->where('room_id', $request->input('room_id'));
        }

        $slots = $query->get()->map(function ($slot) {
            return [
                'id' => $slot->id,
                'course_id' => $slot->course_id,
                'course_name' => $slot->course?->name,
                'course_name_ur' => $slot->course?->name_ur,
                'program_name' => $slot->course?->program?->name,
                'semester_name' => $slot->course?->semesterModel?->name,
                'teacher_id' => $slot->teacher_id,
                'teacher_name' => $slot->teacher?->name,
                'room_id' => $slot->room_id,
                'room_name' => $slot->room?->name ?? 'TBA',
                'day_of_week' => $slot->day_of_week,
                'start_time' => substr($slot->start_time, 0, 5), // HH:MM
                'end_time' => substr($slot->end_time, 0, 5), // HH:MM
                'is_active' => $slot->is_active,
            ];
        });

        $courses = Course::where('is_active', true)->get(['id', 'name', 'name_ur', 'program_id', 'semester_id', 'teacher_id', 'code']);
        $teachers = Teacher::active()->get(['id', 'name']);
        $rooms = ClassRoom::where('is_active', true)->get(['id', 'name', 'capacity']);
        $programs = Program::where('is_active', true)->get(['id', 'name']);
        $semesters = Semester::where('status', 'active')->get(['id', 'name', 'program_id']);

        return Inertia::render('Admin/Timetable/Index', [
            'slots' => $slots,
            'courses' => $courses,
            'teachers' => $teachers,
            'rooms' => $rooms,
            'programs' => $programs,
            'semesters' => $semesters,
            'filters' => $request->only(['program_id', 'semester_id', 'teacher_id', 'room_id']),
        ]);
    }

    /**
     * Store a newly created timetable slot in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create classes');

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'teacher_id' => 'required|exists:teachers,id',
            'room_id' => 'nullable|exists:class_rooms,id',
            'day_of_week' => 'required|integer|min:1|max:7',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'is_active' => 'boolean',
        ]);

        // Convert times to standard H:i:s
        $validated['start_time'] = date('H:i:s', strtotime($validated['start_time']));
        $validated['end_time'] = date('H:i:s', strtotime($validated['end_time']));

        if ($validated['start_time'] >= $validated['end_time']) {
            return back()->withErrors(['end_time' => 'The end time must be after the start time.']);
        }

        $conflictError = $this->checkSchedulingConflicts($validated);
        if ($conflictError) {
            return back()->withErrors($conflictError);
        }

        TimetableSlot::create($validated);

        return redirect()->back()->with('success', 'Timetable slot scheduled successfully.');
    }

    /**
     * Update the specified timetable slot in storage.
     */
    public function update(Request $request, TimetableSlot $slot): RedirectResponse
    {
        Gate::authorize('edit classes');

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'teacher_id' => 'required|exists:teachers,id',
            'room_id' => 'nullable|exists:class_rooms,id',
            'day_of_week' => 'required|integer|min:1|max:7',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'is_active' => 'boolean',
        ]);

        // Convert times to standard H:i:s
        $validated['start_time'] = date('H:i:s', strtotime($validated['start_time']));
        $validated['end_time'] = date('H:i:s', strtotime($validated['end_time']));

        if ($validated['start_time'] >= $validated['end_time']) {
            return back()->withErrors(['end_time' => 'The end time must be after the start time.']);
        }

        $conflictError = $this->checkSchedulingConflicts($validated, $slot->id);
        if ($conflictError) {
            return back()->withErrors($conflictError);
        }

        $slot->update($validated);

        return redirect()->back()->with('success', 'Timetable slot updated successfully.');
    }

    /**
     * Remove the specified timetable slot from storage.
     */
    public function destroy(TimetableSlot $slot): RedirectResponse
    {
        Gate::authorize('delete classes');

        $slot->delete();

        return redirect()->back()->with('success', 'Timetable slot removed successfully.');
    }

    /**
     * Helper to detect room, teacher, or semester group conflicts.
     */
    private function checkSchedulingConflicts(array $validated, ?int $slotId = null): ?array
    {
        $hasConflict = function ($query) use ($validated, $slotId) {
            return $query->where('day_of_week', $validated['day_of_week'])
                ->where('is_active', true)
                ->where(function ($q) use ($validated) {
                    $q->where('start_time', '<', $validated['end_time'])
                      ->where('end_time', '>', $validated['start_time']);
                })
                ->when($slotId, fn($q) => $q->where('id', '!=', $slotId))
                ->exists();
        };

        // 1. Teacher overlap conflict
        if ($hasConflict(TimetableSlot::where('teacher_id', $validated['teacher_id']))) {
            $teacher = Teacher::find($validated['teacher_id']);
            return ['teacher_id' => 'Conflict: Teacher ' . ($teacher?->name ?? '') . ' is already scheduled in another class at this time.'];
        }

        // 2. Room overlap conflict
        if (!empty($validated['room_id'])) {
            if ($hasConflict(TimetableSlot::where('room_id', $validated['room_id']))) {
                $room = ClassRoom::find($validated['room_id']);
                return ['room_id' => 'Conflict: Room ' . ($room?->name ?? '') . ' is already reserved for another class at this time.'];
            }
        }

        // 3. Student Group / Semester overlap conflict
        $course = Course::findOrFail($validated['course_id']);
        if ($course->semester_id) {
            $semesterConflict = TimetableSlot::whereHas('course', function ($q) use ($course) {
                $q->where('semester_id', $course->semester_id);
            });
            if ($hasConflict($semesterConflict)) {
                return ['course_id' => 'Conflict: This course semester group already has a class scheduled at this time.'];
            }
        }

        return null;
    }
}
