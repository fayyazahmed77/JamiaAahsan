<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentAnnouncementController extends Controller
{
    public function index(): Response
    {
        $announcements = Announcement::published()
            ->forAudience('students')
            ->orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Student/Announcement/Index', [
            'announcements' => $announcements,
        ]);
    }
}
