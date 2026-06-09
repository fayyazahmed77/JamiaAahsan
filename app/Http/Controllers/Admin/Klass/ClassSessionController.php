<?php

namespace App\Http\Controllers\Admin\Klass;

use App\Http\Controllers\Controller;
use App\Models\Klass;
use App\Models\ClassSession;
use App\Models\Teacher;
use App\Models\Book;
use App\Models\Year;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class ClassSessionController extends Controller
{
    public function index(Klass $class, Request $request): Response
    {
        $query = ClassSession::where('class_id', $class->id)->with(['teacher', 'book', 'year']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('book', function ($sq) use ($search) {
                    $sq->where('name', 'like', "%{$search}%")
                       ->orWhere('urdu_name', 'like', "%{$search}%");
                })->orWhereHas('teacher', function ($sq) use ($search) {
                    $sq->where('name', 'like', "%{$search}%")
                       ->orWhere('urdu_name', 'like', "%{$search}%");
                });
            });
        }

        $sessions = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Class/Sessions', [
            'klass'    => $class,
            'sessions' => $sessions,
            'filters'  => $request->only(['search']),
        ]);
    }

    public function create(Klass $class): Response
    {
        return Inertia::render('Admin/Class/SessionForm', [
            'klass'    => $class,
            'teachers' => Teacher::where('status', true)->get(['id', 'name', 'urdu_name']),
            'books'    => Book::where('status', true)->get(['id', 'name', 'urdu_name']),
            'years'    => Year::where('status', true)->get(['id', 'name']),
        ]);
    }

    public function store(Request $request, Klass $class): RedirectResponse
    {
        $validated = $request->validate([
            'teacher_id'   => 'required|exists:teachers,id',
            'book_id'      => 'required|exists:books,id',
            'year_id'      => 'required|exists:years,id',
            'lecture_link' => 'nullable|url|max:255',
            'status'       => 'required|boolean',
        ]);

        $validated['class_id'] = $class->id;
        $validated['created_by'] = Auth::id();

        ClassSession::create($validated);

        return redirect()->route('admin.classes.sessions.index', $class->id)->with('success', 'Class session scheduled successfully.');
    }

    public function edit(Klass $class, ClassSession $session): Response
    {
        return Inertia::render('Admin/Class/SessionForm', [
            'klass'    => $class,
            'session'  => $session,
            'teachers' => Teacher::where('status', true)->get(['id', 'name', 'urdu_name']),
            'books'    => Book::where('status', true)->get(['id', 'name', 'urdu_name']),
            'years'    => Year::where('status', true)->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Klass $class, ClassSession $session): RedirectResponse
    {
        $validated = $request->validate([
            'teacher_id'   => 'required|exists:teachers,id',
            'book_id'      => 'required|exists:books,id',
            'year_id'      => 'required|exists:years,id',
            'lecture_link' => 'nullable|url|max:255',
            'status'       => 'required|boolean',
        ]);

        $session->update($validated);

        return redirect()->route('admin.classes.sessions.index', $class->id)->with('success', 'Class session updated successfully.');
    }

    public function destroy(Klass $class, ClassSession $session): RedirectResponse
    {
        $session->delete();

        return redirect()->route('admin.classes.sessions.index', $class->id)->with('success', 'Class session deleted successfully.');
    }
}
