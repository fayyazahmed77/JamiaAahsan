<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Image;
use App\Http\Resources\ImageResource;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function index(Request $request)
    {
        $query = Image::where('status', true);

        if ($request->has('parent_only')) {
            $query->whereNull('parent_id');
        }

        $images = $query->orderBy('weight', 'asc')->get();
        return ImageResource::collection($images);
    }
}
