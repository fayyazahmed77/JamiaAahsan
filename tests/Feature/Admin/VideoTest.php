<?php

namespace Tests\Feature\Admin;

use App\Models\Video;
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

class VideoTest extends TestCase
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

        $this->seed(RolePermissionMigrationSeeder::class);

        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole('Super Admin');

        $this->speaker = Speaker::create(['name' => 'Test Speaker', 'status' => true]);
        $this->category = Category::create(['name' => 'Bayan Video', 'type' => 'video', 'status' => true]);
        $this->year = Year::create(['name' => 2026, 'status' => true]);

        $this->uploadServiceMock = Mockery::mock(MediaUploadService::class);
        $this->app->instance(MediaUploadService::class, $this->uploadServiceMock);

        Storage::fake('media');
        Storage::fake('thumbnails');
    }

    public function test_unauthenticated_users_are_redirected(): void
    {
        $response = $this->get(route('admin.videos.index'));
        $response->assertRedirect('/login');
    }

    public function test_unauthorized_users_receive_403(): void
    {
        $nonAdmin = User::factory()->create();
        $response = $this->actingAs($nonAdmin)->get(route('admin.videos.index'));
        $response->assertStatus(403);
    }

    public function test_authorized_user_can_view_videos_list(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.videos.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Video/Index'));
    }

    public function test_authorized_user_can_create_video(): void
    {
        $this->uploadServiceMock->shouldReceive('uploadVideo')
            ->once()
            ->andReturn('test_video.mp4');

        $this->uploadServiceMock->shouldReceive('uploadThumbnail')
            ->once()
            ->andReturn('test_video_thumb.jpg');

        $videoFile = UploadedFile::fake()->create('lecture.mp4', 20000, 'video/mp4');
        $thumbnailFile = UploadedFile::fake()->image('thumbnail.jpg');

        $payload = [
            'title' => 'Test Video Lecture',
            'urdu_title' => 'Urdu Test Video',
            'video_file' => $videoFile,
            'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'description' => 'Detailed test video description',
            'thumbnail' => $thumbnailFile,
            'status' => true,
            'speaker_id' => $this->speaker->id,
            'category_id' => $this->category->id,
            'year_id' => $this->year->id,
            'tags' => ['video', 'bayan'],
        ];

        $response = $this->actingAs($this->adminUser)->post(route('admin.videos.store'), $payload);

        $response->assertRedirect(route('admin.videos.index'));
        $this->assertDatabaseHas('videos', [
            'title' => 'Test Video Lecture',
            'uri' => 'test_video.mp4',
            'thumbnail_uri' => 'test_video_thumb.jpg',
        ]);

        $video = Video::where('title', 'Test Video Lecture')->first();
        $this->assertDatabaseHas('media', [
            'video_id' => $video->id,
            'speaker_id' => $this->speaker->id,
            'category_id' => $this->category->id,
            'year_id' => $this->year->id,
            'type' => 'video',
        ]);
    }

    public function test_authorized_user_can_update_video(): void
    {
        $video = Video::create([
            'title' => 'Old Video Title',
            'slug' => 'old-video-title',
            'uri' => 'old_video.mp4',
            'status' => true,
        ]);

        Media::create([
            'video_id' => $video->id,
            'speaker_id' => $this->speaker->id,
            'category_id' => $this->category->id,
            'year_id' => $this->year->id,
            'type' => 'video',
            'status' => true,
            'user_id' => $this->adminUser->id,
            'uri' => 'dummy.mp4',
        ]);

        $payload = [
            'title' => 'New Video Title',
            'urdu_title' => 'New Urdu Title',
            'uri' => 'old_video.mp4',
            'youtube_url' => '',
            'description' => 'Updated Video Description',
            'status' => true,
            'speaker_id' => $this->speaker->id,
            'category_id' => $this->category->id,
            'year_id' => $this->year->id,
            'tags' => ['updated'],
        ];

        $response = $this->actingAs($this->adminUser)->put(route('admin.videos.update', $video->id), $payload);

        $response->assertRedirect(route('admin.videos.index'));
        $this->assertDatabaseHas('videos', [
            'id' => $video->id,
            'title' => 'New Video Title',
        ]);
    }

    public function test_authorized_user_can_delete_video(): void
    {
        $this->uploadServiceMock->shouldReceive('deleteFile')->twice();

        $video = Video::create([
            'title' => 'Video to Delete',
            'slug' => 'video-to-delete',
            'uri' => 'to_delete.mp4',
            'thumbnail_uri' => 'to_delete_video.jpg',
            'status' => true,
        ]);

        Media::create([
            'video_id' => $video->id,
            'speaker_id' => $this->speaker->id,
            'category_id' => $this->category->id,
            'year_id' => $this->year->id,
            'type' => 'video',
            'status' => true,
            'user_id' => $this->adminUser->id,
            'uri' => 'dummy.mp4',
        ]);

        $response = $this->actingAs($this->adminUser)->delete(route('admin.videos.destroy', $video->id));

        $response->assertStatus(302);
        $this->assertSoftDeleted('videos', ['id' => $video->id]);
        $this->assertSoftDeleted('media', ['video_id' => $video->id]);
    }

    public function test_authorized_user_can_bulk_delete_videos(): void
    {
        $this->uploadServiceMock->shouldReceive('deleteFile')->times(2);

        $video1 = Video::create(['title' => 'Video 1', 'slug' => 'video-1', 'uri' => 'video1.mp4', 'status' => true]);
        $video2 = Video::create(['title' => 'Video 2', 'slug' => 'video-2', 'uri' => 'video2.mp4', 'status' => true]);

        Media::create(['video_id' => $video1->id, 'speaker_id' => $this->speaker->id, 'category_id' => $this->category->id, 'year_id' => $this->year->id, 'type' => 'video', 'status' => true, 'user_id' => $this->adminUser->id, 'uri' => 'dummy1.mp4']);
        Media::create(['video_id' => $video2->id, 'speaker_id' => $this->speaker->id, 'category_id' => $this->category->id, 'year_id' => $this->year->id, 'type' => 'video', 'status' => true, 'user_id' => $this->adminUser->id, 'uri' => 'dummy2.mp4']);

        $payload = [
            'ids' => [$video1->id, $video2->id]
        ];

        $response = $this->actingAs($this->adminUser)->post(route('admin.videos.bulk-destroy'), $payload);

        $response->assertStatus(302);
        $this->assertSoftDeleted('videos', ['id' => $video1->id]);
        $this->assertSoftDeleted('videos', ['id' => $video2->id]);
    }
}
