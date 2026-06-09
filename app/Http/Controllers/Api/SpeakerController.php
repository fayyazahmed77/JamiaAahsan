<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Speaker;
use App\Http\Resources\SpeakerResource;

class SpeakerController extends Controller
{
    public function index()
    {
        $speakers = Speaker::where('status', true)->orderBy('name', 'asc')->get();
        return SpeakerResource::collection($speakers);
    }
}
