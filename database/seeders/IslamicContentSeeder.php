<?php

namespace Database\Seeders;

use App\Models\IslamicContent;
use Illuminate\Database\Seeder;

class IslamicContentSeeder extends Seeder
{
    public function run(): void
    {
        $verses = [
            ['day' => 1,  'arabic' => 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 'en' => 'In the name of Allah, the Most Gracious, the Most Merciful.', 'ur' => 'اللہ کے نام سے جو بڑا مہربان نہایت رحم کرنے والا ہے۔', 'ref' => 'Al-Fatiha 1:1'],
            ['day' => 2,  'arabic' => 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', 'en' => 'And whoever fears Allah – He will make for him a way out.', 'ur' => 'اور جو اللہ سے ڈرے گا، اللہ اس کے لیے نکلنے کی راہ بنا دے گا۔', 'ref' => 'At-Talaq 65:2'],
            ['day' => 3,  'arabic' => 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', 'en' => 'Indeed, with hardship comes ease.', 'ur' => 'بے شک تکلیف کے ساتھ آسانی بھی ہے۔', 'ref' => 'Ash-Sharh 94:6'],
            ['day' => 4,  'arabic' => 'وَقُل رَّبِّ زِدْنِي عِلْمًا', 'en' => 'And say: My Lord, increase me in knowledge.', 'ur' => 'اور کہو: اے میرے رب! مجھے علم میں اضافہ فرما۔', 'ref' => 'Taha 20:114'],
            ['day' => 5,  'arabic' => 'يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ', 'en' => 'Allah will raise those who have believed among you and those who were given knowledge, in degrees.', 'ur' => 'اللہ تم میں سے ایمان والوں کو اور ان لوگوں کو جنہیں علم دیا گیا درجوں میں بلند کرے گا۔', 'ref' => 'Al-Mujadila 58:11'],
            ['day' => 6,  'arabic' => 'وَتَوَكَّلْ عَلَى اللَّهِ ۚ وَكَفَىٰ بِاللَّهِ وَكِيلًا', 'en' => 'And rely upon Allah; and sufficient is Allah as Disposer of affairs.', 'ur' => 'اور اللہ پر بھروسہ کرو، اور اللہ کافی ہے وکیل کے طور پر۔', 'ref' => 'Al-Ahzab 33:3'],
            ['day' => 7,  'arabic' => 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ', 'en' => 'And when My servants ask you concerning Me – indeed I am near.', 'ur' => 'اور جب میرے بندے آپ سے میرے بارے میں پوچھیں تو بے شک میں قریب ہوں۔', 'ref' => 'Al-Baqarah 2:186'],
            ['day' => 8,  'arabic' => 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', 'en' => 'Allah is Sufficient for us, and He is the Best Disposer of affairs.', 'ur' => 'اللہ ہمارے لیے کافی ہے اور وہ بہترین کارساز ہے۔', 'ref' => 'Al-Imran 3:173'],
            ['day' => 9,  'arabic' => 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', 'en' => 'Indeed, Allah is with the patient.', 'ur' => 'بے شک اللہ صبر کرنے والوں کے ساتھ ہے۔', 'ref' => 'Al-Baqarah 2:153'],
            ['day' => 10, 'arabic' => 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ', 'en' => 'And do not despair of relief from Allah.', 'ur' => 'اور اللہ کی رحمت سے نا امید نہ ہو۔', 'ref' => 'Yusuf 12:87'],
        ];

        foreach ($verses as $v) {
            IslamicContent::create([
                'type'           => 'quran_verse',
                'arabic_text'    => $v['arabic'],
                'translation_en' => $v['en'],
                'translation_ur' => $v['ur'],
                'reference'      => $v['ref'],
                'is_active'      => true,
                'display_day'    => $v['day'],
            ]);
        }

        $hadith = [
            ['day' => 1,  'en' => '"The best among you are those who learn the Quran and teach it."', 'ur' => '"تم میں سب سے بہتر وہ ہے جو قرآن سیکھے اور سکھائے۔"', 'source' => 'Sahih Bukhari', 'grade' => 'Sahih'],
            ['day' => 2,  'en' => '"Seeking knowledge is an obligation upon every Muslim."', 'ur' => '"علم حاصل کرنا ہر مسلمان پر فرض ہے۔"', 'source' => 'Ibn Majah', 'grade' => 'Sahih'],
            ['day' => 3,  'en' => '"The world is cursed and what it contains is cursed, except the remembrance of Allah."', 'ur' => '"دنیا لعنتی ہے اور جو کچھ اس میں ہے وہ بھی، سوائے اللہ کے ذکر کے۔"', 'source' => 'Tirmidhi', 'grade' => 'Hasan'],
            ['day' => 4,  'en' => '"Actions are judged by intentions, and every person will get what they intended."', 'ur' => '"اعمال کا دارومدار نیتوں پر ہے اور ہر شخص کو وہی ملے گا جو اس نے نیت کی۔"', 'source' => 'Sahih Bukhari', 'grade' => 'Sahih'],
            ['day' => 5,  'en' => '"None of you truly believes until he loves for his brother what he loves for himself."', 'ur' => '"تم میں سے کوئی مومن نہیں ہو سکتا جب تک وہ اپنے بھائی کے لیے وہی نہ چاہے جو خود کے لیے چاہتا ہے۔"', 'source' => 'Sahih Bukhari', 'grade' => 'Sahih'],
            ['day' => 6,  'en' => '"Make things easy and do not make them difficult, give glad tidings and do not repel people."', 'ur' => '"آسانی کرو اور مشکل نہ ڈالو، خوشخبری دو اور نفرت نہ پھیلاؤ۔"', 'source' => 'Sahih Bukhari', 'grade' => 'Sahih'],
            ['day' => 7,  'en' => '"The strong person is not the one who can wrestle others down; rather, the strong person is the one who controls himself when angry."', 'ur' => '"طاقتور وہ نہیں جو پہلوانی میں غالب آئے، بلکہ طاقتور وہ ہے جو غصے میں خود پر قابو رکھے۔"', 'source' => 'Sahih Bukhari', 'grade' => 'Sahih'],
        ];

        foreach ($hadith as $h) {
            IslamicContent::create([
                'type'           => 'hadith',
                'hadith_text_en' => $h['en'],
                'hadith_text_ur' => $h['ur'],
                'hadith_source'  => $h['source'],
                'hadith_grade'   => $h['grade'],
                'is_active'      => true,
                'display_day'    => $h['day'],
            ]);
        }

        $reminders = [
            ['en' => 'Recite Surah Al-Kahf today — it is Friday!', 'ur' => 'آج سورۃ الکہف پڑھیں، آج جمعہ ہے!'],
            ['en' => 'Don\'t forget your morning Adhkar (Azkar) after Fajr prayer.', 'ur' => 'فجر کے بعد صبح کے اذکار پڑھنا نہ بھولیں۔'],
            ['en' => 'Read at least one page of the Quran today.', 'ur' => 'آج قرآن کا کم از کم ایک صفحہ ضرور پڑھیں۔'],
            ['en' => 'Make dua for your parents today — it is one of the greatest acts of worship.', 'ur' => 'آج اپنے والدین کے لیے دعا کریں، یہ سب سے بڑی عبادتوں میں سے ہے۔'],
            ['en' => 'Say Bismillah before every task and start your studies with the remembrance of Allah.', 'ur' => 'ہر کام سے پہلے بسم اللہ کہیں اور اللہ کی یاد کے ساتھ پڑھائی شروع کریں۔'],
        ];

        foreach ($reminders as $r) {
            IslamicContent::create([
                'type'           => 'reminder',
                'translation_en' => $r['en'],
                'translation_ur' => $r['ur'],
                'is_active'      => true,
            ]);
        }

        $this->command->info('✅ Islamic content seeded: ' . count($verses) . ' verses, ' . count($hadith) . ' hadith, ' . count($reminders) . ' reminders.');
    }
}
