<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentGuardian extends Model
{
    protected $fillable = [
        'student_id', 'name', 'relation', 'phone', 'email',
        'cnic', 'address', 'occupation', 'is_primary',
        'can_access_portal', 'portal_password', 'portal_last_login',
    ];

    protected $hidden = ['portal_password'];

    protected function casts(): array
    {
        return [
            'is_primary'        => 'boolean',
            'can_access_portal' => 'boolean',
            'portal_last_login' => 'datetime',
            'portal_password'   => 'hashed',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
