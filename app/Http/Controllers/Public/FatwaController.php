<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\QuestionAnswer;
use App\Models\Topic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class FatwaController extends Controller
{
    /**
     * Display the Fatwa directory with search capabilities.
     */
    public function index(Request $request): Response
    {
        $query = QuestionAnswer::with('topic')
            ->where('status', true);

        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', $searchTerm)
                  ->orWhere('question', 'like', $searchTerm)
                  ->orWhere('answer', 'like', $searchTerm);
            });
        }

        if ($request->filled('topic_id')) {
            $query->where('topic_id', $request->topic_id);
        }

        return Inertia::render('Public/Fatwa/Index', [
            'fatwas' => $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString(),
            'topics' => Topic::where('status', true)
                ->withCount(['questionAnswers' => function($q) {
                    $q->where('status', true);
                }])
                ->orderBy('title', 'asc')
                ->get(),
            'filters' => $request->only(['search', 'topic_id'])
        ]);
    }

    /**
     * Store a new religious question submitted by a guest or student.
     */
    public function store(\App\Http\Requests\Public\FatwaSubmitRequest $request): RedirectResponse
    {

        QuestionAnswer::create([
            'topic_id' => $request->topic_id,
            'title' => $request->title,
            'question' => $request->question,
            'answer' => '', // Empty answer initially (awaiting response from scholars)
            'status' => false, // Set to false so it doesn't show in the public index until answered
        ]);

        return back()->with('success', 'Your question has been submitted to our scholars. You will be notified once the answer is approved.');
    }
}
