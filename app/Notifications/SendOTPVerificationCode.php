<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendOTPVerificationCode extends Notification implements ShouldQueue
{
    use Queueable;

    protected $otp;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $otp)
    {
        $this->otp = $otp;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Jamia Ahsan — Your Security Verification Code')
            ->greeting('Assalamu Alaikum, ' . $notifiable->name)
            ->line('A verification request was initiated for your account at the Jamia Arabia Ahsan Ul Uloom Portal.')
            ->line('Please enter the following 6-digit code to complete the verification process:')
            ->line('## **' . $this->otp . '**')
            ->line('This code is valid for 10 minutes only. Please do not share this code with anyone.')
            ->line('If you did not make this request, please contact the administrator immediately to secure your credentials.')
            ->salutation('Wassalam,' . "\n" . 'Jamia Arabia Ahsan Ul Uloom Portal Administration');
    }
}
