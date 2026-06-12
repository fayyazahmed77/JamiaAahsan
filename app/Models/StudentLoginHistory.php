<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentLoginHistory extends Model
{
    protected $table = 'student_login_history';

    public $timestamps = false;

    protected $fillable = [
        'student_id', 'ip_address', 'user_agent',
        'device_type', 'browser', 'os', 'location',
        'status', 'failed_reason',
        'logged_in_at', 'logged_out_at',
    ];

    protected function casts(): array
    {
        return [
            'logged_in_at'  => 'datetime',
            'logged_out_at' => 'datetime',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
