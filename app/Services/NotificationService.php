<?php

namespace App\Services;

use App\Jobs\SendPushNotification;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Mailable;

class NotificationService
{
    /**
     * Send a database notification.
     */
    public function sendDatabase(User $user, string $title, string $body, array $data = []): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'title'   => $title,
            'body'    => $body,
            'data'    => $data,
            'is_read' => false,
        ]);
    }

    /**
     * B2: Send a push notification to all of a user's devices — dispatched async via queue.
     * No longer blocks the request cycle. Uses database queue driver.
     */
    public function sendPush(User $user, string $title, string $body, array $data = []): bool
    {
        $tokens = $user->deviceTokens()->pluck('token');

        if ($tokens->isEmpty()) {
            return false;
        }

        foreach ($tokens as $token) {
            // Dispatch to queue — returns immediately, processed by worker.
            SendPushNotification::dispatch($token, $title, $body, $data)
                ->onQueue('default');
        }

        return true;
    }

    /**
     * B3: Send an email notification — queued asynchronously.
     * Mail class must implement ShouldQueue (already done for Admission mails).
     */
    public function sendEmail(User $user, Mailable $mailable): void
    {
        Mail::to($user->email)->queue($mailable);
    }

    /**
     * Send notification to all channels (DB, Email, Push) — all async.
     */
    public function sendAll(User $user, string $title, string $body, array $data = [], ?Mailable $mailable = null): void
    {
        $this->sendDatabase($user, $title, $body, $data);
        $this->sendPush($user, $title, $body, $data);

        if ($mailable) {
            $this->sendEmail($user, $mailable);
        }
    }

    /**
     * Send bulk notifications to a collection of users (all async).
     *
     * @param Collection<User> $users
     */
    public function sendBulk(Collection $users, string $title, string $body, array $data = [], bool $sendPush = true): void
    {
        foreach ($users as $user) {
            $this->sendDatabase($user, $title, $body, $data);
            if ($sendPush) {
                $this->sendPush($user, $title, $body, $data);
            }
        }
    }
}

