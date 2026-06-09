<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'class_id',
        'registration_no',
        'guardian_name',
        'gender',
        'dob',
        'address',
        'id_card_no',
        'qualification',
        'phone',
        'country',
        'admission_type',
        'birth_certificate_path',
        'education_degree_path',
        'is_approved',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function class(): BelongsTo
    {
        return $this->belongsTo(Klass::class, 'class_id');
    }
}
