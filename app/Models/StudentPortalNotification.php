<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentPortalNotification extends Model
{
    protected $table = 'student_notifications';

    protected $fillable = [
        'student_id', 'title', 'title_ur', 'message', 'message_ur',
        'type', 'related_model', 'related_id', 'action_url',
        'is_read', 'read_at',
    ];

    protected function casts(): array
    {
        return [
            'is_read'  => 'boolean',
            'read_at'  => 'datetime',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function markAsRead(): void
    {
        $this->update(['is_read' => true, 'read_at' => now()]);
    }
}
