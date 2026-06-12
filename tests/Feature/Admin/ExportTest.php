<?php

namespace Tests\Feature\Admin;

use App\Models\Course;
use App\Models\Student;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\HifzEnrollment;
use App\Models\UserDetail;
use App\Models\User;
use Database\Seeders\RolePermissionMigrationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExportTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $student;
    protected $course;
    protected $assignment;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionMigrationSeeder::class);

        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole('Super Admin');

        // Create a program
        $program = \App\Models\Program::create([
            'name' => 'Alim Course',
            'slug' => 'alim-course',
            'duration_years' => 4,
            'total_semesters' => 8,
            'is_active' => true,
        ]);

        // Create a student and profile
        $this->student = Student::create([
            'student_id_number' => 'S12345',
            'program_id' => $program->id,
            'name' => 'Test Student',
            'urdu_name' => 'ٹیسٹ طالب علم',
            'email' => 'student@test.com',
            'password' => bcrypt('password'),
            'phone' => '03001234567',
            'gender' => 'male',
            'student_type' => 'onsite',
            'current_year' => 1,
            'current_semester' => 1,
            'status' => 'active',
        ]);

        // Create a class
        $klass = \App\Models\Klass::create(['name' => 'Class A', 'slug' => 'class-a', 'status' => true]);

        // Create a user detail (admission)
        $user = User::factory()->create(['name' => 'Applicant User']);
        UserDetail::create([
            'user_id' => $user->id,
            'class_id' => $klass->id,
            'phone' => '03123456789',
            'guardian_name' => 'Guardian Name',
            'gender' => 'male',
            'address' => 'Test Address',
            'id_card_no' => '42101-1234567-1',
            'qualification' => 'Matric',
            'country' => 'Pakistan',
            'is_approved' => false,
            'registration_no' => null,
        ]);

        // Create course
        $this->course = Course::create([
            'program_id' => $program->id,
            'name' => 'Urdu Language',
            'code' => 'UL101',
            'credit_hours' => 3,
            'is_active' => true,
        ]);

        // Create assignment
        $this->assignment = Assignment::create([
            'course_id' => $this->course->id,
            'title' => 'First Homework',
            'max_marks' => 10,
            'due_date' => now()->addWeek(),
            'is_published' => true,
        ]);

        // Create submission
        AssignmentSubmission::create([
            'assignment_id' => $this->assignment->id,
            'student_id' => $this->student->id,
            'submitted_at' => now(),
            'status' => 'graded',
            'marks_obtained' => 8.5,
        ]);

        // Create Hifz enrollment
        HifzEnrollment::create([
            'student_id' => $this->student->id,
            'start_date' => now()->toDateString(),
            'total_juz_target' => 30,
            'juz_completed' => 5,
            'status' => 'active',
        ]);
    }

    public function test_unauthorized_users_cannot_access_exports(): void
    {
        $nonAdmin = User::factory()->create();
        $this->actingAs($nonAdmin)->get(route('admin.exports.students'))->assertStatus(403);
    }

    public function test_admin_can_export_students(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.exports.students'));
        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    public function test_admin_can_export_admissions(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.exports.admissions'));
        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    public function test_admin_can_export_attendance(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.exports.attendance'));
        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        $responseWithCourse = $this->actingAs($this->adminUser)->get(route('admin.exports.attendance', ['course_id' => $this->course->id]));
        $responseWithCourse->assertStatus(200);
    }

    public function test_admin_can_export_assignments(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.exports.assignments'));
        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        $responseWithAssignment = $this->actingAs($this->adminUser)->get(route('admin.exports.assignments', ['assignment_id' => $this->assignment->id]));
        $responseWithAssignment->assertStatus(200);
    }

    public function test_admin_can_export_hifz_excel(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.exports.hifz.excel'));
        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    public function test_admin_can_export_hifz_pdf(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.exports.hifz.pdf', $this->student->id));
        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/pdf');
    }
}
