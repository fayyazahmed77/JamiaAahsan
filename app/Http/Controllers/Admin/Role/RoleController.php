<?php

namespace App\Http\Controllers\Admin\Role;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\PermissionCategory;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

use App\Http\Requests\Admin\Role\StoreRoleRequest;

class RoleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Role/Index', [
            'roles'           => Role::with('permissions')->get(),
            'categories'      => PermissionCategory::with(['permissions' => function($q) {
                $q->where('guard_name', 'web');
            }])->get(),
            'permissions'     => Permission::where('guard_name', 'web')->get(),
            'editingRole'     => null,
            'rolePermissions' => [],
        ]);
    }

    // Role CRUD
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $role = Role::create([
            'name'       => $validated['name'],
            'guard_name' => 'web',
        ]);

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->route('admin.roles.index')->with('success', 'Role created successfully.');
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('Admin/Role/Index', [
            'roles'           => Role::with('permissions')->get(),
            'categories'      => PermissionCategory::with(['permissions' => function($q) {
                $q->where('guard_name', 'web');
            }])->get(),
            'permissions'     => Permission::where('guard_name', 'web')->get(),
            'editingRole'     => $role,
            'rolePermissions' => $role->permissions->pluck('name')->toArray(),
        ]);
    }

    public function update(StoreRoleRequest $request, Role $role): RedirectResponse
    {
        if ($role->name === 'Super Admin') {
            return redirect()->route('admin.roles.index')->with('error', 'Cannot modify the Super Admin role.');
        }

        $validated = $request->validated();

        if (isset($validated['name'])) {
            $role->update(['name' => $validated['name']]);
        }
        $role->syncPermissions($validated['permissions']);

        return redirect()->route('admin.roles.index')->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        if (in_array($role->name, ['Super Admin', 'Admin', 'Student'])) {
            return redirect()->route('admin.roles.index')->with('error', 'Cannot delete system-protected roles.');
        }

        $role->delete();

        return redirect()->route('admin.roles.index')->with('success', 'Role deleted successfully.');
    }

    // Category CRUD
    public function storeCategory(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|unique:permission_categories,name',
            'icon' => 'nullable|string',
        ]);

        PermissionCategory::create($request->only('name', 'icon'));

        return redirect()->route('admin.roles.index')->with('success', 'Permission category created successfully.');
    }

    public function updateCategory(Request $request, PermissionCategory $category): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|unique:permission_categories,name,' . $category->id,
            'icon' => 'nullable|string',
        ]);

        $category->update($request->only('name', 'icon'));

        return redirect()->route('admin.roles.index')->with('success', 'Permission category updated successfully.');
    }

    public function destroyCategory(PermissionCategory $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('admin.roles.index')->with('success', 'Permission category deleted successfully.');
    }

    // Permission CRUD
    public function storePermission(Request $request): RedirectResponse
    {
        $request->validate([
            'name'        => 'required|string|unique:permissions,name',
            'category_id' => 'nullable|exists:permission_categories,id',
        ]);

        Permission::create([
            'name'        => $request->name,
            'guard_name'  => 'web',
            'category_id' => $request->category_id,
        ]);

        Permission::create([
            'name'        => $request->name,
            'guard_name'  => 'api',
            'category_id' => $request->category_id,
        ]);

        return redirect()->route('admin.roles.index')->with('success', 'Permission created successfully.');
    }

    public function updatePermission(Request $request, Permission $permission): RedirectResponse
    {
        $request->validate([
            'name'        => 'required|string|unique:permissions,name,' . $permission->id,
            'category_id' => 'nullable|exists:permission_categories,id',
        ]);

        $apiPermission = Permission::where('name', $permission->name)
            ->where('guard_name', 'api')
            ->first();

        $permission->update([
            'name'        => $request->name,
            'category_id' => $request->category_id,
        ]);

        if ($apiPermission) {
            $apiPermission->update([
                'name'        => $request->name,
                'category_id' => $request->category_id,
            ]);
        }

        return redirect()->route('admin.roles.index')->with('success', 'Permission updated successfully.');
    }

    public function destroyPermission(Permission $permission): RedirectResponse
    {
        Permission::where('name', $permission->name)
            ->where('guard_name', 'api')
            ->delete();

        $permission->delete();

        return redirect()->route('admin.roles.index')->with('success', 'Permission deleted successfully.');
    }
}
