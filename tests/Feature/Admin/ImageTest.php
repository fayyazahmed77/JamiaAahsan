<?php

namespace Tests\Feature\Admin;

use App\Models\Image;
use App\Models\User;
use App\Services\MediaUploadService;
use Database\Seeders\RolePermissionMigrationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

class ImageTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $uploadServiceMock;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionMigrationSeeder::class);

        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole('Super Admin');

        $this->uploadServiceMock = Mockery::mock(MediaUploadService::class);
        $this->app->instance(MediaUploadService::class, $this->uploadServiceMock);

        Storage::fake('media');
    }

    public function test_unauthenticated_users_are_redirected(): void
    {
        $response = $this->get(route('admin.images.index'));
        $response->assertRedirect('/login');
    }

    public function test_unauthorized_users_receive_403(): void
    {
        $nonAdmin = User::factory()->create();
        $response = $this->actingAs($nonAdmin)->get(route('admin.images.index'));
        $response->assertStatus(403);
    }

    public function test_authorized_user_can_view_images_list(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.images.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Image/Index'));
    }

    public function test_authorized_user_can_create_image(): void
    {
        $this->uploadServiceMock->shouldReceive('uploadImage')
            ->once()
            ->andReturn('test_banner.jpg');

        $imageFile = UploadedFile::fake()->image('banner.jpg');

        $payload = [
            'title' => 'Home Page Slide 1',
            'description' => 'First slide banner description',
            'btn_title' => 'Apply Now',
            'btn_link' => 'https://jamia.com/apply',
            'weight' => 5,
            'status' => true,
            'image' => $imageFile,
        ];

        $response = $this->actingAs($this->adminUser)->post(route('admin.images.store'), $payload);

        $response->assertRedirect(route('admin.images.index'));
        $this->assertDatabaseHas('images', [
            'title' => 'Home Page Slide 1',
            'uri' => 'test_banner.jpg',
            'weight' => 5,
        ]);
    }

    public function test_authorized_user_can_update_image(): void
    {
        $image = Image::create([
            'title' => 'Old Banner',
            'uri' => 'old_banner.jpg',
            'weight' => 2,
            'status' => true,
        ]);

        $payload = [
            'title' => 'New Banner Title',
            'weight' => 10,
            'status' => true,
        ];

        $response = $this->actingAs($this->adminUser)->put(route('admin.images.update', $image->id), $payload);

        $response->assertRedirect(route('admin.images.index'));
        $this->assertDatabaseHas('images', [
            'id' => $image->id,
            'title' => 'New Banner Title',
            'weight' => 10,
        ]);
    }

    public function test_authorized_user_can_delete_image(): void
    {
        $this->uploadServiceMock->shouldReceive('deleteFile')->once();

        $image = Image::create([
            'title' => 'Banner to Delete',
            'uri' => 'to_delete.jpg',
            'status' => true,
        ]);

        $response = $this->actingAs($this->adminUser)->delete(route('admin.images.destroy', $image->id));

        $response->assertRedirect(route('admin.images.index'));
        $this->assertSoftDeleted('images', ['id' => $image->id]);
    }

    public function test_authorized_user_can_reorder_images(): void
    {
        $img1 = Image::create(['title' => 'Image 1', 'uri' => 'img1.jpg', 'weight' => 1, 'status' => true]);
        $img2 = Image::create(['title' => 'Image 2', 'uri' => 'img2.jpg', 'weight' => 2, 'status' => true]);

        $payload = [
            'ids' => [$img2->id, $img1->id]
        ];

        $response = $this->actingAs($this->adminUser)->post(route('admin.images.reorder'), $payload);

        $response->assertStatus(302);
        
        $this->assertEquals(0, Image::find($img2->id)->weight);
        $this->assertEquals(1, Image::find($img1->id)->weight);
    }
}
