<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Image;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Image::where('status', true);

        // Filter by category if requested
        if ($request->filled('category') && $request->input('category') !== 'All') {
            $query->where('category', $request->input('category'));
        }

        $images = $query->orderBy('weight', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(16)
            ->withQueryString();

        $categories = [
            'All',
            'Annual Events',
            'Classroom Activities',
            'Campus Life',
            'Hifz Program',
            'Graduations',
            'Competitions',
            'Guest Visits',
            'Other'
        ];

        return Inertia::render('Public/Gallery/Index', [
            'images' => $images,
            'categories' => $categories,
            'selectedCategory' => $request->input('category', 'All'),
        ]);
    }
}
