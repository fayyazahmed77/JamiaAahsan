<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\LatestNews;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    /**
     * Display latest news and events.
     */
    public function index(): Response
    {
        return Inertia::render('Public/News/Index', [
            'news' => LatestNews::where('status', true)->orderBy('created_at', 'desc')->paginate(10)
        ]);
    }

    /**
     * Display details for a specific news article.
     */
    public function show(string $slug): Response
    {
        $item = LatestNews::where('slug', $slug)->firstOrFail();

        return Inertia::render('Public/News/Show', [
            'item' => $item,
            'recentNews' => LatestNews::where('status', true)
                ->where('id', '!=', $item->id)
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
        ]);
    }
}
