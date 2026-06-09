<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Klass;
use App\Http\Resources\ClassResource;

class ClassController extends Controller
{
    public function index()
    {
        $classes = Klass::where('status', true)->orderBy('sort', 'asc')->get();
        return ClassResource::collection($classes);
    }

    public function show($id)
    {
        $class = Klass::findOrFail($id);
        return new ClassResource($class);
    }
}
