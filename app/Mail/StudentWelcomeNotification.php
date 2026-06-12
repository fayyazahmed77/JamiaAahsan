<?php

namespace App\Mail;

use App\Models\Student;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StudentWelcomeNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $student;
    public $password;

    /**
     * Create a new message instance.
     */
    public function __construct(Student $student, string $password)
    {
        $this->student = $student;
        $this->password = $password;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to the Jamia Arabia Ahsan Ul Uloom Student Portal',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.student_welcome',
            with: [
                'name' => $this->student->name,
                'studentId' => $this->student->student_id_number,
                'email' => $this->student->email,
                'password' => $this->password,
            ],
        );
    }
}
