<?php

namespace Tests\Feature\Admin;

use App\Models\Speaker;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SpeakerTest extends TestCase
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

    public function test_unauthorized_users_cannot_access_speakers()
    {
        // Unauthenticated
        $this->get(route('admin.speakers.index'))
            ->assertRedirect(route('login'));

        // Unauthorized
        $standardUser = User::factory()->create();
        $this->actingAs($standardUser)
            ->get(route('admin.speakers.index'))
            ->assertStatus(403);
    }

    public function test_authorized_users_can_view_speakers()
    {
        Speaker::create([
            'name' => 'Mufti Abu Lubaba',
            'short_name' => 'Abu Lubaba',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->get(route('admin.speakers.index'))
            ->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Speaker/Index')
            ->has('speakers.data', 1)
            ->where('speakers.data.0.name', 'Mufti Abu Lubaba')
        );
    }

    public function test_authorized_user_can_create_speaker()
    {
        $response = $this->actingAs($this->superAdmin)
            ->post(route('admin.speakers.store'), [
                'name' => 'New Speaker',
                'short_name' => 'New',
                'status' => true,
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('speakers', [
            'name' => 'New Speaker',
            'short_name' => 'New',
        ]);
    }

    public function test_authorized_user_can_update_speaker()
    {
        $speaker = Speaker::create([
            'name' => 'Old Speaker',
            'short_name' => 'Old',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->put(route('admin.speakers.update', $speaker), [
                'name' => 'Updated Speaker',
                'short_name' => 'Updated',
                'status' => false,
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('speakers', [
            'id' => $speaker->id,
            'name' => 'Updated Speaker',
            'status' => 0,
        ]);
    }

    public function test_authorized_user_can_delete_speaker()
    {
        $speaker = Speaker::create([
            'name' => 'To Delete',
            'short_name' => 'Delete',
            'status' => true,
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->delete(route('admin.speakers.destroy', $speaker));

        $response->assertSessionHasNoErrors();
        $this->assertSoftDeleted('speakers', [
            'id' => $speaker->id,
        ]);
    }
}
