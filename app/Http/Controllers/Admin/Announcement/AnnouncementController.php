<?php

namespace App\Http\Controllers\Admin\Announcement;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\DeviceToken;
use App\Jobs\SendPushNotification;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(): Response
    {
        $announcements = Announcement::with('creator')
            ->orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Announcement/Index', [
            'announcements' => $announcements,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_ur' => 'nullable|string|max:255',
            'content' => 'required|string',
            'content_ur' => 'nullable|string',
            'audience' => 'required|in:all,students,teachers',
            'is_pinned' => 'required|boolean',
            'published_at' => 'nullable|date',
            'send_notification' => 'boolean',
        ]);

        $validated['created_by'] = auth()->id();
        
        $announcement = Announcement::create(
            collect($validated)->except('send_notification')->toArray()
        );

        // FCM Dispatch if checked
        if ($request->boolean('send_notification')) {
            $tokens = DeviceToken::pluck('token')->filter()->toArray();
            if (!empty($tokens)) {
                $title = "New Announcement: " . $announcement->title;
                $body = substr(strip_tags($announcement->content), 0, 150);
                SendPushNotification::dispatch($tokens, $title, $body)->onQueue('default');
            }
        }

        return redirect()->route('admin.announcements.index')->with('success', 'Announcement created successfully.');
    }

    public function update(Request $request, Announcement $announcement): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_ur' => 'nullable|string|max:255',
            'content' => 'required|string',
            'content_ur' => 'nullable|string',
            'audience' => 'required|in:all,students,teachers',
            'is_pinned' => 'required|boolean',
            'published_at' => 'nullable|date',
        ]);

        $announcement->update($validated);

        return redirect()->route('admin.announcements.index')->with('success', 'Announcement updated successfully.');
    }

    public function destroy(Announcement $announcement): RedirectResponse
    {
        $announcement->delete();
        return redirect()->route('admin.announcements.index')->with('success', 'Announcement deleted successfully.');
    }
}
