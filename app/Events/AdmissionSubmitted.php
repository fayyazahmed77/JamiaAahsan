<?php

namespace App\Events;

use App\Models\UserDetail;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AdmissionSubmitted
{
    use Dispatchable, SerializesModels;

    public $userDetail;

    /**
     * Create a new event instance.
     */
    public function __construct(UserDetail $userDetail)
    {
        $this->userDetail = $userDetail;
    }
}
