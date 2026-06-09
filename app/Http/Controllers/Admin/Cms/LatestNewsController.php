<?php

namespace App\Http\Controllers\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Models\LatestNews;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

use App\Http\Requests\Admin\News\StoreLatestNewsRequest;

class LatestNewsController extends Controller
{
    public function index(Request $request): Response
    {
        $query = LatestNews::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('text', 'like', "%{$search}%");
        }

        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $news = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Cms/LatestNews', [
            'news'    => $news,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Cms/LatestNewsForm');
    }

    public function store(StoreLatestNewsRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        LatestNews::create($validated);

        return redirect()->route('admin.latest-news.index')->with('success', 'News item created successfully.');
    }

    public function edit(LatestNews $latestNews): Response
    {
        return Inertia::render('Admin/Cms/LatestNewsForm', [
            'newsItem' => $latestNews
        ]);
    }

    public function update(StoreLatestNewsRequest $request, LatestNews $latestNews): RedirectResponse
    {
        $validated = $request->validated();

        $latestNews->update($validated);

        return redirect()->route('admin.latest-news.index')->with('success', 'News item updated successfully.');
    }

    public function destroy(LatestNews $latestNews): RedirectResponse
    {
        $latestNews->delete();

        return redirect()->route('admin.latest-news.index')->with('success', 'News item deleted successfully.');
    }
}
