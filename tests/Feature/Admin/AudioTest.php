<?php

namespace Tests\Feature\Admin;

use App\Models\Audio;
use App\Models\Category;
use App\Models\Media;
use App\Models\Speaker;
use App\Models\User;
use App\Models\Year;
use App\Services\MediaUploadService;
use Database\Seeders\RolePermissionMigrationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

class AudioTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $speaker;
    protected $category;
    protected $year;
    protected $uploadServiceMock;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles & permissions
        $this->seed(RolePermissionMigrationSeeder::class);

        // Create admin user with proper permissions
        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole('Super Admin');

        // Create dependent models for audio association
        $this->speaker = Speaker::create(['name' => 'Test Speaker', 'status' => true]);
        $this->category = Category::create(['name' => 'Bayan', 'type' => 'audio', 'status' => true]);
        $this->year = Year::create(['name' => 2026, 'status' => true]);

        // Mock MediaUploadService
        $this->uploadServiceMock = Mockery::mock(MediaUploadService::class);
        $this->app->instance(MediaUploadService::class, $this->uploadServiceMock);

        Storage::fake('media');
        Storage::fake('thumbnails');
    }

    public function test_unauthenticated_users_are_redirected(): void
    {
        $response = $this->get(route('admin.audio.index'));
        $response->assertRedirect('/login');
    }

    public function test_unauthorized_users_receive_403(): void
    {
        $nonAdmin = User::factory()->create();
        // User has no permissions/roles assigned
        $response = $this->actingAs($nonAdmin)->get(route('admin.audio.index'));
        $response->assertStatus(403);
    }

    public function test_authorized_user_can_view_audio_list(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.audio.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Audio/Index'));
    }

    public function test_authorized_user_can_create_audio(): void
    {
        $this->uploadServiceMock->shouldReceive('uploadAudio')
            ->once()
            ->andReturn('test_audio.mp3');

        $this->uploadServiceMock->shouldReceive('uploadThumbnail')
            ->once()
            ->andReturn('test_thumb.jpg');

        $audioFile = UploadedFile::fake()->create('lecture.mp3', 5000, 'audio/mpeg');
        $thumbnailFile = UploadedFile::fake()->image('thumbnail.jpg');

        $payload = [
            'title' => 'Test Audio Lecture',
            'user_title' => 'Urdu Test Lecture',
            'audio_file' => $audioFile,
            'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'description' => 'Detailed test lecture description',
            'thumbnail' => $thumbnailFile,
            'publish_date' => now()->toDateTimeString(),
            'status' => true,
            'speaker_id' => $this->speaker->id,
            'category_id' => $this->category->id,
            'year_id' => $this->year->id,
            'tags' => ['bayan', 'hadith'],
        ];

        $response = $this->actingAs($this->adminUser)->post(route('admin.audio.store'), $payload);

        $response->assertRedirect(route('admin.audio.index'));
        $this->assertDatabaseHas('audio', [
            'title' => 'Test Audio Lecture',
            'uri' => 'test_audio.mp3',
            'thumbnail_uri' => 'test_thumb.jpg',
        ]);

        $audio = Audio::where('title', 'Test Audio Lecture')->first();
        $this->assertDatabaseHas('media', [
            'audio_id' => $audio->id,
            'speaker_id' => $this->speaker->id,
            'category_id' => $this->category->id,
            'year_id' => $this->year->id,
            'type' => 'audio',
        ]);
    }

    public function test_authorized_user_can_update_audio(): void
    {
        $audio = Audio::create([
            'title' => 'Old Audio Title',
            'uri' => 'old_audio.mp3',
            'status' => true,
        ]);

        Media::create([
            'audio_id' => $audio->id,
            'speaker_id' => $this->speaker->id,
            'category_id' => $this->category->id,
            'year_id' => $this->year->id,
            'type' => 'audio',
            'status' => true,
            'user_id' => $this->adminUser->id,
            'uri' => 'dummy.mp3',
        ]);

        $payload = [
            'title' => 'New Audio Title',
            'user_title' => 'New Urdu Title',
            'uri' => 'old_audio.mp3',
            'youtube_url' => '',
            'description' => 'Updated Description',
            'status' => true,
            'speaker_id' => $this->speaker->id,
            'category_id' => $this->category->id,
            'year_id' => $this->year->id,
            'tags' => ['updated'],
        ];

        $response = $this->actingAs($this->adminUser)->put(route('admin.audio.update', $audio->id), $payload);

        $response->assertRedirect(route('admin.audio.index'));
        $this->assertDatabaseHas('audio', [
            'id' => $audio->id,
            'title' => 'New Audio Title',
        ]);
    }

    public function test_authorized_user_can_delete_audio(): void
    {
        $this->uploadServiceMock->shouldReceive('deleteFile')->twice();

        $audio = Audio::create([
            'title' => 'Audio to Delete',
            'uri' => 'to_delete.mp3',
            'thumbnail_uri' => 'to_delete.jpg',
            'status' => true,
        ]);

        Media::create([
            'audio_id' => $audio->id,
            'speaker_id' => $this->speaker->id,
            'category_id' => $this->category->id,
            'year_id' => $this->year->id,
            'type' => 'audio',
            'status' => true,
            'user_id' => $this->adminUser->id,
            'uri' => 'dummy.mp3',
        ]);

        $response = $this->actingAs($this->adminUser)->delete(route('admin.audio.destroy', $audio->id));

        $response->assertStatus(302);
        $this->assertSoftDeleted('audio', ['id' => $audio->id]);
        $this->assertSoftDeleted('media', ['audio_id' => $audio->id]);
    }

    public function test_authorized_user_can_bulk_delete_audio(): void
    {
        $this->uploadServiceMock->shouldReceive('deleteFile')->times(2);

        $audio1 = Audio::create(['title' => 'Audio 1', 'uri' => 'audio1.mp3', 'status' => true]);
        $audio2 = Audio::create(['title' => 'Audio 2', 'uri' => 'audio2.mp3', 'status' => true]);

        Media::create(['audio_id' => $audio1->id, 'speaker_id' => $this->speaker->id, 'category_id' => $this->category->id, 'year_id' => $this->year->id, 'type' => 'audio', 'status' => true, 'user_id' => $this->adminUser->id, 'uri' => 'dummy1.mp3']);
        Media::create(['audio_id' => $audio2->id, 'speaker_id' => $this->speaker->id, 'category_id' => $this->category->id, 'year_id' => $this->year->id, 'type' => 'audio', 'status' => true, 'user_id' => $this->adminUser->id, 'uri' => 'dummy2.mp3']);

        $payload = [
            'ids' => [$audio1->id, $audio2->id]
        ];

        $response = $this->actingAs($this->adminUser)->post(route('admin.audio.bulk-destroy'), $payload);

        $response->assertStatus(302);
        $this->assertSoftDeleted('audio', ['id' => $audio1->id]);
        $this->assertSoftDeleted('audio', ['id' => $audio2->id]);
    }
}
