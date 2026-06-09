<?php

namespace Tests\Feature\Admin;

use App\Models\Notification;
use App\Models\User;
use Database\Seeders\RolePermissionMigrationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class SystemManagementTest extends TestCase
{
    use RefreshDatabase;

    protected $superAdmin;
    protected $standardAdmin;
    protected $testUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionMigrationSeeder::class);

        // Super Admin (Role: Super Admin)
        $this->superAdmin = User::factory()->create();
        $this->superAdmin->assignRole('Super Admin');

        // Standard Admin (Role: Admin)
        $this->standardAdmin = User::factory()->create();
        $this->standardAdmin->assignRole('Admin');

        // Test User for testing admin actions
        $this->testUser = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@test.com',
            'status' => true,
        ]);
    }

    public function test_standard_admin_cannot_access_system_management(): void
    {
        // Gated with role:Super Admin
        $this->actingAs($this->standardAdmin)->get(route('admin.users.index'))->assertStatus(403);
        $this->actingAs($this->standardAdmin)->get(route('admin.roles.index'))->assertStatus(403);
        $this->actingAs($this->standardAdmin)->get(route('admin.notifications.index'))->assertStatus(403);
    }

    public function test_super_admin_can_view_users_list(): void
    {
        $response = $this->actingAs($this->superAdmin)->get(route('admin.users.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/User/Index'));
    }

    public function test_super_admin_can_create_user_and_assign_role(): void
    {
        $payload = [
            'name' => 'New Staff Member',
            'email' => 'staff@jamia.com',
            'password' => 'StaffPass123',
            'password_confirmation' => 'StaffPass123',
            'status' => true,
            'roles' => ['Admin'],
        ];

        $response = $this->actingAs($this->superAdmin)->post(route('admin.users.store'), $payload);

        $response->assertRedirect(route('admin.users.index'));
        $this->assertDatabaseHas('users', ['email' => 'staff@jamia.com']);

        $user = User::where('email', 'staff@jamia.com')->first();
        $this->assertTrue($user->hasRole('Admin'));
    }

    public function test_super_admin_can_update_user(): void
    {
        $payload = [
            'name' => 'Demo User Updated',
            'email' => 'demo@test.com',
            'status' => true,
            'roles' => ['Super Admin'],
        ];

        $response = $this->actingAs($this->superAdmin)->put(route('admin.users.update', $this->testUser->id), $payload);

        $response->assertRedirect(route('admin.users.index'));
        $this->assertDatabaseHas('users', [
            'id' => $this->testUser->id,
            'name' => 'Demo User Updated',
        ]);
        $this->assertTrue(User::find($this->testUser->id)->hasRole('Super Admin'));
    }

    public function test_super_admin_cannot_delete_own_account(): void
    {
        $response = $this->actingAs($this->superAdmin)->delete(route('admin.users.destroy', $this->superAdmin->id));
        $response->assertStatus(302);
        $this->assertDatabaseHas('users', ['id' => $this->superAdmin->id]);
    }

    public function test_super_admin_can_delete_other_user(): void
    {
        $response = $this->actingAs($this->superAdmin)->delete(route('admin.users.destroy', $this->testUser->id));
        $response->assertRedirect(route('admin.users.index'));
        $this->assertDatabaseMissing('users', ['id' => $this->testUser->id]);
    }

    public function test_super_admin_can_update_role_permissions(): void
    {
        $role = Role::where('name', 'Admin')->first();

        // Get edit view
        $response = $this->actingAs($this->superAdmin)->get(route('admin.roles.edit', $role->id));
        $response->assertStatus(200);

        // Update permissions
        $payload = [
            'permissions' => ['view audio', 'create audio'],
        ];

        $response = $this->actingAs($this->superAdmin)->put(route('admin.roles.update', $role->id), $payload);
        $response->assertRedirect(route('admin.roles.index'));

        $this->assertTrue($role->hasPermissionTo('view audio'));
        $this->assertTrue($role->hasPermissionTo('create audio'));
        $this->assertFalse($role->hasPermissionTo('delete audio'));
    }

    public function test_super_admin_can_broadcast_notifications(): void
    {
        // View broadcast log
        $response = $this->actingAs($this->superAdmin)->get(route('admin.notifications.index'));
        $response->assertStatus(200);

        // Broadcast to specific users
        $payload = [
            'title' => 'Broadcast Test Alert',
            'body' => 'This is a test notification body.',
            'target' => 'users',
            'user_ids' => [$this->testUser->id],
        ];

        $response = $this->actingAs($this->superAdmin)->post(route('admin.notifications.broadcast'), $payload);
        $response->assertRedirect(route('admin.notifications.index'));

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->testUser->id,
            'title' => 'Broadcast Test Alert',
            'body' => 'This is a test notification body.',
        ]);
    }
}
