<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassSession;
use App\Http\Resources\ClassSessionResource;
use Illuminate\Http\Request;

class ClassSessionController extends Controller
{
    public function index(Request $request, $classId)
    {
        $sessions = ClassSession::where('class_id', $classId)
            ->where('status', true)
            ->with(['class', 'teacher', 'book', 'year'])
            ->get();

        return ClassSessionResource::collection($sessions);
    }
}
