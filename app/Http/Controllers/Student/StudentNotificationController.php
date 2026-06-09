<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\StudentPortalNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentNotificationController extends Controller
{
    public function index(): Response
    {
        $student = Auth::guard('student')->user();

        $notifications = StudentPortalNotification::where('student_id', $student->id)
            ->latest()
            ->paginate(20);

        return Inertia::render('Student/Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function markRead(Request $request, int $id)
    {
        $notification = StudentPortalNotification::where('student_id', Auth::guard('student')->id())
            ->findOrFail($id);

        $notification->markAsRead();

        return back();
    }

    public function markAllRead()
    {
        StudentPortalNotification::where('student_id', Auth::guard('student')->id())
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return back()->with('success', 'All notifications marked as read.');
    }
}
