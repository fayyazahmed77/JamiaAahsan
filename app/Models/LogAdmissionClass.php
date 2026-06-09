<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LogAdmissionClass extends Model
{
    use HasFactory;

    protected $table = 'log_admission_classes';

    protected $fillable = [
        'student_id',
        'user_id',
        'class_id',
        'note',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function class(): BelongsTo
    {
        return $this->belongsTo(Klass::class, 'class_id');
    }
}
