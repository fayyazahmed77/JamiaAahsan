<?php

namespace Tests\Feature\Admin;

use App\Models\Book;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookTest extends TestCase
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

    public function test_unauthorized_users_cannot_access_books()
    {
        // Unauthenticated
        $this->get(route('admin.books.index'))
            ->assertRedirect(route('login'));

        // Unauthorized
        $standardUser = User::factory()->create();
        $this->actingAs($standardUser)
            ->get(route('admin.books.index'))
            ->assertStatus(403);
    }

    public function test_authorized_users_can_view_books()
    {
        Book::create([
            'name' => 'Kanzul Daqaiq',
            'urdu_name' => 'کنز الدقائق',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->get(route('admin.books.index'))
            ->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Book/Index')
            ->has('books.data', 1)
            ->where('books.data.0.name', 'Kanzul Daqaiq')
        );
    }

    public function test_authorized_user_can_create_book()
    {
        $response = $this->actingAs($this->superAdmin)
            ->post(route('admin.books.store'), [
                'name' => 'New Book',
                'urdu_name' => 'نئی کتاب',
                'status' => true,
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('books', [
            'name' => 'New Book',
            'urdu_name' => 'نئی کتاب',
        ]);
    }

    public function test_authorized_user_can_update_book()
    {
        $book = Book::create([
            'name' => 'Old Book',
            'urdu_name' => 'پرانی کتاب',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->put(route('admin.books.update', $book), [
                'name' => 'Updated Book',
                'urdu_name' => 'اپڈیٹڈ کتاب',
                'status' => false,
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('books', [
            'id' => $book->id,
            'name' => 'Updated Book',
            'status' => 0,
        ]);
    }

    public function test_authorized_user_can_delete_book()
    {
        $book = Book::create([
            'name' => 'To Delete',
            'urdu_name' => 'حذف کریں',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->delete(route('admin.books.destroy', $book));

        $response->assertSessionHasNoErrors();
        $this->assertSoftDeleted('books', [
            'id' => $book->id,
        ]);
    }
}
