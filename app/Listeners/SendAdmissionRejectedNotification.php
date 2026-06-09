<?php

namespace App\Listeners;

use App\Events\AdmissionRejected;
use App\Services\NotificationService;
use App\Mail\AdmissionRejected as AdmissionRejectedMail;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendAdmissionRejectedNotification implements ShouldQueue
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
    public function handle(AdmissionRejected $event): void
    {
        $detail = $event->userDetail;
        $user = $detail->user;

        if (!$user) {
            return;
        }

        $title = 'Admission Status Update';
        $body = "There is an update on your admission application status: {$event->note}";

        $this->notificationService->sendAll(
            $user,
            $title,
            $body,
            [
                'type' => 'admission_rejected',
                'admission_id' => $detail->id,
                'note' => $event->note,
            ],
            new AdmissionRejectedMail($detail, $event->note)
        );
    }
}
