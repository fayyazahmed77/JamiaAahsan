<?php

namespace Tests\Unit\Services;

use App\Models\User;
use App\Models\Notification;
use App\Models\DeviceToken;
use App\Services\NotificationService;
use App\Services\FcmService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Mockery;

class NotificationServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_send_database_notification()
    {
        $user = User::factory()->create();
        $fcmMock = Mockery::mock(FcmService::class);
        $service = new NotificationService($fcmMock);

        $notification = $service->sendDatabase($user, 'Test Title', 'Test Body', ['key' => 'val']);

        $this->assertInstanceOf(Notification::class, $notification);
        $this->assertDatabaseHas('notifications', [
            'user_id' => $user->id,
            'title'   => 'Test Title',
            'body'    => 'Test Body',
        ]);
        
        $this->assertEquals(['key' => 'val'], $notification->data);
    }

    public function test_send_push_notification_without_tokens()
    {
        $user = User::factory()->create();
        $fcmMock = Mockery::mock(FcmService::class);
        $service = new NotificationService($fcmMock);

        $result = $service->sendPush($user, 'Test Title', 'Test Body');
        $this->assertFalse($result);
    }

    public function test_send_push_notification_with_tokens()
    {
        $user = User::factory()->create();
        DeviceToken::create([
            'user_id' => $user->id,
            'token' => 'fcm-token-123',
        ]);

        $fcmMock = Mockery::mock(FcmService::class);
        $fcmMock->shouldReceive('sendNotification')
            ->once()
            ->with('fcm-token-123', 'Test Title', 'Test Body', ['foo' => 'bar'])
            ->andReturn(true);

        $service = new NotificationService($fcmMock);
        $result = $service->sendPush($user, 'Test Title', 'Test Body', ['foo' => 'bar']);

        $this->assertTrue($result);
    }
}
