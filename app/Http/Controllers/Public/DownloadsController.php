<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\DownloadLink;
use App\Models\Category;
use App\Models\Year;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;

class DownloadsController extends Controller
{
    /**
     * Display a paginated lists of downloadable publications and textbooks.
     */
    public function index(Request $request): Response
    {
        $query = DownloadLink::with(['category', 'year'])->where('status', true);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('year_id')) {
            $query->where('year_id', $request->year_id);
        }

        return Inertia::render('Public/Downloads/Index', [
            'downloads' => $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString(),
            'categories' => Cache::remember('categories_active_all', now()->addDay(), fn() => Category::where('status', true)->orderBy('name', 'asc')->get()),
            'years' => Cache::remember('years_active', now()->addDay(), fn() => Year::where('status', true)->orderBy('name', 'desc')->get()),
            'filters' => $request->only(['category_id', 'year_id'])
        ]);
    }
}