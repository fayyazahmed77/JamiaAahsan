<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\DownloadLink;
use App\Models\Feedback;
use App\Models\LatestNews;
use App\Models\PrayerTiming;
use App\Models\Setting;
use App\Models\User;
use App\Models\Year;
use Database\Seeders\RolePermissionMigrationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CmsAndDownloadsTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $category;
    protected $year;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionMigrationSeeder::class);

        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole('Super Admin');

        $this->category = Category::create(['name' => 'General Download', 'type' => 'audio', 'status' => true]);
        $this->year = Year::create(['name' => 2026, 'status' => true]);

        // Seed some settings
        Setting::create(['key' => 'site_name', 'value' => 'Jamia Ahsan']);
    }

    public function test_unauthorized_users_cannot_access_cms(): void
    {
        $nonAdmin = User::factory()->create();
        $this->actingAs($nonAdmin)->get(route('admin.settings.index'))->assertStatus(403);
    }

    public function test_authorized_user_can_view_and_update_settings(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.settings.index'));
        $response->assertStatus(200);

        $payload = [
            'site_name' => 'Jamia Arabia Ahsan Ul Uloom',
            'contact_email' => 'contact@ahsan.com',
            'seo_title' => 'Jamia Ahsan Platform',
        ];

        $response = $this->actingAs($this->adminUser)->put(route('admin.settings.update'), $payload);
        $response->assertRedirect(route('admin.settings.index'));

        $this->assertDatabaseHas('settings', [
            'key' => 'site_name',
            'value' => 'Jamia Arabia Ahsan Ul Uloom',
        ]);
        $this->assertDatabaseHas('settings', [
            'key' => 'contact_email',
            'value' => 'contact@ahsan.com',
        ]);
    }

    public function test_authorized_user_can_update_prayer_timings(): void
    {
        $prayer = PrayerTiming::create([
            'name' => 'Fajr',
            'urdu_name' => 'فجر',
            'time' => '05:00:00',
        ]);

        $response = $this->actingAs($this->adminUser)->get(route('admin.prayer-timings.index'));
        $response->assertStatus(200);

        $response = $this->actingAs($this->adminUser)->put(route('admin.prayer-timings.update', $prayer->id), [
            'time' => '05:15:00',
            'urdu_name' => 'فجر اول',
        ]);

        $response->assertRedirect(route('admin.prayer-timings.index'));
        $this->assertDatabaseHas('prayer_timings', [
            'id' => $prayer->id,
            'time' => '05:15:00',
        ]);
    }

    public function test_authorized_user_can_manage_latest_news(): void
    {
        // View News
        $response = $this->actingAs($this->adminUser)->get(route('admin.latest-news.index'));
        $response->assertStatus(200);

        // Create News
        $response = $this->actingAs($this->adminUser)->post(route('admin.latest-news.store'), [
            'text' => 'New semester starts soon!',
            'link' => 'https://jamia.com/news/1',
            'status' => true,
        ]);
        $response->assertRedirect(route('admin.latest-news.index'));
        $this->assertDatabaseHas('latest_news', ['text' => 'New semester starts soon!']);

        $news = LatestNews::first();

        // Update News
        $response = $this->actingAs($this->adminUser)->put(route('admin.latest-news.update', $news->id), [
            'text' => 'Updated news text!',
            'status' => true,
        ]);
        $response->assertRedirect(route('admin.latest-news.index'));
        $this->assertDatabaseHas('latest_news', ['id' => $news->id, 'text' => 'Updated news text!']);

        // Delete News
        $response = $this->actingAs($this->adminUser)->delete(route('admin.latest-news.destroy', $news->id));
        $response->assertRedirect(route('admin.latest-news.index'));
        $this->assertSoftDeleted('latest_news', ['id' => $news->id]);
    }

    public function test_authorized_user_can_manage_downloads(): void
    {
        // View Downloads
        $response = $this->actingAs($this->adminUser)->get(route('admin.downloads.index'));
        $response->assertStatus(200);

        // Create Download
        $response = $this->actingAs($this->adminUser)->post(route('admin.downloads.store'), [
            'title' => 'Admission Syllabus PDF',
            'description' => 'Syllabus details',
            'category_id' => $this->category->id,
            'year_id' => $this->year->id,
            'url' => 'https://jamia.com/downloads/syllabus.pdf',
            'file_size' => '2.5 MB',
            'status' => true,
            'sort_order' => 1,
        ]);
        $response->assertRedirect(route('admin.downloads.index'));
        $this->assertDatabaseHas('download_links', ['title' => 'Admission Syllabus PDF']);

        $download = DownloadLink::first();

        // Update Download
        $response = $this->actingAs($this->adminUser)->put(route('admin.downloads.update', $download->id), [
            'title' => 'Updated Syllabus Title',
            'category_id' => $this->category->id,
            'year_id' => $this->year->id,
            'url' => 'https://jamia.com/downloads/syllabus.pdf',
            'status' => true,
            'sort_order' => 2,
        ]);
        $response->assertRedirect(route('admin.downloads.index'));
        $this->assertDatabaseHas('download_links', ['id' => $download->id, 'title' => 'Updated Syllabus Title']);

        // Delete Download
        $response = $this->actingAs($this->adminUser)->delete(route('admin.downloads.destroy', $download->id));
        $response->assertRedirect(route('admin.downloads.index'));
        $this->assertSoftDeleted('download_links', ['id' => $download->id]);
    }

    public function test_authorized_user_can_manage_feedback(): void
    {
        $feedback = Feedback::create([
            'name' => 'Anonymous User',
            'email' => 'anon@mail.com',
            'country' => 'Pakistan',
            'comment' => 'Very good educational platform.',
            'rating' => 5,
            'phone' => '03009876543',
        ]);

        // View Feedback
        $response = $this->actingAs($this->adminUser)->get(route('admin.feedback.index'));
        $response->assertStatus(200);

        // Update Read Status
        $response = $this->actingAs($this->adminUser)->put(route('admin.feedback.update', $feedback->id), [
            'is_read' => true
        ]);
        $response->assertStatus(302);
        $this->assertTrue((bool)Feedback::find($feedback->id)->is_read);

        // Save reply
        $response = $this->actingAs($this->adminUser)->put(route('admin.feedback.update', $feedback->id), [
            'reply' => 'Thank you for your valuable feedback!'
        ]);
        $response->assertStatus(302);
        $this->assertNotNull(Feedback::find($feedback->id)->replied_at);

        // Delete Feedback
        $response = $this->actingAs($this->adminUser)->delete(route('admin.feedback.destroy', $feedback->id));
        $response->assertRedirect(route('admin.feedback.index'));
        $this->assertSoftDeleted('feedback', ['id' => $feedback->id]);
    }
}
