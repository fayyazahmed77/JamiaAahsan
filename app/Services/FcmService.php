<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Exception;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification as FirebaseNotification;

class FcmService
{
    protected $messaging = null;

    public function __construct()
    {
        $credentialsJson = config('services.firebase.credentials_json');
        
        if (!empty($credentialsJson)) {
            try {
                $credentials = json_decode($credentialsJson, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($credentials)) {
                    $factory = (new Factory)->withServiceAccount($credentials);
                    $this->messaging = $factory->createMessaging();
                } else if (file_exists($credentialsJson)) {
                    // It might be a file path
                    $factory = (new Factory)->withServiceAccount($credentialsJson);
                    $this->messaging = $factory->createMessaging();
                } else {
                    Log::warning('Firebase credentials configured but invalid JSON format or file does not exist.');
                }
            } catch (Exception $e) {
                Log::warning('Firebase initialization failed: ' . $e->getMessage());
            }
        }
    }

    /**
     * Send push notification to a specific token.
     *
     * @param string $token
     * @param string $title
     * @param string $body
     * @param array $data
     * @return bool
     */
    public function sendNotification(string $token, string $title, string $body, array $data = []): bool
    {
        if (!$this->messaging) {
            Log::info("FCM push simulated (FCM not configured) to token: {$token} - Title: {$title} - Body: {$body}", $data);
            return true;
        }

        try {
            $message = CloudMessage::withTarget('token', $token)
                ->withNotification(FirebaseNotification::create($title, $body))
                ->withData($data);

            $this->messaging->send($message);
            return true;
        } catch (Exception $e) {
            Log::error('FCM sending failed: ' . $e->getMessage(), [
                'token' => $token,
                'title' => $title,
            ]);
            return false;
        }
    }
}
