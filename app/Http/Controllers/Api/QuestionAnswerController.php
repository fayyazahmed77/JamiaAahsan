<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuestionAnswer;
use App\Http\Resources\QuestionAnswerResource;
use Illuminate\Http\Request;

class QuestionAnswerController extends Controller
{
    public function index(Request $request)
    {
        $query = QuestionAnswer::where('status', true);

        if ($request->filled('topic_id')) {
            $query->where('topic_id', $request->topic_id);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('question', 'like', "%{$request->search}%")
                  ->orWhere('answer', 'like', "%{$request->search}%");
            });
        }

        $records = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15));

        return QuestionAnswerResource::collection($records);
    }

    public function show($id)
    {
        $qa = QuestionAnswer::findOrFail($id);
        return new QuestionAnswerResource($qa);
    }
}
