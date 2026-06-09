<?php

namespace App\Events;

use App\Models\UserDetail;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AdmissionRejected
{
    use Dispatchable, SerializesModels;

    public $userDetail;
    public $note;

    /**
     * Create a new event instance.
     */
    public function __construct(UserDetail $userDetail, string $note)
    {
        $this->userDetail = $userDetail;
        $this->note = $note;
    }
}
