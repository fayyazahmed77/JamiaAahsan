<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Http\Resources\TeacherResource;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $teachers = Teacher::where('status', true)->latest()->get();

        return response()->json([
            'error' => false,
            'data' => TeacherResource::collection($teachers)
        ]);
    }

    public function show($id)
    {
        $teacher = Teacher::where('status', true)->findOrFail($id);

        return response()->json([
            'error' => false,
            'data' => new TeacherResource($teacher)
        ]);
    }
}
