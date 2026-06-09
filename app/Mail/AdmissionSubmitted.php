<?php

namespace App\Mail;

use App\Models\UserDetail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdmissionSubmitted extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $userDetail;

    /**
     * Create a new message instance.
     */
    public function __construct(UserDetail $userDetail)
    {
        $this->userDetail = $userDetail;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Admission Application Received - Jamia Arabia Ahsan Ul Uloom',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $className = $this->userDetail->class ? $this->userDetail->class->name : 'N/A';
        return new Content(
            view: 'mail.admission_submitted',
            with: [
                'name' => $this->userDetail->user->name,
                'detailId' => $this->userDetail->id,
                'className' => $className,
                'date' => $this->userDetail->created_at ? $this->userDetail->created_at->format('M d, Y') : date('M d, Y'),
            ],
        );
    }
}
