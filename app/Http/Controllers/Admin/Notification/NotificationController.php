<?php

namespace App\Http\Controllers\Admin\Notification;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class NotificationController extends Controller
{
    public function index(): Response
    {
        $notifications = Notification::with('user')->latest()->paginate(15);
        $roles = Role::all(['id', 'name']);
        $users = User::where('status', true)->get(['id', 'name', 'email']);

        return Inertia::render('Admin/Notification/Index', [
            'notifications' => $notifications,
            'roles'         => $roles,
            'users'         => $users,
        ]);
    }

    public function broadcast(Request $request, \App\Services\NotificationService $notificationService): RedirectResponse
    {
        $validated = $request->validate([
            'title'      => 'required|string|max:255',
            'body'       => 'required|string',
            'target'     => 'required|in:all,role,users',
            'role_name'  => 'required_if:target,role|exists:roles,name',
            'user_ids'   => 'required_if:target,users|array',
            'user_ids.*' => 'required_if:target,users|exists:users,id',
        ]);

        $users = collect();

        if ($validated['target'] === 'all') {
            $users = User::where('status', true)->get();
        } elseif ($validated['target'] === 'role') {
            $users = User::role($validated['role_name'])->where('status', true)->get();
        } elseif ($validated['target'] === 'users') {
            $users = User::whereIn('id', $validated['user_ids'])->get();
        }

        $notificationService->sendBulk($users, $validated['title'], $validated['body'], ['type' => 'broadcast']);

        return redirect()->route('admin.notifications.index')->with('success', 'Notification broadcast sent successfully to ' . $users->count() . ' users.');
    }
}

