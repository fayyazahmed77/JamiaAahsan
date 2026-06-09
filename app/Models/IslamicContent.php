<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IslamicContent extends Model
{
    protected $table = 'islamic_content';

    protected $fillable = [
        'type',
        'arabic_text', 'translation_en', 'translation_ur', 'reference',
        'hadith_text_en', 'hadith_text_ur', 'hadith_source', 'hadith_grade',
        'is_active', 'display_day',
    ];

    protected function casts(): array
    {
        return [
            'is_active'   => 'boolean',
            'display_day' => 'integer',
        ];
    }

    /**
     * Get today's Quran verse (rotates by day of year).
     */
    public static function todayVerse(): ?self
    {
        $dayOfYear = (int) now()->format('z') + 1; // 1-365
        return self::where('type', 'quran_verse')
            ->where('is_active', true)
            ->where('display_day', $dayOfYear)
            ->first()
            ?? self::where('type', 'quran_verse')->where('is_active', true)->inRandomOrder()->first();
    }

    /**
     * Get today's Hadith (rotates by day of year).
     */
    public static function todayHadith(): ?self
    {
        $dayOfYear = (int) now()->format('z') + 1;
        return self::where('type', 'hadith')
            ->where('is_active', true)
            ->where('display_day', $dayOfYear)
            ->first()
            ?? self::where('type', 'hadith')->where('is_active', true)->inRandomOrder()->first();
    }

    /**
     * Get today's Islamic reminder (contextual: Friday/Ramadan/general).
     */
    public static function todayReminder(): ?self
    {
        return self::where('type', 'reminder')
            ->where('is_active', true)
            ->inRandomOrder()
            ->first();
    }
}
