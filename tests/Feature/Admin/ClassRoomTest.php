<?php

namespace Tests\Feature\Admin;

use App\Models\ClassRoom;
use App\Models\User;
use App\Models\ClassSchedule;
use App\Models\TimetableSlot;
use App\Models\Course;
use App\Models\Teacher;
use App\Models\Semester;
use Database\Seeders\RolePermissionMigrationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClassRoomTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $classroom;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles & permissions
        $this->seed(RolePermissionMigrationSeeder::class);

        // Set up admin user
        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole('Super Admin');

        // Create initial classroom
        $this->classroom = ClassRoom::create([
            'name' => 'Abu Hanifah Hall',
            'room_number' => 'G-101',
            'building_name' => 'Main Building',
            'floor_name' => 'Ground Floor',
            'capacity' => 60,
            'room_type' => 'classroom',
            'features' => ['Projector', 'AC', 'Whiteboard'],
            'location' => 'Near main gate entrance',
            'is_active' => true,
        ]);
    }

    public function test_unauthorized_users_cannot_access_classrooms(): void
    {
        $nonAdmin = User::factory()->create();
        
        $this->actingAs($nonAdmin)->get(route('admin.classrooms.index'))->assertStatus(403);
    }

    public function test_authorized_user_can_view_classrooms(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.classrooms.index'));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/ClassRoom/Index'));
    }

    public function test_authorized_user_can_create_classroom(): void
    {
        $payload = [
            'name' => 'Imam Bukhari Lab',
            'room_number' => 'F1-05',
            'building_name' => 'IT Block',
            'floor_name' => '1st Floor',
            'capacity' => 45,
            'room_type' => 'computer_lab',
            'features' => ['Computers', 'AC', 'Wi-Fi'],
            'location' => 'Next to library',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->adminUser)->post(route('admin.classrooms.store'), $payload);

        $response->assertStatus(302); // redirects back
        $this->assertDatabaseHas('class_rooms', [
            'name' => 'Imam Bukhari Lab',
            'room_number' => 'F1-05',
            'room_type' => 'computer_lab',
        ]);
    }

    public function test_authorized_user_can_update_classroom(): void
    {
        $payload = [
            'name' => 'Abu Hanifah Hall Updated',
            'room_number' => 'G-101-U',
            'building_name' => 'Main Building',
            'floor_name' => 'Ground Floor',
            'capacity' => 70,
            'room_type' => 'classroom',
            'features' => ['Projector', 'AC'],
            'location' => 'Near main gate entrance updated',
            'is_active' => false,
        ];

        $response = $this->actingAs($this->adminUser)
            ->put(route('admin.classrooms.update', $this->classroom->id), $payload);

        $response->assertStatus(302); // redirects back
        $this->assertDatabaseHas('class_rooms', [
            'id' => $this->classroom->id,
            'name' => 'Abu Hanifah Hall Updated',
            'room_number' => 'G-101-U',
            'capacity' => 70,
            'is_active' => false,
        ]);
    }

    public function test_cannot_delete_classroom_with_associated_class_schedule(): void
    {
        // Setup a course, teacher, program, semester, etc. to link ClassSchedule
        $program = \App\Models\Program::create([
            'name' => 'Dars-e-Nizami',
            'slug' => 'dars-e-nizami',
            'duration_years' => 4,
            'total_semesters' => 8,
            'is_active' => true,
        ]);
        $semester = Semester::create([
            'program_id' => $program->id,
            'name' => 'Semester 1',
            'code' => 'DN-S1',
            'start_date' => now(),
            'end_date' => now()->addMonths(6),
            'duration_months' => 6,
            'status' => 'active',
            'academic_year' => '2026',
        ]);
        $course = Course::create([
            'semester_id' => $semester->id,
            'program_id' => $program->id,
            'name' => 'Al-Aqida',
            'code' => 'AQ-101',
            'credit_hours' => 3,
            'is_active' => true,
        ]);
        $teacher = Teacher::create([
            'name' => 'Teacher One',
            'urdu_name' => 'ٹیسچر ون',
            'status' => true,
        ]);

        ClassSchedule::create([
            'course_id' => $course->id,
            'teacher_id' => $teacher->id,
            'day_of_week' => 1,
            'start_time' => '08:00:00',
            'end_time' => '09:00:00',
            'room_id' => $this->classroom->id,
            'type' => 'lecture',
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->delete(route('admin.classrooms.destroy', $this->classroom->id));

        $response->assertStatus(302);
        $this->assertDatabaseHas('class_rooms', ['id' => $this->classroom->id]);
        $response->assertSessionHas('error');
    }

    public function test_cannot_delete_classroom_with_associated_timetable_slot(): void
    {
        // Setup models
        $program = \App\Models\Program::create([
            'name' => 'Dars-e-Nizami',
            'slug' => 'dars-e-nizami',
            'duration_years' => 4,
            'total_semesters' => 8,
            'is_active' => true,
        ]);
        $semester = Semester::create([
            'program_id' => $program->id,
            'name' => 'Semester 1',
            'code' => 'DN-S1',
            'start_date' => now(),
            'end_date' => now()->addMonths(6),
            'duration_months' => 6,
            'status' => 'active',
            'academic_year' => '2026',
        ]);
        $course = Course::create([
            'semester_id' => $semester->id,
            'program_id' => $program->id,
            'name' => 'Al-Aqida',
            'code' => 'AQ-101',
            'credit_hours' => 3,
            'is_active' => true,
        ]);
        $teacher = Teacher::create([
            'name' => 'Teacher One',
            'urdu_name' => 'ٹیسچر ون',
            'status' => true,
        ]);

        TimetableSlot::create([
            'course_id' => $course->id,
            'teacher_id' => $teacher->id,
            'room_id' => $this->classroom->id,
            'day_of_week' => 2,
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->delete(route('admin.classrooms.destroy', $this->classroom->id));

        $response->assertStatus(302);
        $this->assertDatabaseHas('class_rooms', ['id' => $this->classroom->id]);
        $response->assertSessionHas('error');
    }

    public function test_authorized_user_can_delete_classroom_without_schedule(): void
    {
        $emptyRoom = ClassRoom::create([
            'name' => 'Empty Hall',
            'room_number' => 'G-102',
            'building_name' => 'Main Building',
            'floor_name' => 'Ground Floor',
            'capacity' => 30,
            'room_type' => 'classroom',
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->delete(route('admin.classrooms.destroy', $emptyRoom->id));

        $response->assertStatus(302);
        $this->assertDatabaseMissing('class_rooms', ['id' => $emptyRoom->id]);
    }
}
