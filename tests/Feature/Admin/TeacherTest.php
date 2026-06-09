<?php

namespace Tests\Feature\Admin;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherTest extends TestCase
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

    public function test_unauthorized_users_cannot_access_teachers()
    {
        // Unauthenticated
        $this->get(route('admin.teachers.index'))
            ->assertRedirect(route('login'));

        // Unauthorized
        $standardUser = User::factory()->create();
        $this->actingAs($standardUser)
            ->get(route('admin.teachers.index'))
            ->assertStatus(403);
    }

    public function test_authorized_users_can_view_teachers()
    {
        Teacher::create([
            'name' => 'Maulana Zaid',
            'urdu_name' => 'مولانا زید',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->get(route('admin.teachers.index'))
            ->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Teacher/Index')
            ->has('teachers.data', 1)
            ->where('teachers.data.0.name', 'Maulana Zaid')
        );
    }

    public function test_authorized_user_can_create_teacher()
    {
        $response = $this->actingAs($this->superAdmin)
            ->post(route('admin.teachers.store'), [
                'name' => 'New Teacher',
                'urdu_name' => 'نیا استاد',
                'status' => true,
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('teachers', [
            'name' => 'New Teacher',
            'urdu_name' => 'نیا استاد',
        ]);
    }

    public function test_authorized_user_can_update_teacher()
    {
        $teacher = Teacher::create([
            'name' => 'Old Teacher',
            'urdu_name' => 'پرانا استاد',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->put(route('admin.teachers.update', $teacher), [
                'name' => 'Updated Teacher',
                'urdu_name' => 'اپڈیٹڈ استاد',
                'status' => false,
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('teachers', [
            'id' => $teacher->id,
            'name' => 'Updated Teacher',
            'status' => 0,
        ]);
    }

    public function test_authorized_user_can_delete_teacher()
    {
        $teacher = Teacher::create([
            'name' => 'To Delete',
            'urdu_name' => 'حذف کریں',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->delete(route('admin.teachers.destroy', $teacher));

        $response->assertSessionHasNoErrors();
        $this->assertSoftDeleted('teachers', [
            'id' => $teacher->id,
        ]);
    }
}
