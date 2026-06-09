<?php

namespace Tests\Feature\Admin;

use App\Models\Department;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DepartmentTest extends TestCase
{
    use RefreshDatabase;

    protected $superAdmin;
    protected $admin;
    protected $student;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\RolePermissionMigrationSeeder::class);

        $this->superAdmin = User::factory()->create();
        $this->superAdmin->assignRole('Super Admin');

        $this->admin = User::factory()->create();
        $this->admin->assignRole('Admin');

        $this->student = User::factory()->create();
        $this->student->assignRole('Student');
    }

    public function test_unauthorized_users_cannot_access_departments()
    {
        // Unauthenticated
        $this->get(route('admin.departments.index'))
            ->assertRedirect(route('login'));

        // Unauthorized (Standard user without roles does not have settings permissions)
        $standardUser = User::factory()->create();
        $this->actingAs($standardUser)
            ->get(route('admin.departments.index'))
            ->assertStatus(403);
    }

    public function test_authorized_users_can_view_departments()
    {
        Department::create([
            'name' => 'Fatwa Department',
            'name_urdu' => 'شعبہ افتاء',
            'slug' => 'fatwa-department',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->get(route('admin.departments.index'))
            ->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Department/Index')
            ->has('departments.data', 1)
            ->where('departments.data.0.name', 'Fatwa Department')
        );
    }

    public function test_authorized_user_can_create_department()
    {
        $response = $this->actingAs($this->superAdmin)
            ->post(route('admin.departments.store'), [
                'name' => 'Fatwa Department',
                'name_urdu' => 'شعبہ افتاء',
                'description' => 'Islamic verdicts and guidance.',
                'status' => true,
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('departments', [
            'name' => 'Fatwa Department',
            'name_urdu' => 'شعبہ افتاء',
        ]);
    }

    public function test_authorized_user_can_update_department()
    {
        $department = Department::create([
            'name' => 'Old Department',
            'name_urdu' => 'شعبہ پرانا',
            'slug' => 'old-department',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->put(route('admin.departments.update', $department), [
                'name' => 'New Department',
                'name_urdu' => 'شعبہ نیا',
                'status' => false,
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('departments', [
            'id' => $department->id,
            'name' => 'New Department',
            'name_urdu' => 'شعبہ نیا',
            'status' => 0,
        ]);
    }

    public function test_authorized_user_can_delete_department()
    {
        $department = Department::create([
            'name' => 'To Delete',
            'name_urdu' => 'حذف کریں',
            'slug' => 'to-delete',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->delete(route('admin.departments.destroy', $department));

        $response->assertSessionHasNoErrors();
        $this->assertSoftDeleted('departments', [
            'id' => $department->id,
        ]);
    }
}
