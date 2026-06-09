<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Year;
use App\Models\DownloadLink;

class DownloadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Download Categories
        $categories = [
            ['name' => 'Textbooks', 'type' => 'download', 'slug' => 'textbooks', 'status' => 1],
            ['name' => 'Syllabus & Curriculum', 'type' => 'download', 'slug' => 'syllabus', 'status' => 1],
            ['name' => 'Academic Calendar', 'type' => 'download', 'slug' => 'calendar', 'status' => 1],
            ['name' => 'Monthly Magazine', 'type' => 'download', 'slug' => 'magazine', 'status' => 1],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        // 2. Get year and categories
        $year = Year::first() ?? Year::create(['name' => 2026, 'status' => 1]);
        $textbooksCat = Category::where('slug', 'textbooks')->first();
        $syllabusCat = Category::where('slug', 'syllabus')->first();
        $calendarCat = Category::where('slug', 'calendar')->first();
        $magazineCat = Category::where('slug', 'magazine')->first();

        // 3. Seed Download Links
        $links = [
            [
                'title' => 'Noorani Qaida with Tajweed rules',
                'description' => 'Standard beginner recitation handbook with tajweed rules.',
                'category_id' => $textbooksCat->id,
                'year_id' => $year->id,
                'url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // dummy pdf URL for test
                'file_size' => '1.5 MB',
                'status' => 1,
                'sort_order' => 1
            ],
            [
                'title' => 'Dars-e-Nizami Curriculum Details',
                'description' => 'Complete curriculum and book list for all 8 academic years of the Alim course.',
                'category_id' => $syllabusCat->id,
                'year_id' => $year->id,
                'url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                'file_size' => '850 KB',
                'status' => 1,
                'sort_order' => 2
            ],
            [
                'title' => 'Jamia Ahsan Academic Calendar 2026',
                'description' => 'Schedule of examinations, holidays, and admission cycles for the academic session 2026.',
                'category_id' => $calendarCat->id,
                'year_id' => $year->id,
                'url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                'file_size' => '1.2 MB',
                'status' => 1,
                'sort_order' => 3
            ],
            [
                'title' => 'Monthly Al-Ahsan Magazine - Jan 2026',
                'description' => 'Monthly publication featuring articles from our scholars on core theological concepts.',
                'category_id' => $magazineCat->id,
                'year_id' => $year->id,
                'url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                'file_size' => '4.2 MB',
                'status' => 1,
                'sort_order' => 4
            ]
        ];

        foreach ($links as $link) {
            DownloadLink::updateOrCreate(['title' => $link['title']], $link);
        }
    }
}
