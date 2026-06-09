<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LatestNews;
use App\Http\Resources\LatestNewsResource;

class LatestNewsController extends Controller
{
    public function index()
    {
        $news = LatestNews::active()->orderBy('created_at', 'desc')->take(10)->get();
        return LatestNewsResource::collection($news);
    }
}
