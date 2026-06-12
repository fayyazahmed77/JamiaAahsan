<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\SearchService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SearchController extends Controller
{
    protected $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Show search results page.
     */
    public function index(Request $request): InertiaResponse
    {
        $query = $request->input('q', '');
        $results = $this->searchService->search($query, 20);

        return Inertia::render('Public/Search/Index', [
            'query' => $query,
            'results' => $results,
        ]);
    }

    /**
     * Get instant search results via JSON API.
     */
    public function instant(Request $request): JsonResponse
    {
        $query = $request->input('q', '');
        $results = $this->searchService->search($query, 5);

        return response()->json($results);
    }
}
