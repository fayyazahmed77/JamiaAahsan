<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DownloadLink;
use App\Http\Resources\DownloadResource;
use Illuminate\Http\Request;

class DownloadController extends Controller
{
    public function index(Request $request)
    {
        $query = DownloadLink::where('status', true);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('year_id')) {
            $query->where('year_id', $request->year_id);
        }

        return DownloadResource::collection($query->get());
    }
}
