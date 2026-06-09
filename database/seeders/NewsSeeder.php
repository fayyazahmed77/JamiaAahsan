<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LatestNews;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $newsItems = [
            [
                'text' => 'Admissions Open for Academic Session 2026',
                'excerpt' => 'Online admissions for the upcoming academic session are now open. Apply online before June 20, 2026.',
                'content' => "We are pleased to announce that admissions for the academic year 2026 are now open across all departments of Jamia Ahsan. This includes our flagship 8-year Dars-e-Nizami (Alim Course), Hifz-ul-Quran, and specialized Tajweed courses. \n\nApplicants can fill out the multi-step admission application form online and upload scanned copies of their documents. The last date to submit applications is June 20, 2026. Entry tests and interviews will be conducted from June 22 to June 25, 2026.",
                'image_uri' => null,
                'link' => '/admissions',
                'status' => true
            ],
            [
                'text' => 'Annual Quran Recitation Competition 2026',
                'excerpt' => 'Jamia Ahsan is hosting the Annual Tajweed & Hifz Competition on June 15, 2526. Registrations are open for students.',
                'content' => "The annual Husn-e-Qira'at (Beautiful Quran Recitation) and Hifz competition will take place at the main auditorium of Jamia Ahsan on June 15, 2026. Students from various madrasas and schools across the city will participate. \n\nDistinguished scholars and Qaris will judge the event. Cash prizes, certificates, and shields will be awarded to the top position holders in each category. The event will also be live-streamed on our YouTube channel.",
                'image_uri' => null,
                'link' => '/media/live',
                'status' => true
            ],
            [
                'text' => 'New Islamic Research Section Added to Library',
                'excerpt' => 'Over 500 new classical and contemporary Arabic and Hadith reference research books added to the Jamia library.',
                'content' => "To support advanced academic research, the library administration at Jamia Ahsan has added over 500 new titles to our Islamic Studies and Hadith departments. \n\nThe new additions include rare editions of Hadith commentaries, classical Fiqh manuals, and modern academic journals. The library is open for students and researchers from 8:00 AM to 4:00 PM, Monday through Saturday.",
                'image_uri' => null,
                'link' => '/downloads',
                'status' => true
            ]
        ];

        foreach ($newsItems as $news) {
            LatestNews::create($news);
        }
    }
}
