<?php

namespace App\Http\Controllers\Admin\QA;

use App\Http\Controllers\Controller;
use App\Models\QuestionAnswer;
use App\Models\Topic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

use App\Http\Requests\Admin\QA\StoreQuestionAnswerRequest;

class QuestionAnswerController extends Controller
{
    /**
     * Display a listing of the questions and answers.
     */
    public function index(Request $request): Response
    {
        $query = QuestionAnswer::with('topic');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('question', 'like', "%{$search}%")
                  ->orWhere('answer', 'like', "%{$search}%");
            });
        }

        if ($request->filled('topic_id')) {
            $query->where('topic_id', $request->input('topic_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $questions = $query->latest()->paginate(15)->withQueryString();
        $topics = Topic::where('status', true)->orderBy('title', 'asc')->get();

        return Inertia::render('Admin/QA/QuestionAnswer/Index', [
            'questions' => $questions,
            'topics'    => $topics,
            'filters'   => $request->only(['search', 'topic_id', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new question and answer.
     */
    public function create(): Response
    {
        $topics = Topic::where('status', true)->orderBy('title', 'asc')->get();

        return Inertia::render('Admin/QA/QuestionAnswer/Create', [
            'topics' => $topics
        ]);
    }

    /**
     * Store a newly created question and answer in storage.
     */
    public function store(StoreQuestionAnswerRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        QuestionAnswer::create($validated);

        return redirect()->route('admin.questions.index')->with('success', 'Question & Answer created successfully.');
    }

    /**
     * Show the form for editing the specified question and answer.
     */
    public function edit(QuestionAnswer $question): Response
    {
        $topics = Topic::where('status', true)->orderBy('title', 'asc')->get();

        return Inertia::render('Admin/QA/QuestionAnswer/Edit', [
            'question' => $question,
            'topics'   => $topics
        ]);
    }

    /**
     * Update the specified question and answer in storage.
     */
    public function update(StoreQuestionAnswerRequest $request, QuestionAnswer $question): RedirectResponse
    {
        $validated = $request->validated();

        $question->update($validated);

        return redirect()->route('admin.questions.index')->with('success', 'Question & Answer updated successfully.');
    }

    /**
     * Remove the specified question and answer from storage.
     */
    public function destroy(QuestionAnswer $question): RedirectResponse
    {
        $question->delete();

        return redirect()->back()->with('success', 'Question & Answer deleted successfully.');
    }
}
