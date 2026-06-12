<?php

namespace App\Http\Controllers\Admin\Klass;

use App\Http\Controllers\Controller;
use App\Models\ClassRoom;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class ClassRoomController extends Controller
{
    /**
     * Display a listing of classrooms.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('view classes');

        $query = ClassRoom::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('room_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('building_name')) {
            $query->where('building_name', $request->input('building_name'));
        }

        if ($request->filled('room_type')) {
            $query->where('room_type', $request->input('room_type'));
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $classrooms = $query->orderBy('building_name')
            ->orderBy('floor_name')
            ->orderBy('room_number')
            ->paginate(15)
            ->withQueryString();

        // Get unique building names for filters
        $buildings = ClassRoom::distinct()->pluck('building_name')->filter()->values();

        $stats = [
            'total_rooms' => ClassRoom::count(),
            'total_seats' => (int) ClassRoom::sum('capacity'),
            'active_rooms' => ClassRoom::where('is_active', true)->count(),
            'labs_count' => ClassRoom::whereIn('room_type', ['lab', 'computer_lab'])->count(),
        ];

        return Inertia::render('Admin/ClassRoom/Index', [
            'classrooms' => $classrooms,
            'buildings' => $buildings,
            'filters' => $request->only(['search', 'building_name', 'room_type', 'is_active']),
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created classroom in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create classes');

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'room_number' => 'nullable|string|max:50',
            'building_name' => 'required|string|max:100',
            'floor_name' => 'required|string|max:100',
            'capacity' => 'required|integer|min:1|max:1000',
            'room_type' => 'required|string|in:classroom,lab,lecture_hall,office,library,computer_lab,meeting_room,masjid',
            'features' => 'nullable|array',
            'location' => 'nullable|string|max:150',
            'is_active' => 'boolean',
        ]);

        ClassRoom::create($validated);

        return redirect()->back()->with('success', 'Classroom created successfully.');
    }

    /**
     * Update the specified classroom in storage.
     */
    public function update(Request $request, ClassRoom $classroom): RedirectResponse
    {
        Gate::authorize('edit classes');

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'room_number' => 'nullable|string|max:50',
            'building_name' => 'required|string|max:100',
            'floor_name' => 'required|string|max:100',
            'capacity' => 'required|integer|min:1|max:1000',
            'room_type' => 'required|string|in:classroom,lab,lecture_hall,office,library,computer_lab,meeting_room,masjid',
            'features' => 'nullable|array',
            'location' => 'nullable|string|max:150',
            'is_active' => 'boolean',
        ]);

        $classroom->update($validated);

        return redirect()->back()->with('success', 'Classroom updated successfully.');
    }

    /**
     * Remove the specified classroom from storage.
     */
    public function destroy(ClassRoom $classroom): RedirectResponse
    {
        Gate::authorize('delete classes');

        // Check if there are active timetable slots or class schedules
        if ($classroom->schedules()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete classroom because it is currently assigned to a class schedule.');
        }

        // Also check modern timetable slots
        if (\App\Models\TimetableSlot::where('room_id', $classroom->id)->exists()) {
            return redirect()->back()->with('error', 'Cannot delete classroom because it is currently scheduled in the active timetable.');
        }

        $classroom->delete();

        return redirect()->back()->with('success', 'Classroom deleted successfully.');
    }
}
