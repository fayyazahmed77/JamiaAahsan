<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AboutPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Departments
        $departments = [
            [
                'slug' => 'dars-e-nizami',
                'name' => 'Dars-e-Nizami',
                'name_urdu' => 'درسِ نظامی (عالم کورس)',
                'description' => 'An intensive 8-year classical curriculum covering Arabic grammar, Logic, Fiqh, Usul, Tafsir, and Hadith.',
                'description_urdu' => 'ایک جامع ۸ سالہ نصاب جس میں عربی گرامر، منطق، فقہ، اصول، تفسیر اور علمِ حدیث کی تدریس کی جاتی ہے۔',
                'icon_name' => 'BookOpen',
                'sort_order' => 1,
                'status' => true,
            ],
            [
                'slug' => 'hifz-tajweed',
                'name' => 'Hifz & Tajweed',
                'name_urdu' => 'حفظ و تجوید',
                'description' => 'Structured Quran memorization with strict rules of pronunciation, certified by qualified Sanad-holding teachers.',
                'description_urdu' => 'تجوید کے قواعد کے مطابق قرآن پاک کے حفظ کی باقاعدہ تدریس جو کہ مستند اساتذہ کی زیرِ نگرانی کی جاتی ہے۔',
                'icon_name' => 'Mic',
                'sort_order' => 2,
                'status' => true,
            ],
            [
                'slug' => 'tajweed-qiraat',
                'name' => "Tajweed & Qira'at",
                'name_urdu' => 'تجوید و قراءت',
                'description' => 'Specialized courses focusing on phonetics, articulation points, and beautiful recitation styles.',
                'description_urdu' => 'مخارج، قواعدِ تجوید اور خوبصورت قرائت کے ساتھ قرآن کی تلاوت کی خصوصی مہارت۔',
                'icon_name' => 'Volume2',
                'sort_order' => 3,
                'status' => true,
            ],
            [
                'slug' => 'fatwa-department',
                'name' => 'Fatwa Department',
                'name_urdu' => 'دارالافتاء',
                'description' => 'Providing authentic research-backed answers to contemporary theological and legal inquiries.',
                'description_urdu' => 'جدید فقہی مسائل اور دینی سوالات کے مستند اور تحقیق پر مبنی جوابات کی فراہمی۔',
                'icon_name' => 'FileText',
                'sort_order' => 4,
                'status' => true,
            ],
            [
                'slug' => 'research-translation',
                'name' => 'Research & Translation',
                'name_urdu' => 'تحقیق و ترجمہ',
                'description' => 'Translating classical manuscripts and publishing academic journals to address modern challenges.',
                'description_urdu' => 'قدیم علمی مسودات کے تراجم اور جدید دور کے علمی چیلنجز پر تحقیقی مقالاجات کی اشاعت۔',
                'icon_name' => 'Search',
                'sort_order' => 5,
                'status' => true,
            ],
            [
                'slug' => 'media-production',
                'name' => 'Media & Production',
                'name_urdu' => 'شعبہ نشر و اشاعت',
                'description' => 'Broadcasting and documenting high-quality audio and video lectures to dynamic global audiences.',
                'description_urdu' => 'عالمی سامعین کے لیے اعلیٰ معیار کے آڈیو اور ویڈیو لیکچرز کی نشریات اور ریکارڈنگز کی تیاری۔',
                'icon_name' => 'Video',
                'sort_order' => 6,
                'status' => true,
            ],
        ];

        foreach ($departments as $dept) {
            \App\Models\Department::updateOrCreate(['slug' => $dept['slug']], $dept);
        }

        // 2. Seed Teachers / Scholars
        $teachers = [
            // Leadership
            [
                'name' => 'Mufti Ahsan Sahib',
                'urdu_name' => 'مفتی احسان صاحب',
                'is_leadership' => true,
                'designation' => 'Founder & Patron-in-Chief',
                'designation_urdu' => 'بانی و سرپرستِ اعلیٰ',
                'bio' => 'Mufti Ahsan Sahib has over 40 years of experience teaching classical Hadith. He established Jamia Ahsan in 1998 with the vision of preserving theological chains of learning.',
                'bio_urdu' => 'مفتی احسان صاحب ۴۰ سے زائد سالوں سے علمِ حدیث کی تدریس فرما رہے ہیں۔ انہوں نے ۱۹۹۸ میں روایتی اور مستند دینی علوم کے تسلسل کے خواب کو عملی جامہ پہنانے کے لیے جامعہ احسن کی بنیاد رکھی۔',
                'photo_uri' => '/placeholders/scholar_founder.jpg',
                'sort_order' => 1,
                'status' => true,
            ],
            [
                'name' => 'Dr. Abdullah Khan',
                'urdu_name' => 'ڈاکٹر عبداللہ خان',
                'is_leadership' => true,
                'designation' => 'Principal & Chancellor',
                'designation_urdu' => 'مہتمم و چانسلر',
                'bio' => 'A graduate of Al-Azhar University, Cairo. Dr. Abdullah has been instrumental in integrating modern educational structures and online learning portals at Jamia Ahsan.',
                'bio_urdu' => 'جامعہ الازہر، قاہرہ کے فاضل۔ ڈاکٹر عبداللہ جامعہ احسن میں جدید تعلیمی نظم و ضبط اور آن لائن تدریسی پروگراموں کے نفاذ کے لیے بنیادی کردار ادا کر رہے ہیں۔',
                'photo_uri' => '/placeholders/scholar_principal.jpg',
                'sort_order' => 2,
                'status' => true,
            ],
            [
                'name' => 'Maulana Bilal',
                'urdu_name' => 'مولانا بلال',
                'is_leadership' => true,
                'designation' => 'Head of Dars-e-Nizami Faculty',
                'designation_urdu' => 'صدر مدرس (شعبہ درسِ نظامی)',
                'bio' => 'Renowned scholar of Hanafi jurisprudence and Arabic grammar, with over 15 publications addressing modern financial rulings under Islamic law.',
                'bio_urdu' => 'حنفی فقہ اور عربی صرف و نحو کے نامور استاد، جن کے اسلامی معاشیات اور جدید مالیاتی مسائل پرِ ۱۵ سے زائد تحقیقی مقالاجات شائع ہو چکے ہیں۔',
                'photo_uri' => '/placeholders/scholar_hadith.jpg',
                'sort_order' => 3,
                'status' => true,
            ],
            // General Faculty
            [
                'name' => 'Maulana Abdul Rahman',
                'urdu_name' => 'مولانا عبد الرحمن',
                'is_leadership' => false,
                'designation' => 'Senior Lecturer (Fiqh & Usul)',
                'designation_urdu' => 'استادِ فقہ و اصول',
                'bio' => 'Teaching advanced books of Hanafi jurisprudence and legal theory for over 12 years.',
                'bio_urdu' => 'گزشتہ ۱۲ سالوں سے حنفی فقہ اور اصولِ فقہ کی تدریس فرما رہے ہیں۔',
                'photo_uri' => '/placeholders/scholar_faculty_1.jpg',
                'sort_order' => 10,
                'status' => true,
            ],
            [
                'name' => 'Mufti Muhammad Tariq',
                'urdu_name' => 'مفتی محمد طارق',
                'is_leadership' => false,
                'designation' => 'Mufti (Fatwa Department)',
                'designation_urdu' => 'مفتی (دارالافتاء)',
                'bio' => 'Researcher in Islamic banking and resolving personal status laws.',
                'bio_urdu' => 'اسلامی بینکاری اور عائلی قوانین کے خصوصی محقق۔',
                'photo_uri' => '/placeholders/scholar_faculty_2.jpg',
                'sort_order' => 11,
                'status' => true,
            ],
            [
                'name' => 'Maulana Sajid Ali',
                'urdu_name' => 'مولانا ساجد علی',
                'is_leadership' => false,
                'designation' => 'Hadith Instructor',
                'designation_urdu' => 'استادِ حدیث',
                'bio' => 'Teaches Sahih al-Bukhari and Sunan al-Tirmidhi in the final years of Dars-e-Nizami.',
                'bio_urdu' => 'درسِ نظامی کے آخری سالوں میں صحیح البخاری اور سنن الترمذی کا درس دیتے ہیں۔',
                'photo_uri' => '/placeholders/scholar_faculty_3.jpg',
                'sort_order' => 12,
                'status' => true,
            ],
            [
                'name' => 'Qari Muhammad Rizwan',
                'urdu_name' => 'قاری محمد رضوان',
                'is_leadership' => false,
                'designation' => 'Chief Reciter (Tajweed & Hifz)',
                'designation_urdu' => 'نگران شعبہ تجوید و حفظ',
                'bio' => 'Holds global recitation certifications (Ijazah) in multiple Qira\'at styles.',
                'bio_urdu' => 'مختلف قرائتوں میں عالمی اسناد کے حامل ماہرِ تجوید۔',
                'photo_uri' => '/placeholders/scholar_faculty_4.jpg',
                'sort_order' => 13,
                'status' => true,
            ],
        ];

        foreach ($teachers as $teacher) {
            \App\Models\Teacher::updateOrCreate(
                ['name' => $teacher['name']],
                $teacher
            );
        }
    }
}
