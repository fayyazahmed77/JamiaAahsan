<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class CMSSettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaultSettings = [
            'site_name' => 'Jamia Arabia Ahsan Ul Uloom',
            'site_name_urdu' => 'جامعہ عربیہ احسن العلوم',
            'contact_email' => 'info@jamiaahsan.edu.pk',
            'contact_phone' => '+92-21-34981234',
            'contact_address' => 'Gulshan-e-Iqbal, Block 2, Karachi, Pakistan',
            'social_facebook' => 'https://facebook.com/jamiaahsan',
            'social_youtube' => 'https://youtube.com/jamiaahsan',
            'social_twitter' => 'https://twitter.com/jamiaahsan',
            'seo_title' => 'Jamia Arabia Ahsan Ul Uloom - Islamic Institution',
            'seo_description' => 'Official platform for Jamia Arabia Ahsan Ul Uloom. Access Audios, Videos, Fatwas and Student Academic Portal.',
            'seo_keywords' => 'islam, jamia, lectures, bayanaat, karachi, fatwa',
            'hero_tagline_en' => 'Preserving Sacred Knowledge & Cultivating Spiritual Leaders',
            'hero_tagline_ur' => 'حصولِ علمِ دین اور تزکیۂ نفوس کا معتمد مرکز',
            'announcement_ticker_en' => '🕌 Admissions Open — Dars-e-Nizami 2026 ✦ Upcoming Event: Annual Ijtema — 15 Muharram 1446 ✦',
            'announcement_ticker_ur' => '🕌 داخلے جاری ہیں — درسِ نظامی تعلیمی سال 2026 ✦ سالانہ اجتماع — 15 محرم الحرام 1446 ✦'
        ];

        foreach ($defaultSettings as $key => $value) {
            Setting::firstOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
