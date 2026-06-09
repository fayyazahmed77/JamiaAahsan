<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionAnswer extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'question_answers';

    protected $fillable = [
        'topic_id',
        'title',
        'question',
        'answer',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }
}
