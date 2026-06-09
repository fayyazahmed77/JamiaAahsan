<?php

namespace Tests\Feature\Public;

use App\Events\AdmissionSubmitted;
use App\Models\Klass;
use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdmissionFlowTest extends TestCase
{
    use RefreshDatabase;

    protected $klass;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->seed(\Database\Seeders\RolePermissionMigrationSeeder::class);
        $this->klass = Klass::create(['name' => 'Grade 1', 'slug' => 'grade-1', 'status' => true]);
    }

    public function test_student_can_apply_for_admission()
    {
        Event::fake([
            AdmissionSubmitted::class,
        ]);

        Storage::fake('public');

        $birthCertificate = UploadedFile::fake()->create('birth.pdf', 500, 'application/pdf');
        $degree = UploadedFile::fake()->image('degree.jpg');

        $response = $this->post(route('public.admissions.store'), [
            'name' => 'New Applicant',
            'email' => 'applicant@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'class_id' => $this->klass->id,
            'guardian_name' => 'Guardian Name',
            'gender' => 'male',
            'address' => 'Test Address 123',
            'id_card_no' => '42101-1111111-1',
            'qualification' => 'Matric',
            'phone' => '03123456789',
            'birth_certificate' => $birthCertificate,
            'education_degree' => $degree,
        ]);

        $response->assertRedirect(route('public.home'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'name' => 'New Applicant',
            'email' => 'applicant@test.com',
        ]);

        $user = User::where('email', 'applicant@test.com')->first();
        $this->assertTrue($user->hasRole('Student'));

        $this->assertDatabaseHas('user_details', [
            'user_id' => $user->id,
            'class_id' => $this->klass->id,
            'guardian_name' => 'Guardian Name',
        ]);

        $userDetail = UserDetail::where('user_id', $user->id)->first();
        $this->assertNotNull($userDetail->birth_certificate_path);
        $this->assertNotNull($userDetail->education_degree_path);

        $this->assertTrue(Storage::disk('public')->exists($userDetail->birth_certificate_path));
        $this->assertTrue(Storage::disk('public')->exists($userDetail->education_degree_path));

        $this->assertAuthenticatedAs($user);

        Event::assertDispatched(AdmissionSubmitted::class, function ($event) use ($userDetail) {
            return $event->userDetail->id === $userDetail->id;
        });
    }
}
