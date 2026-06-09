<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentSetting extends Model
{
    protected $table = 'student_settings';

    protected $fillable = [
        'student_id', 'language', 'theme',
        'notify_assignment', 'notify_exam', 'notify_result',
        'notify_attendance', 'notify_notice', 'notify_hifz',
        'notify_support', 'notify_certificate', 'notify_teacher',
        'two_factor_enabled', 'two_factor_secret', 'login_notifications',
    ];

    protected function casts(): array
    {
        return [
            'notify_assignment'   => 'boolean',
            'notify_exam'         => 'boolean',
            'notify_result'       => 'boolean',
            'notify_attendance'   => 'boolean',
            'notify_notice'       => 'boolean',
            'notify_hifz'         => 'boolean',
            'notify_support'      => 'boolean',
            'notify_certificate'  => 'boolean',
            'notify_teacher'      => 'boolean',
            'two_factor_enabled'  => 'boolean',
            'login_notifications' => 'boolean',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
