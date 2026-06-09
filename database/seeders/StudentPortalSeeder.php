<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\Batch;
use App\Models\Student;
use App\Models\StudentProfile;
use App\Models\StudentGuardian;
use App\Models\StudentSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentPortalSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Programs ──────────────────────────────────────────────────
        $darseNizami = Program::create([
            'name'            => 'Dars-e-Nizami',
            'name_ur'         => 'درسِ نظامی',
            'slug'            => 'dars-e-nizami',
            'type'            => 'dars_nizami',
            'duration_years'  => 8,
            'total_semesters' => 16,
            'description'     => 'Traditional Islamic education covering Quran, Hadith, Fiqh, Arabic, Logic and more.',
            'description_ur'  => 'روایتی اسلامی تعلیم جس میں قرآن، حدیث، فقہ، عربی، منطق وغیرہ شامل ہیں۔',
            'is_active'       => true,
            'sort_order'      => 1,
        ]);

        $hifz = Program::create([
            'name'            => 'Hifz ul Quran',
            'name_ur'         => 'حفظ القرآن',
            'slug'            => 'hifz-ul-quran',
            'type'            => 'hifz',
            'duration_years'  => 3,
            'total_semesters' => 6,
            'description'     => 'Quran memorization program.',
            'description_ur'  => 'قرآن حفظ کرنے کا پروگرام۔',
            'is_active'       => true,
            'sort_order'      => 2,
        ]);

        // ── 2. Batches ───────────────────────────────────────────────────
        $batch2024 = Batch::create([
            'program_id'  => $darseNizami->id,
            'name'        => 'Batch 2024',
            'name_ur'     => 'بیچ 2024',
            'start_date'  => '2024-01-15',
            'end_date'    => '2032-06-30',
            'max_students'=> 50,
            'is_active'   => true,
        ]);

        // ── 3. Test Student ──────────────────────────────────────────────
        $student = Student::create([
            'student_id_number' => 'JA-2024-001',
            'program_id'        => $darseNizami->id,
            'batch_id'          => $batch2024->id,
            'name'              => 'Ahmed Abdullah',
            'email'             => 'student@jamia.com',
            'password'          => Hash::make('Student123'),
            'phone'             => '0300-1234567',
            'date_of_birth'     => '2005-03-15',
            'gender'            => 'male',
            'current_year'      => 2,
            'current_semester'  => 3,
            'student_type'      => 'onsite',
            'status'            => 'active',
            'enrollment_date'   => '2024-01-15',
            'email_verified_at' => now(),
        ]);

        // ── 4. Student Profile ───────────────────────────────────────────
        StudentProfile::create([
            'student_id'                 => $student->id,
            'father_name'                => 'Abdullah Khan',
            'mother_name'                => 'Fatima Bibi',
            'nationality'                => 'Pakistani',
            'mother_tongue'              => 'Urdu',
            'national_id'               => '61101-1234567-1',
            'address'                   => 'House 45, Street 3, Gulshan Iqbal',
            'city'                      => 'Karachi',
            'province'                  => 'Sindh',
            'country'                   => 'Pakistan',
            'previous_madrasa'          => 'Jamia Farooqia',
            'previous_qualification'    => 'Hifz ul Quran',
            'hifz_status'               => 'hafiz',
            'maslak'                    => 'Deobandi',
            'specialization_interests'  => ['dars_nizami', 'ifta'],
            'emergency_contact_name'    => 'Abdullah Khan',
            'emergency_contact_phone'   => '0321-9876543',
            'emergency_contact_relation'=> 'Father',
        ]);

        // ── 5. Guardian ──────────────────────────────────────────────────
        StudentGuardian::create([
            'student_id' => $student->id,
            'name'       => 'Abdullah Khan',
            'relation'   => 'father',
            'phone'      => '0321-9876543',
            'email'      => 'father@example.com',
            'cnic'       => '61101-9876543-1',
            'address'    => 'House 45, Street 3, Gulshan Iqbal, Karachi',
            'occupation' => 'Businessman',
            'is_primary' => true,
        ]);

        // ── 6. Settings ──────────────────────────────────────────────────
        StudentSetting::create([
            'student_id' => $student->id,
            'language'   => 'en',
            'theme'      => 'system',
        ]);

        $this->command->info('✅ Student portal seeded!');
        $this->command->info('   Test Student — Email: student@jamia.com | Password: Student123');
        $this->command->info('   Student ID: JA-2024-001 | Program: Dars-e-Nizami | Year 2');
    }
}
