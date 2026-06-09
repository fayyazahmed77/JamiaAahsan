<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
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

    public function test_unauthorized_users_cannot_access_categories()
    {
        // Unauthenticated
        $this->get(route('admin.categories.index'))
            ->assertRedirect(route('login'));

        // Unauthorized
        $standardUser = User::factory()->create();
        $this->actingAs($standardUser)
            ->get(route('admin.categories.index'))
            ->assertStatus(403);
    }

    public function test_authorized_users_can_view_categories()
    {
        Category::create([
            'name' => 'Ramadan Lectures',
            'type' => 'audio',
            'slug' => 'ramadan-lectures',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->get(route('admin.categories.index'))
            ->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Category/Index')
            ->has('categories.data', 1)
            ->where('categories.data.0.name', 'Ramadan Lectures')
        );
    }

    public function test_authorized_user_can_create_category()
    {
        $response = $this->actingAs($this->superAdmin)
            ->post(route('admin.categories.store'), [
                'name' => 'New Category',
                'type' => 'audio',
                'slug' => 'new-category',
                'status' => true,
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('categories', [
            'name' => 'New Category',
            'type' => 'audio',
            'slug' => 'new-category',
        ]);
    }

    public function test_authorized_user_can_update_category()
    {
        $category = Category::create([
            'name' => 'Old Category',
            'type' => 'audio',
            'slug' => 'old-category',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->put(route('admin.categories.update', $category), [
                'name' => 'Updated Category',
                'type' => 'audio',
                'slug' => 'updated-category',
                'status' => false,
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Category',
            'status' => 0,
        ]);
    }

    public function test_authorized_user_can_delete_category()
    {
        $category = Category::create([
            'name' => 'To Delete',
            'type' => 'audio',
            'slug' => 'to-delete',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->delete(route('admin.categories.destroy', $category));

        $response->assertSessionHasNoErrors();
        $this->assertSoftDeleted('categories', [
            'id' => $category->id,
        ]);
    }
}
