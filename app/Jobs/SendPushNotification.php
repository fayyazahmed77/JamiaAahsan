<?php

namespace App\Jobs;

use App\Services\FcmService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * B2: Dispatches a Firebase Cloud Messaging push notification asynchronously.
 *
 * Uses the database queue driver (QUEUE_CONNECTION=database) — no Redis needed.
 * Run worker with: php artisan queue:work --tries=3
 */
class SendPushNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** Retry up to 3 times before marking as failed. */
    public int $tries = 3;

    /** Wait 30 seconds between retries (exponential backoff). */
    public int $backoff = 30;

    /** Delete the job if the model is missing — prevents ghost jobs. */
    public bool $deleteWhenMissingModels = true;

    public function __construct(
        private readonly string $token,
        private readonly string $title,
        private readonly string $body,
        private readonly array  $data = [],
    ) {}

    public function handle(FcmService $fcm): void
    {
        $result = $fcm->sendNotification($this->token, $this->title, $this->body, $this->data);

        if (!$result) {
            Log::warning('SendPushNotification: FCM returned false for token', [
                'token' => substr($this->token, 0, 20) . '...',
                'title' => $this->title,
            ]);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('SendPushNotification job failed permanently', [
            'token' => substr($this->token, 0, 20) . '...',
            'title' => $this->title,
            'error' => $exception->getMessage(),
        ]);
    }
}
