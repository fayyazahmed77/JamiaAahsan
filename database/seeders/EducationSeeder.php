<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Klass;
use App\Models\Book;
use App\Models\Teacher;
use App\Models\Year;
use App\Models\ClassSession;

class EducationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Classes (Klasses)
        $classes = [
            [
                'name' => 'Dars-e-Nizami (Alim Course)',
                'slug' => 'dars-e-nizami',
                'description' => 'A comprehensive 8-year program covering classical Arabic, Quranic exegesis (Tafseer), Hadith studies, Islamic jurisprudence (Fiqh), and theology.',
                'live_link' => 'https://www.youtube.com/embed/live_dars_nizami',
                'youtube_live_link' => 'https://www.youtube.com/live/dars_nizami',
                'sort' => 1,
                'status' => 1,
            ],
            [
                'name' => 'Hifz-ul-Quran (Memorization)',
                'slug' => 'hifz-ul-quran',
                'description' => 'Dedicated memorization of the entire Holy Quran under expert guidance with strict adherence to Tajweed rules and daily revision cycles.',
                'live_link' => 'https://www.youtube.com/embed/live_hifz',
                'youtube_live_link' => 'https://www.youtube.com/live/hifz',
                'sort' => 2,
                'status' => 1,
            ],
            [
                'name' => 'Nazira & Tajweed Course',
                'slug' => 'nazira-tajweed',
                'description' => 'Foundational recitation course focusing on reading the Quranic script correctly, mastering articulation points (Makharij), and basic rules of Tajweed.',
                'live_link' => 'https://www.youtube.com/embed/live_nazira',
                'youtube_live_link' => 'https://www.youtube.com/live/nazira',
                'sort' => 3,
                'status' => 1,
            ],
            [
                'name' => 'Tafseer-ul-Quran (Exegesis)',
                'slug' => 'tafseer-ul-quran',
                'description' => 'A structured study of the meaning, historical context, and modern applications of the Quranic verses, tailored for general audience and advanced learners.',
                'live_link' => 'https://www.youtube.com/embed/live_tafseer',
                'youtube_live_link' => 'https://www.youtube.com/live/tafseer',
                'sort' => 4,
                'status' => 1,
            ]
        ];

        foreach ($classes as $classData) {
            Klass::updateOrCreate(
                ['slug' => $classData['slug']],
                $classData
            );
        }

        // 2. Seed Books
        $books = [
            ['name' => 'Sahih al-Bukhari', 'urdu_name' => 'صحیح البخاری', 'status' => 1],
            ['name' => 'Sahih Muslim', 'urdu_name' => 'صحیح مسلم', 'status' => 1],
            ['name' => 'Al-Hidayah (Fiqh)', 'urdu_name' => 'الہدایہ (فقہ)', 'status' => 1],
            ['name' => 'Riyad as-Salihin', 'urdu_name' => 'ریاض الصالحین', 'status' => 1],
            ['name' => 'Noorani Qaida', 'urdu_name' => 'نورانی قاعدہ', 'status' => 1],
            ['name' => 'Jalalayn (Tafseer)', 'urdu_name' => 'تفسیر جلالین', 'status' => 1]
        ];

        foreach ($books as $bookData) {
            Book::updateOrCreate(
                ['name' => $bookData['name']],
                $bookData
            );
        }

        // Get created resources for sessions seeding
        $darsKlass = Klass::where('slug', 'dars-e-nizami')->first();
        $hifzKlass = Klass::where('slug', 'hifz-ul-quran')->first();
        $naziraKlass = Klass::where('slug', 'nazira-tajweed')->first();
        $tafseerKlass = Klass::where('slug', 'tafseer-ul-quran')->first();

        $bukhari = Book::where('name', 'Sahih al-Bukhari')->first();
        $muslim = Book::where('name', 'Sahih Muslim')->first();
        $hidayah = Book::where('name', 'Al-Hidayah (Fiqh)')->first();
        $riyad = Book::where('name', 'Riyad as-Salihin')->first();
        $qaida = Book::where('name', 'Noorani Qaida')->first();
        $jalalayn = Book::where('name', 'Jalalayn (Tafseer)')->first();

        $year = Year::first() ?? Year::create(['name' => 2026, 'status' => 1]);

        // 3. Seed Class Sessions (link class, book, teacher, year)
        // Teachers:
        // 1: Mufti Ahsan Sahib
        // 2: Dr. Abdullah Khan
        // 3: Maulana Bilal
        // 4: Maulana Abdul Rahman
        // 5: Mufti Muhammad Tariq
        // 6: Maulana Sajid Ali
        // 7: Qari Muhammad Rizwan

        $sessions = [
            // Dars-e-Nizami Sessions
            [
                'class_id' => $darsKlass->id,
                'teacher_id' => 1, // Mufti Ahsan
                'book_id' => $bukhari->id,
                'year_id' => $year->id,
                'lecture_link' => 'https://www.youtube.com/playlist?list=bukhari_playlist',
                'status' => 1
            ],
            [
                'class_id' => $darsKlass->id,
                'teacher_id' => 5, // Mufti Muhammad Tariq
                'book_id' => $hidayah->id,
                'year_id' => $year->id,
                'lecture_link' => 'https://www.youtube.com/playlist?list=hidayah_playlist',
                'status' => 1
            ],
            // Hifz Sessions
            [
                'class_id' => $hifzKlass->id,
                'teacher_id' => 7, // Qari Muhammad Rizwan
                'book_id' => $riyad->id, // reading moral book alongside memorization
                'year_id' => $year->id,
                'lecture_link' => null,
                'status' => 1
            ],
            // Nazira Sessions
            [
                'class_id' => $naziraKlass->id,
                'teacher_id' => 7, // Qari Muhammad Rizwan
                'book_id' => $qaida->id,
                'year_id' => $year->id,
                'lecture_link' => null,
                'status' => 1
            ],
            // Tafseer Sessions
            [
                'class_id' => $tafseerKlass->id,
                'teacher_id' => 2, // Dr. Abdullah Khan
                'book_id' => $jalalayn->id,
                'year_id' => $year->id,
                'lecture_link' => 'https://www.youtube.com/playlist?list=tafseer_playlist',
                'status' => 1
            ]
        ];

        foreach ($sessions as $sessionData) {
            ClassSession::firstOrCreate(
                [
                    'class_id' => $sessionData['class_id'],
                    'teacher_id' => $sessionData['teacher_id'],
                    'book_id' => $sessionData['book_id'],
                    'year_id' => $sessionData['year_id'],
                ],
                $sessionData
            );
        }
    }
}
