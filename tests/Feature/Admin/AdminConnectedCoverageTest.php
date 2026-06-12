<?php

namespace Tests\Feature\Admin;

use App\Models\Student;
use App\Models\User;
use App\Models\SupportTicket;
use App\Models\StudentInvoice;
use App\Models\Program;
use App\Models\Batch;
use App\Models\Klass;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminConnectedCoverageTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected Student $student;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Run Role/Permission Seeder
        $this->artisan('db:seed', ['--class' => 'RolePermissionMigrationSeeder']);

        // 2. Create Admin User & Assign Role
        $this->adminUser = User::factory()->create([
            'email' => 'admin@jamia.com',
            'password' => Hash::make('AdminPassword123!'),
        ]);
        $this->adminUser->assignRole('Super Admin');

        // 3. Create Student and Program/Batch dependencies
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

        $klass = Klass::create([
            'name' => 'Grade 1',
            'slug' => 'grade-1',
            'status' => 1
        ]);

        $studentUser = User::factory()->create();
        $this->student = Student::create([
            'student_id_number' => 'JA-2026-0001',
            'user_id' => $studentUser->id,
            'program_id' => $program->id,
            'batch_id' => $batch->id,
            'class_id' => $klass->id,
            'name' => 'Ahmad Student',
            'email' => 'ahmad@test.com',
            'password' => Hash::make('Student123!'),
            'status' => 'active',
            'enrollment_date' => now(),
            'current_year' => 1,
            'current_semester' => 1,
            'student_type' => 'onsite',
        ]);
    }

    public function test_admin_can_list_support_tickets(): void
    {
        SupportTicket::create([
            'student_id' => $this->student->id,
            'subject' => 'Help with login',
            'category' => 'technical',
            'message' => 'I cannot log in to the student portal.',
            'status' => 'open',
        ]);

        $response = $this->actingAs($this->adminUser, 'web')
            ->get('/admin/support-tickets');

        $response->assertStatus(200);
    }

    public function test_admin_can_resolve_support_ticket(): void
    {
        $ticket = SupportTicket::create([
            'student_id' => $this->student->id,
            'subject' => 'Help with login',
            'category' => 'technical',
            'message' => 'I cannot log in.',
            'status' => 'open',
        ]);

        $response = $this->actingAs($this->adminUser, 'web')
            ->post("/admin/support-tickets/{$ticket->id}/resolve", [
                'admin_response' => 'Your login has been reset. Please try again.',
            ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('support_tickets', [
            'id' => $ticket->id,
            'status' => 'resolved',
            'admin_response' => 'Your login has been reset. Please try again.',
            'resolved_by' => $this->adminUser->id,
        ]);
    }

    public function test_admin_can_list_invoices(): void
    {
        $response = $this->actingAs($this->adminUser, 'web')
            ->get('/admin/invoices');

        $response->assertStatus(200);
    }

    public function test_admin_can_issue_new_invoice(): void
    {
        $response = $this->actingAs($this->adminUser, 'web')
            ->post('/admin/invoices', [
                'student_id' => $this->student->id,
                'title' => 'Admission Fee Semester 1',
                'title_ur' => 'تعلیمی فیس سمسٹر اول',
                'amount' => 5000.00,
                'due_date' => now()->addDays(15)->toDateString(),
            ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('student_invoices', [
            'student_id' => $this->student->id,
            'title' => 'Admission Fee Semester 1',
            'amount' => 5000.00,
            'status' => 'unpaid',
        ]);
    }

    public function test_admin_can_approve_payment_receipt(): void
    {
        $invoice = StudentInvoice::create([
            'student_id' => $this->student->id,
            'invoice_number' => 'INV-2026-T1',
            'title' => 'Tuition Fee Jan 2026',
            'amount' => 3000.00,
            'due_date' => now()->addDays(5),
            'status' => 'pending',
            'receipt_path' => 'receipts/test.pdf',
            'payment_method' => 'bank_transfer',
        ]);

        $response = $this->actingAs($this->adminUser, 'web')
            ->post("/admin/invoices/{$invoice->id}/approve");

        $response->assertRedirect();
        
        $this->assertDatabaseHas('student_invoices', [
            'id' => $invoice->id,
            'status' => 'paid',
        ]);
        
        $this->assertNotNull($invoice->fresh()->paid_at);
    }

    public function test_admin_can_reject_payment_receipt(): void
    {
        Storage::fake('public');
        
        $filePath = Storage::disk('public')->put('receipts/test_reject.pdf', 'dummy content');

        $invoice = StudentInvoice::create([
            'student_id' => $this->student->id,
            'invoice_number' => 'INV-2026-T2',
            'title' => 'Tuition Fee Feb 2026',
            'amount' => 3000.00,
            'due_date' => now()->addDays(5),
            'status' => 'pending',
            'receipt_path' => $filePath,
            'payment_method' => 'easy_paisa',
        ]);

        $response = $this->actingAs($this->adminUser, 'web')
            ->post("/admin/invoices/{$invoice->id}/reject", [
                'reason' => 'Receipt image is blurry',
            ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('student_invoices', [
            'id' => $invoice->id,
            'status' => 'unpaid',
            'receipt_path' => null,
            'payment_method' => null,
        ]);
        
        $this->assertStringContainsString('Receipt Rejected: Receipt image is blurry', $invoice->fresh()->admin_notes);
        
        $this->assertFalse(Storage::disk('public')->exists($filePath));
    }
}
