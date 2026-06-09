<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Http\Resources\FeedbackResource;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'country' => 'required|string|max:255',
            'comment' => 'nullable|string',
            'rating' => 'integer|min:1|max:5',
            'phone' => 'nullable|string|max:255',
        ]);

        $feedback = Feedback::create($request->all());

        return response()->json([
            'error' => false,
            'data' => new FeedbackResource($feedback),
            'message' => 'Feedback submitted successfully',
        ], 201);
    }
}
