<?php

namespace Tests\Feature\Api;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $otherUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->otherUser = User::factory()->create();
    }

    public function test_unauthenticated_user_cannot_access_notifications_api()
    {
        $this->getJson('/api/v1/notifications')
            ->assertStatus(401);

        $this->getJson('/api/v1/notifications/unread-count')
            ->assertStatus(401);

        $this->postJson('/api/v1/notifications/1/read')
            ->assertStatus(401);

        $this->postJson('/api/v1/notifications/read-all')
            ->assertStatus(401);
    }

    public function test_user_can_get_notifications()
    {
        Notification::create([
            'user_id' => $this->user->id,
            'title' => 'Test Notification 1',
            'body' => 'Test Body 1',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $this->otherUser->id,
            'title' => 'Other User Notification',
            'body' => 'Test Body',
            'is_read' => false,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/notifications')
            ->assertStatus(200);

        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.title', 'Test Notification 1');
    }

    public function test_user_can_get_unread_count()
    {
        Notification::create([
            'user_id' => $this->user->id,
            'title' => 'Test Notification 1',
            'body' => 'Test Body 1',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $this->user->id,
            'title' => 'Test Notification 2',
            'body' => 'Test Body 2',
            'is_read' => true,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/notifications/unread-count')
            ->assertStatus(200);

        $response->assertJson([
            'unread_count' => 1
        ]);
    }

    public function test_user_can_mark_single_notification_read()
    {
        $notification = Notification::create([
            'user_id' => $this->user->id,
            'title' => 'Test Notification',
            'body' => 'Test Body',
            'is_read' => false,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/v1/notifications/{$notification->id}/read")
            ->assertStatus(200);

        $response->assertJsonPath('success', true);
        $this->assertTrue($notification->fresh()->is_read);
    }

    public function test_user_cannot_mark_other_users_notification_read()
    {
        $notification = Notification::create([
            'user_id' => $this->otherUser->id,
            'title' => 'Other User Notification',
            'body' => 'Test Body',
            'is_read' => false,
        ]);

        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/v1/notifications/{$notification->id}/read")
            ->assertStatus(404);

        $this->assertFalse($notification->fresh()->is_read);
    }

    public function test_user_can_mark_all_notifications_read()
    {
        Notification::create([
            'user_id' => $this->user->id,
            'title' => 'Test Notification 1',
            'body' => 'Test Body 1',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $this->user->id,
            'title' => 'Test Notification 2',
            'body' => 'Test Body 2',
            'is_read' => false,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/notifications/read-all')
            ->assertStatus(200);

        $response->assertJsonPath('success', true);
        $this->assertEquals(0, Notification::where('user_id', $this->user->id)->where('is_read', false)->count());
    }
}
