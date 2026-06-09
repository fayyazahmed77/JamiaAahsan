<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Year;
use App\Http\Resources\YearResource;

class YearController extends Controller
{
    public function index()
    {
        $years = Year::where('status', true)->orderBy('name', 'desc')->get();
        return YearResource::collection($years);
    }
}
