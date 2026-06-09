<?php

namespace App\Http\Controllers\Admin\Year;

use App\Http\Controllers\Controller;
use App\Models\Year;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;

class YearController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Year::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $years = $query->orderBy('name', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Year/Index', [
            'years'   => $years,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'   => 'required|integer|between:1900,2100|unique:years,name',
            'status' => 'required|boolean',
        ]);

        Year::create($validated);

        Cache::forget('years_active');

        return redirect()->back()->with('success', 'Academic Year created successfully.');
    }

    public function update(Request $request, Year $year): RedirectResponse
    {
        $validated = $request->validate([
            'name'   => 'required|integer|between:1900,2100|unique:years,name,' . $year->id,
            'status' => 'required|boolean',
        ]);

        $year->update($validated);

        Cache::forget('years_active');

        return redirect()->back()->with('success', 'Academic Year updated successfully.');
    }

    public function destroy(Year $year): RedirectResponse
    {
        // Prevent deletion if year has media, downloads, or class sessions
        if ($year->media()->exists() || $year->downloadLinks()->exists() || $year->classSessions()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete year with associated media, downloads, or class sessions.');
        }

        $year->delete();

        Cache::forget('years_active');

        return redirect()->back()->with('success', 'Academic Year deleted successfully.');
    }
}
