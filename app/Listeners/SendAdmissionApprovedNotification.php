<?php

namespace App\Listeners;

use App\Events\AdmissionApproved;
use App\Services\NotificationService;
use App\Mail\AdmissionApproved as AdmissionApprovedMail;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendAdmissionApprovedNotification implements ShouldQueue
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
    public function handle(AdmissionApproved $event): void
    {
        $detail = $event->userDetail;
        $user = $detail->user;

        if (!$user) {
            return;
        }

        $title = 'Admission Approved!';
        $className = $detail->class ? $detail->class->name : 'N/A';
        $body = "Congratulations! Your admission to class {$className} has been approved. Reg No: {$detail->registration_no}";

        $this->notificationService->sendAll(
            $user,
            $title,
            $body,
            [
                'type' => 'admission_approved',
                'admission_id' => $detail->id,
                'registration_no' => $detail->registration_no,
            ],
            new AdmissionApprovedMail($detail)
        );
    }
}
