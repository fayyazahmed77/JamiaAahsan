<?php

namespace Tests\Feature\Admin;

use App\Models\Klass;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\UserSubscription;
use App\Models\LogAdmissionClass;
use Database\Seeders\RolePermissionMigrationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdmissionAndSubscriptionTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $studentUser;
    protected $klass1;
    protected $klass2;
    protected $userDetail;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionMigrationSeeder::class);

        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole('Super Admin');

        $this->studentUser = User::factory()->create([
            'name' => 'Student Applicant',
            'email' => 'student@test.com',
        ]);

        $this->klass1 = Klass::create(['name' => 'Class A', 'slug' => 'class-a', 'status' => true]);
        $this->klass2 = Klass::create(['name' => 'Class B', 'slug' => 'class-b', 'status' => true]);

        $this->userDetail = UserDetail::create([
            'user_id' => $this->studentUser->id,
            'class_id' => $this->klass1->id,
            'guardian_name' => 'Guardian Test',
            'gender' => 'male',
            'address' => 'Test Address',
            'id_card_no' => '42101-1234567-1',
            'qualification' => 'Matric',
            'phone' => '03001234567',
            'country' => 'Pakistan',
            'is_approved' => false,
        ]);
    }

    public function test_unauthorized_users_cannot_access_admissions(): void
    {
        $nonAdmin = User::factory()->create();
        $this->actingAs($nonAdmin)->get(route('admin.admissions.index'))->assertStatus(403);
    }

    public function test_authorized_user_can_view_admissions_list(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.admissions.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Admissions/Index'));
    }

    public function test_authorized_user_can_view_single_admission(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.admissions.show', $this->userDetail->id));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Admissions/Show'));
    }

    public function test_authorized_user_can_approve_admission(): void
    {
        \Illuminate\Support\Facades\Event::fake([
            \App\Events\AdmissionApproved::class,
        ]);

        $response = $this->actingAs($this->adminUser)->post(route('admin.admissions.approve', $this->userDetail->id));

        $response->assertStatus(302);
        
        $userDetailUpdated = UserDetail::find($this->userDetail->id);
        $this->assertTrue((bool)$userDetailUpdated->is_approved);
        $this->assertNotEmpty($userDetailUpdated->registration_no);

        $this->assertDatabaseHas('log_admission_classes', [
            'student_id' => $this->studentUser->id,
            'user_id' => $this->adminUser->id,
            'class_id' => $this->klass1->id,
        ]);

        \Illuminate\Support\Facades\Event::assertDispatched(\App\Events\AdmissionApproved::class);
    }


    public function test_authorized_user_can_reject_admission(): void
    {
        \Illuminate\Support\Facades\Event::fake([
            \App\Events\AdmissionRejected::class,
        ]);

        // Set to approved first
        $this->userDetail->update(['is_approved' => true]);

        $response = $this->actingAs($this->adminUser)->post(route('admin.admissions.reject', $this->userDetail->id), [
            'note' => 'Failed verification checks.'
        ]);

        $response->assertStatus(302);
        
        $userDetailUpdated = UserDetail::find($this->userDetail->id);
        $this->assertFalse((bool)$userDetailUpdated->is_approved);

        $this->assertDatabaseHas('log_admission_classes', [
            'student_id' => $this->studentUser->id,
            'user_id' => $this->adminUser->id,
            'note' => 'Admission application set to pending/rejected: Failed verification checks.',
        ]);

        \Illuminate\Support\Facades\Event::assertDispatched(\App\Events\AdmissionRejected::class);
    }


    public function test_authorized_user_can_transfer_student_class(): void
    {
        $response = $this->actingAs($this->adminUser)->post(route('admin.admissions.transfer', $this->userDetail->id), [
            'class_id' => $this->klass2->id,
            'note' => 'Performance promotion.'
        ]);

        $response->assertStatus(302);
        
        $userDetailUpdated = UserDetail::find($this->userDetail->id);
        $this->assertEquals($this->klass2->id, $userDetailUpdated->class_id);

        $this->assertDatabaseHas('log_admission_classes', [
            'student_id' => $this->studentUser->id,
            'user_id' => $this->adminUser->id,
            'class_id' => $this->klass2->id,
            'note' => 'Student class transferred. Note: Performance promotion.',
        ]);
    }

    public function test_authorized_user_can_view_subscriptions(): void
    {
        $sub = UserSubscription::create([
            'user_id' => $this->studentUser->id,
            'phone' => '03001234567',
            'country' => 'Pakistan',
        ]);

        $response = $this->actingAs($this->adminUser)->get(route('admin.subscriptions.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Subscriptions/Index'));
    }

    public function test_authorized_user_can_delete_subscription(): void
    {
        $sub = UserSubscription::create([
            'user_id' => $this->studentUser->id,
            'phone' => '03001234567',
            'country' => 'Pakistan',
        ]);

        $response = $this->actingAs($this->adminUser)->delete(route('admin.subscriptions.destroy', $sub->id));
        $response->assertRedirect(route('admin.subscriptions.index'));
        $this->assertDatabaseMissing('user_subscriptions', ['id' => $sub->id]);
    }
}
