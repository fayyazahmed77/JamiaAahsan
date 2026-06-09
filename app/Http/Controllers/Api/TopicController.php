<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use App\Http\Resources\TopicResource;

class TopicController extends Controller
{
    public function index()
    {
        $topics = Topic::where('status', true)->orderBy('title', 'asc')->get();
        return TopicResource::collection($topics);
    }
}
