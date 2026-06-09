<?php

namespace Tests\Feature\Admin;

use App\Models\Book;
use App\Models\ClassSession;
use App\Models\Klass;
use App\Models\Teacher;
use App\Models\User;
use App\Models\Year;
use Database\Seeders\RolePermissionMigrationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClassTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $klass;
    protected $teacher;
    protected $book;
    protected $year;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionMigrationSeeder::class);

        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole('Super Admin');

        $this->klass = Klass::create([
            'name' => 'Adib Awwal',
            'slug' => 'adib-awwal',
            'description' => 'First year Arabic',
            'status' => true,
        ]);

        $this->teacher = Teacher::create(['name' => 'Mufti Kifayatullah', 'urdu_name' => 'مفتی کفایت اللہ', 'status' => true]);
        $this->book = Book::create(['name' => 'Al-Qiraat-ul-Washiha', 'urdu_name' => 'القراءۃ الواضحہ', 'status' => true]);
        $this->year = Year::create(['name' => 2026, 'status' => true]);
    }

    public function test_unauthorized_users_cannot_access_classes(): void
    {
        $nonAdmin = User::factory()->create();
        $this->actingAs($nonAdmin)->get(route('admin.classes.index'))->assertStatus(403);
    }

    public function test_authorized_user_can_view_classes(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.classes.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Class/Index'));
    }

    public function test_authorized_user_can_create_class(): void
    {
        $payload = [
            'name' => 'Adib Thani',
            'description' => 'Second year Arabic',
            'live_link' => 'https://zoom.us/j/123456',
            'youtube_live_link' => 'https://youtube.com/live/123',
            'sort' => 2,
            'status' => true,
        ];

        $response = $this->actingAs($this->adminUser)->post(route('admin.classes.store'), $payload);

        $response->assertRedirect(route('admin.classes.index'));
        $this->assertDatabaseHas('classes', [
            'name' => 'Adib Thani',
            'slug' => 'adib-thani',
            'sort' => 2,
        ]);
    }

    public function test_authorized_user_can_update_class(): void
    {
        $payload = [
            'name' => 'Adib Awwal Updated',
            'sort' => 1,
            'status' => true,
        ];

        $response = $this->actingAs($this->adminUser)->put(route('admin.classes.update', $this->klass->id), $payload);

        $response->assertRedirect(route('admin.classes.index'));
        $this->assertDatabaseHas('classes', [
            'id' => $this->klass->id,
            'name' => 'Adib Awwal Updated',
        ]);
    }

    public function test_cannot_delete_class_with_associated_sessions(): void
    {
        ClassSession::create([
            'class_id' => $this->klass->id,
            'teacher_id' => $this->teacher->id,
            'book_id' => $this->book->id,
            'year_id' => $this->year->id,
            'status' => true,
        ]);

        $response = $this->actingAs($this->adminUser)->delete(route('admin.classes.destroy', $this->klass->id));

        $response->assertStatus(302);
        $this->assertDatabaseHas('classes', ['id' => $this->klass->id]);
    }

    public function test_authorized_user_can_delete_class_without_sessions(): void
    {
        $emptyClass = Klass::create([
            'name' => 'Empty Class',
            'slug' => 'empty-class',
            'status' => true,
        ]);

        $response = $this->actingAs($this->adminUser)->delete(route('admin.classes.destroy', $emptyClass->id));

        $response->assertRedirect(route('admin.classes.index'));
        $this->assertSoftDeleted('classes', ['id' => $emptyClass->id]);
    }

    public function test_authorized_user_can_view_class_sessions(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.classes.sessions.index', $this->klass->id));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Class/Sessions'));
    }

    public function test_authorized_user_can_create_class_session(): void
    {
        $payload = [
            'teacher_id' => $this->teacher->id,
            'book_id' => $this->book->id,
            'year_id' => $this->year->id,
            'lecture_link' => 'https://youtube.com/watch?v=123',
            'status' => true,
        ];

        $response = $this->actingAs($this->adminUser)->post(route('admin.classes.sessions.store', $this->klass->id), $payload);

        $response->assertRedirect(route('admin.classes.sessions.index', $this->klass->id));
        $this->assertDatabaseHas('class_sessions', [
            'class_id' => $this->klass->id,
            'teacher_id' => $this->teacher->id,
            'book_id' => $this->book->id,
            'lecture_link' => 'https://youtube.com/watch?v=123',
        ]);
    }

    public function test_authorized_user_can_update_class_session(): void
    {
        $session = ClassSession::create([
            'class_id' => $this->klass->id,
            'teacher_id' => $this->teacher->id,
            'book_id' => $this->book->id,
            'year_id' => $this->year->id,
            'status' => true,
        ]);

        $payload = [
            'teacher_id' => $this->teacher->id,
            'book_id' => $this->book->id,
            'year_id' => $this->year->id,
            'lecture_link' => 'https://zoom.us/new',
            'status' => true,
        ];

        $response = $this->actingAs($this->adminUser)->put(route('admin.classes.sessions.update', [$this->klass->id, $session->id]), $payload);

        $response->assertRedirect(route('admin.classes.sessions.index', $this->klass->id));
        $this->assertDatabaseHas('class_sessions', [
            'id' => $session->id,
            'lecture_link' => 'https://zoom.us/new',
        ]);
    }

    public function test_authorized_user_can_delete_class_session(): void
    {
        $session = ClassSession::create([
            'class_id' => $this->klass->id,
            'teacher_id' => $this->teacher->id,
            'book_id' => $this->book->id,
            'year_id' => $this->year->id,
            'status' => true,
        ]);

        $response = $this->actingAs($this->adminUser)->delete(route('admin.classes.sessions.destroy', [$this->klass->id, $session->id]));

        $response->assertRedirect(route('admin.classes.sessions.index', $this->klass->id));
        $this->assertSoftDeleted('class_sessions', ['id' => $session->id]);
    }
}
