<?php

namespace App\Listeners;

use App\Events\AdmissionSubmitted;
use App\Services\NotificationService;
use App\Mail\AdmissionSubmitted as AdmissionSubmittedMail;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendAdmissionSubmittedEmail implements ShouldQueue
{
    protected $notificationService;

    /**
     * Create the event listener.
     */
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the event.
     */
    public function handle(AdmissionSubmitted $event): void
    {
        $detail = $event->userDetail;
        $user = $detail->user;

        if (!$user) {
            return;
        }

        $title = 'Admission Application Received';
        $className = $detail->class ? $detail->class->name : 'N/A';
        $body = "Your application for admission to class {$className} has been received and is under review.";

        // Send DB, Push, and Email
        $this->notificationService->sendAll(
            $user,
            $title,
            $body,
            [
                'type' => 'admission_submitted',
                'admission_id' => $detail->id,
            ],
            new AdmissionSubmittedMail($detail)
        );
    }
}
