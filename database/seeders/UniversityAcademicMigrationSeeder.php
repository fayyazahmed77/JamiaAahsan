<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\Semester;
use App\Models\Course;
use App\Models\Book;
use App\Models\Student;
use App\Models\StudentSemester;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UniversityAcademicMigrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();

        try {
            // ── 1. Migrate Departments to Programs ─────────────────────────────
            $this->command->info('1. Migrating Departments to Programs...');
            $departments = DB::table('departments')->get();
            
            foreach ($departments as $dept) {
                $existingProgram = Program::find($dept->id);
                $programData = [
                    'name' => $dept->name,
                    'name_ur' => $dept->name_urdu,
                    'slug' => $dept->slug,
                    'type' => $this->inferProgramType($dept->slug),
                    'duration_years' => 8,
                    'total_semesters' => 16,
                    'description' => $dept->description,
                    'description_ur' => $dept->description_urdu,
                    'is_active' => $dept->status,
                    'sort_order' => $dept->sort_order,
                ];

                if ($existingProgram) {
                    $existingProgram->update($programData);
                } else {
                    Program::create(array_merge(['id' => $dept->id], $programData));
                }
            }

            // Fallback program if Dars-e-Nizami is not present
            $darseNizami = Program::where('slug', 'dars-e-nizami')->first();
            if (!$darseNizami) {
                $darseNizami = Program::firstOrCreate(
                    ['slug' => 'dars-e-nizami'],
                    [
                        'name' => 'Dars-e-Nizami',
                        'name_ur' => 'درسِ نظامی',
                        'type' => 'dars_nizami',
                        'duration_years' => 8,
                        'total_semesters' => 16,
                        'is_active' => true,
                    ]
                );
            }

            // ── 2. Create Semesters for all Programs ──────────────────────────
            $this->command->info('2. Generating Semesters for Programs...');
            foreach (Program::all() as $program) {
                for ($i = 1; $i <= $program->total_semesters; $i++) {
                    Semester::firstOrCreate(
                        ['code' => strtoupper($program->slug) . '-SEM' . $i],
                        [
                            'program_id' => $program->id,
                            'name' => 'Semester ' . $i,
                            'start_date' => now()->startOfYear()->addMonths(($i - 1) * 6)->format('Y-m-d'),
                            'end_date' => now()->startOfYear()->addMonths($i * 6)->subDay()->format('Y-m-d'),
                            'duration_months' => 6,
                            'status' => $i === 1 ? 'active' : 'inactive',
                            'academic_year' => date('Y'),
                        ]
                    );
                }
            }

            // ── 3. Map Legacy Classes to Semesters ────────────────────────────
            $this->command->info('3. Mapping Legacy Classes to new Semesters...');
            $classes = DB::table('classes')->get();
            $semesterMapping = []; // class_id => semester_id
            
            foreach ($classes as $class) {
                $semesterNum = 1;
                $name = strtolower($class->name);
                
                // Smart regex / keyword analysis for semester matching
                if (str_contains($name, '1st') || str_contains($name, 'اول')) $semesterNum = 1;
                elseif (str_contains($name, '2nd') || str_contains($name, 'دوم')) $semesterNum = 3;
                elseif (str_contains($name, '3rd') || str_contains($name, 'سوم')) $semesterNum = 5;
                elseif (str_contains($name, '4th') || str_contains($name, 'چہارم')) $semesterNum = 7;
                elseif (str_contains($name, '5th') || str_contains($name, 'پنجم')) $semesterNum = 9;
                elseif (str_contains($name, '6th') || str_contains($name, 'ششم')) $semesterNum = 11;
                elseif (str_contains($name, '7th') || str_contains($name, 'ہفتم')) $semesterNum = 13;
                elseif (str_contains($name, '8th') || str_contains($name, 'ہشتم')) $semesterNum = 15;

                // Attempt to match semester for Dars-e-Nizami
                $semester = Semester::where('program_id', $darseNizami->id)
                    ->where('name', 'Semester ' . $semesterNum)
                    ->first();
                
                if ($semester) {
                    $semesterMapping[$class->id] = $semester->id;
                }
            }

            // ── 4. Migrate Legacy Class Sessions (Book + Teacher + Class) to Courses ───
            $this->command->info('4. Porting Class Sessions to Course Catalog offerings...');
            $classSessions = DB::table('class_sessions')->get();
            
            foreach ($classSessions as $session) {
                $semesterId = $semesterMapping[$session->class_id] ?? null;
                if (!$semesterId) {
                    $semesterId = Semester::where('program_id', $darseNizami->id)->first()?->id;
                }
                
                $book = Book::find($session->book_id);
                if (!$book) continue;

                // Check if a course with similar code exists, or create new course
                $courseCode = 'CRS-' . strtoupper(Str::slug($book->name)) . '-' . $session->id;
                
                $course = Course::firstOrCreate(
                    ['code' => $courseCode],
                    [
                        'program_id' => $darseNizami->id,
                        'semester_id' => $semesterId,
                        'name' => $book->name,
                        'name_ur' => $book->urdu_name,
                        'credit_hours' => 3, // Standard default
                        'teacher_id' => $session->teacher_id,
                        'is_active' => $session->status,
                    ]
                );

                // Pivot linkage to Book entity
                if (!$course->books()->where('book_id', $book->id)->exists()) {
                    $course->books()->attach($book->id);
                }
            }

            // ── 5. Migrate Students to new Semester Enrollment Structure ─────
            $this->command->info('5. Migrating Students and mapping enrollments...');
            $students = Student::all();
            
            foreach ($students as $student) {
                // If student has a class_id, map them to that semester
                $semesterId = $semesterMapping[$student->class_id] ?? null;
                if (!$semesterId) {
                    // Fallback to Semester 1 of Dars-e-Nizami or student's program
                    $programId = $student->program_id ?? $darseNizami->id;
                    $semesterId = Semester::where('program_id', $programId)->first()?->id;
                }
                
                $student->update([
                    'current_semester_id' => $semesterId,
                    'program_id' => $student->program_id ?? $darseNizami->id,
                ]);

                // Record historical/active semester registration
                if ($semesterId) {
                    StudentSemester::firstOrCreate(
                        [
                            'student_id' => $student->id,
                            'semester_id' => $semesterId,
                        ],
                        [
                            'status' => 'enrolled',
                        ]
                    );
                }
            }

            DB::commit();
            $this->command->info('✅ University Academic Structure migration seeder executed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('❌ Data migration failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Infer the program type enum based on department slug.
     */
    private function inferProgramType(string $slug): string
    {
        $slug = strtolower($slug);
        if (str_contains($slug, 'hifz')) return 'hifz';
        if (str_contains($slug, 'tajweed')) return 'tajweed';
        if (str_contains($slug, 'ifta')) return 'ifta';
        if (str_contains($slug, 'arabic')) return 'arabic';
        return 'dars_nizami';
    }
}
