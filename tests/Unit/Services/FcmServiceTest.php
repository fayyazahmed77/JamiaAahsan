<?php

namespace Tests\Unit\Services;

use App\Services\FcmService;
use Tests\TestCase;

class FcmServiceTest extends TestCase
{
    public function test_fcm_returns_true_when_not_configured()
    {
        // Set configuration to null to verify fallback simulation behavior
        config(['services.firebase.credentials_json' => null]);

        $service = new FcmService();
        $result = $service->sendNotification('fake-token', 'Test Title', 'Test Body');

        $this->assertTrue($result);
    }
}
