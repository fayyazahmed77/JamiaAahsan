<?php

namespace App\Http\Controllers\Admin\Download;

use App\Http\Controllers\Controller;
use App\Models\DownloadLink;
use App\Models\Category;
use App\Models\Year;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

use App\Http\Requests\Admin\Download\StoreDownloadRequest;

class DownloadController extends Controller
{
    public function index(Request $request): Response
    {
        $query = DownloadLink::with(['category', 'year']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('url', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->filled('year_id')) {
            $query->where('year_id', $request->input('year_id'));
        }

        $downloads = $query->orderBy('sort_order', 'asc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Download/Index', [
            'downloads'  => $downloads,
            'categories' => Category::where('status', true)->get(['id', 'name', 'type']),
            'years'      => Year::where('status', true)->get(['id', 'name']),
            'filters'    => $request->only(['search', 'category_id', 'year_id']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Download/Form', [
            'categories' => Category::where('status', true)->get(['id', 'name', 'type']),
            'years'      => Year::where('status', true)->get(['id', 'name']),
        ]);
    }

    public function store(StoreDownloadRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DownloadLink::create($validated);

        return redirect()->route('admin.downloads.index')->with('success', 'Download link created successfully.');
    }

    public function edit(DownloadLink $download): Response
    {
        return Inertia::render('Admin/Download/Form', [
            'download'   => $download,
            'categories' => Category::where('status', true)->get(['id', 'name', 'type']),
            'years'      => Year::where('status', true)->get(['id', 'name']),
        ]);
    }

    public function update(StoreDownloadRequest $request, DownloadLink $download): RedirectResponse
    {
        $validated = $request->validated();

        $download->update($validated);

        return redirect()->route('admin.downloads.index')->with('success', 'Download link updated successfully.');
    }

    public function destroy(DownloadLink $download): RedirectResponse
    {
        $download->delete();

        return redirect()->route('admin.downloads.index')->with('success', 'Download link deleted successfully.');
    }
}
