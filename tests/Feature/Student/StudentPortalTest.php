<?php

namespace Tests\Feature\Student;

use App\Models\Student;
use App\Models\User;
use App\Models\Program;
use App\Models\Batch;
use App\Models\Klass;
use App\Models\SupportTicket;
use App\Models\StudentInvoice;
use App\Models\Semester;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class StudentPortalTest extends TestCase
{
    use RefreshDatabase;

    protected Student $student;
    protected string $plainPassword = 'StudentPassword123!';

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Create a dummy Program, Batch, and Class
        $program = Program::create([
            'name' => 'Dars-e-Nizami',
            'name_ur' => 'درس نظامی',
            'code' => 'DN',
            'slug' => 'dars-e-nizami',
            'total_semesters' => 8,
            'duration_years' => 4,
            'is_active' => true,
        ]);

        $batch = Batch::create([
            'program_id' => $program->id,
            'name' => 'Batch 2026',
            'start_date' => '2026-01-01',
            'is_active' => true,
        ]);

        $semester = Semester::create([
            'program_id' => $program->id,
            'name' => 'Semester 1',
            'code' => 'S1',
            'status' => 'active',
            'start_date' => '2026-01-01',
            'end_date' => '2026-06-30',
            'academic_year' => '2026',
            'duration_months' => 6,
        ]);

        $klass = Klass::create([
            'name' => 'Grade 1',
            'slug' => 'grade-1',
            'status' => 1
        ]);

        // 2. Create the associated Admin User (required for constraints if needed)
        $user = User::factory()->create([
            'email' => 'student.user@test.com',
            'password' => Hash::make($this->plainPassword),
        ]);

        // 3. Create the Student record
        $this->student = Student::create([
            'student_id_number' => 'JA-2026-0001',
            'user_id' => $user->id,
            'program_id' => $program->id,
            'current_semester_id' => $semester->id,
            'batch_id' => $batch->id,
            'class_id' => $klass->id,
            'name' => 'Ahmad Student',
            'email' => 'ahmad@test.com',
            'password' => Hash::make($this->plainPassword),
            'status' => 'active',
            'enrollment_date' => now(),
            'current_year' => 1,
            'current_semester' => 1,
            'student_type' => 'onsite',
        ]);

        // Create setting details for student
        $this->student->settings()->create([
            'language' => 'en',
            'theme' => 'light',
        ]);

        // Create student profile info
        $this->student->profile()->create([
            'father_name' => 'Father Name',
            'national_id' => '12345-1234567-1',
            'address' => 'Karachi, Pakistan',
        ]);
    }

    public function test_student_can_render_login_page(): void
    {
        $response = $this->get('/student/login');
        $response->assertStatus(200);
    }

    public function test_student_can_login_with_valid_credentials(): void
    {
        $response = $this->post('/student/login', [
            'email' => 'ahmad@test.com',
            'password' => $this->plainPassword,
        ]);

        $response->assertRedirect('/student/dashboard');
        $this->assertAuthenticatedAs($this->student, 'student');
    }

    public function test_student_cannot_login_with_invalid_credentials(): void
    {
        $response = $this->post('/student/login', [
            'email' => 'ahmad@test.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest('student');
    }

    public function test_student_can_access_dashboard(): void
    {
        $response = $this->actingAs($this->student, 'student')
            ->get('/student/dashboard');

        $response->assertStatus(200);
    }

    public function test_student_can_update_profile_contact_info(): void
    {
        $response = $this->actingAs($this->student, 'student')
            ->put('/student/profile', [
                'phone' => '03009999999',
                'address' => 'New Address, Karachi',
            ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('students', [
            'id' => $this->student->id,
            'phone' => '03009999999',
        ]);

        $this->assertDatabaseHas('student_profiles', [
            'student_id' => $this->student->id,
            'address' => 'New Address, Karachi',
        ]);
    }

    public function test_student_can_create_support_ticket(): void
    {
        $response = $this->actingAs($this->student, 'student')
            ->post('/student/support', [
                'subject' => 'Cannot view my classes',
                'category' => 'technical',
                'message' => 'Please resolve this issue immediately.',
            ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('support_tickets', [
            'student_id' => $this->student->id,
            'subject' => 'Cannot view my classes',
            'category' => 'technical',
            'status' => 'open',
        ]);
    }

    public function test_student_can_view_invoices(): void
    {
        // Create a test invoice
        $invoice = StudentInvoice::create([
            'student_id' => $this->student->id,
            'invoice_number' => 'INV-2026-0001',
            'title' => 'Admission Fee Semester 1',
            'amount' => 5000.00,
            'due_date' => now()->addDays(10),
            'status' => 'unpaid',
        ]);

        $response = $this->actingAs($this->student, 'student')
            ->get('/student/invoices');

        $response->assertStatus(200);
    }

    public function test_student_can_upload_payment_receipt(): void
    {
        Storage::fake('public');

        $invoice = StudentInvoice::create([
            'student_id' => $this->student->id,
            'invoice_number' => 'INV-2026-0002',
            'title' => 'Tuition Fee Jan 2026',
            'amount' => 3000.00,
            'due_date' => now()->addDays(5),
            'status' => 'unpaid',
        ]);

        $receiptFile = UploadedFile::fake()->create('receipt.pdf', 1024); // 1MB PDF

        $response = $this->actingAs($this->student, 'student')
            ->post("/student/invoices/{$invoice->id}/receipt", [
                'payment_method' => 'bank_transfer',
                'receipt' => $receiptFile,
            ]);

        $response->assertRedirect();

        $freshInvoice = $invoice->fresh();
        $this->assertEquals('pending', $freshInvoice->status);
        $this->assertNotNull($freshInvoice->receipt_path);
        
        $this->assertTrue(Storage::disk('public')->exists($freshInvoice->receipt_path));
    }

    public function test_student_can_download_invoice_pdf(): void
    {
        $invoice = StudentInvoice::create([
            'student_id' => $this->student->id,
            'invoice_number' => 'INV-2026-0003',
            'title' => 'Tuition Fee Feb 2026',
            'amount' => 3000.00,
            'due_date' => now()->addDays(5),
            'status' => 'unpaid',
        ]);

        $response = $this->actingAs($this->student, 'student')
            ->get("/student/invoices/{$invoice->id}/download");

        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/pdf');
    }
}
