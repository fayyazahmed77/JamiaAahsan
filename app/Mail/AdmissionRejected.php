<?php

namespace App\Mail;

use App\Models\UserDetail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdmissionRejected extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $userDetail;
    public $note;

    /**
     * Create a new message instance.
     */
    public function __construct(UserDetail $userDetail, string $note)
    {
        $this->userDetail = $userDetail;
        $this->note = $note;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Admission Application Status Update - Jamia Arabia Ahsan Ul Uloom',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $className = $this->userDetail->class ? $this->userDetail->class->name : 'N/A';
        return new Content(
            view: 'mail.admission_rejected',
            with: [
                'name' => $this->userDetail->user->name,
                'className' => $className,
                'note' => $this->note,
            ],
        );
    }
}
