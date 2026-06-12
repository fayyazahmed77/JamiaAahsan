<?php

namespace App\Http\Controllers\Admin\Course;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\StudyResource;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class CourseContentController extends Controller
{
    /**
     * Store a newly created study resource in storage.
     */
    public function storeResource(Request $request, Course $course): RedirectResponse
    {
        Gate::authorize('edit classes');

        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'file' => 'required|file|max:10240|mimes:pdf,docx,jpg,png,zip,txt', // Max 10MB
            'is_published' => 'boolean',
        ]);

        $file = $request->file('file');
        $path = $file->store('course-resources', 'public');

        StudyResource::create([
            'course_id' => $course->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'file_path' => $path,
            'file_type' => $file->getClientOriginalExtension(),
            'is_published' => $request->boolean('is_published', true),
        ]);

        return back()->with('success', 'Study resource uploaded successfully.');
    }

    /**
     * Remove the specified study resource from storage.
     */
    public function destroyResource(StudyResource $resource): RedirectResponse
    {
        Gate::authorize('edit classes');

        // Delete file from public disk
        Storage::disk('public')->delete($resource->file_path);
        
        $resource->delete();

        return back()->with('success', 'Study resource deleted.');
    }

    /**
     * Store a newly created assignment in storage.
     */
    public function storeAssignment(Request $request, Course $course): RedirectResponse
    {
        Gate::authorize('edit classes');

        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'title_ur' => 'nullable|string|max:300',
            'description' => 'required|string',
            'description_ur' => 'nullable|string',
            'due_date' => 'required|date|after:now',
            'max_marks' => 'required|numeric|min:1|max:100',
            'allow_late_submission' => 'boolean',
            'is_published' => 'boolean',
        ]);

        Assignment::create([
            'course_id' => $course->id,
            'teacher_id' => $course->teacher_id,
            'title' => $validated['title'],
            'title_ur' => $validated['title_ur'],
            'description' => $validated['description'],
            'description_ur' => $validated['description_ur'],
            'due_date' => $validated['due_date'],
            'max_marks' => $validated['max_marks'],
            'allow_late_submission' => $request->boolean('allow_late_submission', true),
            'is_published' => $request->boolean('is_published', true),
            'published_at' => $request->boolean('is_published', true) ? now() : null,
        ]);

        return back()->with('success', 'Assignment created successfully.');
    }

    /**
     * Remove the specified assignment from storage.
     */
    public function destroyAssignment(Assignment $assignment): RedirectResponse
    {
        Gate::authorize('edit classes');

        if ($assignment->submissions()->exists()) {
            return back()->with('error', 'Cannot delete assignment with existing student submissions.');
        }

        $assignment->delete();

        return back()->with('success', 'Assignment deleted.');
    }
}
