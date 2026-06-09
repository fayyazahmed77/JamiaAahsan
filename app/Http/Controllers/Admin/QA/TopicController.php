<?php

namespace App\Http\Controllers\Admin\QA;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class TopicController extends Controller
{
    /**
     * Display a listing of the topics.
     */
    public function index(Request $request): Response
    {
        $query = Topic::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $topics = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/QA/Topic/Index', [
            'topics'  => $topics,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Store a newly created topic in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'  => 'required|string|max:255|unique:topics,title',
            'status' => 'required|boolean',
        ]);

        Topic::create($validated);

        return redirect()->back()->with('success', 'Topic created successfully.');
    }

    /**
     * Update the specified topic in storage.
     */
    public function update(Request $request, Topic $topic): RedirectResponse
    {
        $validated = $request->validate([
            'title'  => 'required|string|max:255|unique:topics,title,' . $topic->id,
            'status' => 'required|boolean',
        ]);

        $topic->update($validated);

        return redirect()->back()->with('success', 'Topic updated successfully.');
    }

    /**
     * Remove the specified topic from storage.
     */
    public function destroy(Topic $topic): RedirectResponse
    {
        if ($topic->questionAnswers()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete topic with associated questions and answers.');
        }

        $topic->delete();

        return redirect()->back()->with('success', 'Topic deleted successfully.');
    }
}
