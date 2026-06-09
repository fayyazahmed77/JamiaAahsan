<?php

namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\Admin\User\StoreUserRequest;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', User::class);

        $query = User::with('roles');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/User/Index', [
            'users'   => [
                'data'         => \App\Http\Resources\UserResource::collection($users->items())->resolve(),
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'per_page'     => $users->perPage(),
                'total'        => $users->total(),
                'from'         => $users->firstItem(),
                'to'           => $users->lastItem(),
            ],
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', User::class);

        $departments = \App\Models\Department::where('status', true)->orderBy('sort_order', 'asc')->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/User/Form', [
            'roles' => Role::all(['id', 'name']),
            'departments' => $departments,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        Gate::authorize('create', User::class);

        $validated = $request->validated();

        $profileImagePath = null;
        if ($request->hasFile('profile_image')) {
            $profileImagePath = $request->file('profile_image')->store('profiles', 'public');
        }

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'status'   => $validated['status'],
            'phone'    => $validated['phone'] ?? null,
            'country'  => $validated['country'] ?? null,
            'job_title' => $validated['job_title'] ?? null,
            'department' => $validated['department'] ?? null,
            'bio'      => $validated['bio'] ?? null,
            'linkedin_url' => $validated['linkedin_url'] ?? null,
            'facebook_url' => $validated['facebook_url'] ?? null,
            'instagram_url' => $validated['instagram_url'] ?? null,
            'twitter_url' => $validated['twitter_url'] ?? null,
            'portfolio_url' => $validated['portfolio_url'] ?? null,
            'profile_image' => $profileImagePath,
            'email_verified_at' => now(), // auto verify created users
        ]);

        $user->syncRoles($validated['roles']);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
    {
        Gate::authorize('update', $user);

        $departments = \App\Models\Department::where('status', true)->orderBy('sort_order', 'asc')->get(['id', 'name', 'slug']);

        // Wrap user in Resource to serialize profile image url and new fields properly
        $userResource = new \App\Http\Resources\UserResource($user->load('roles'));

        return Inertia::render('Admin/User/Form', [
            'user'      => $userResource,
            'userRoles' => $user->roles->pluck('name')->toArray(),
            'roles'     => Role::all(['id', 'name']),
            'departments' => $departments,
        ]);
    }

    public function update(StoreUserRequest $request, User $user): RedirectResponse
    {
        Gate::authorize('update', $user);

        $validated = $request->validated();

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->status = $validated['status'];
        $user->phone = $validated['phone'] ?? null;
        $user->country = $validated['country'] ?? null;
        $user->job_title = $validated['job_title'] ?? null;
        $user->department = $validated['department'] ?? null;
        $user->bio = $validated['bio'] ?? null;
        
        $user->linkedin_url = $validated['linkedin_url'] ?? null;
        $user->facebook_url = $validated['facebook_url'] ?? null;
        $user->instagram_url = $validated['instagram_url'] ?? null;
        $user->twitter_url = $validated['twitter_url'] ?? null;
        $user->portfolio_url = $validated['portfolio_url'] ?? null;

        if ($request->hasFile('profile_image')) {
            if ($user->profile_image) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->profile_image);
            }
            $path = $request->file('profile_image')->store('profiles', 'public');
            $user->profile_image = $path;
        } elseif ($request->boolean('remove_profile_image')) {
            if ($user->profile_image) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->profile_image);
            }
            $user->profile_image = null;
        }

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();
        $user->syncRoles($validated['roles']);

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        Gate::authorize('delete', $user);

        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
