<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::where('status', true);
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        return CategoryResource::collection($query->get());
    }
}
