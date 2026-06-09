<?php

namespace Tests\Feature;

use App\Models\Klass;
use App\Models\User;
use App\Models\Category;
use App\Models\Year;
use App\Models\Audio;
use App\Models\Book;
use App\Models\Teacher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ApiAuthAndContentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed default roles and permissions
        $this->artisan('db:seed', ['--class' => 'RolePermissionMigrationSeeder']);
    }

    public function test_can_register_and_login_via_api(): void
    {
        // 1. Create a Klass first
        $klass = Klass::create([
            'name' => 'Grade 1',
            'slug' => 'grade-1',
            'status' => 1
        ]);

        // 2. Test registration
        $registerResponse = $this->postJson('/api/v1/auth/register', [
            'name' => 'Student Test',
            'email' => 'student@test.com',
            'password' => 'password123',
            'class_id' => $klass->id,
            'guardian_name' => 'Guardian Name',
            'gender' => 'male',
            'address' => 'Test Address',
            'id_card_no' => '12345-6789012-3',
            'qualification' => 'Metric',
            'phone' => '03001234567',
        ]);

        $registerResponse->assertStatus(201)
            ->assertJsonStructure([
                'error',
                'data' => ['id', 'name', 'email', 'registration_no'],
                'token'
            ]);

        $this->assertDatabaseHas('users', ['email' => 'student@test.com']);
        $this->assertDatabaseHas('user_details', ['phone' => '03001234567']);

        // 3. Test login
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'student@test.com',
            'password' => 'password123',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJsonStructure([
                'error',
                'data' => ['id', 'name', 'email'],
                'token'
            ]);

        $token = $loginResponse->json('token');

        // 4. Test authenticated profile view
        $profileResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/user/profile');

        $profileResponse->assertStatus(200)
            ->assertJsonPath('data.email', 'student@test.com');
    }

    public function test_can_fetch_public_content(): void
    {
        $category = Category::create([
            'name' => 'Bayanaat',
            'slug' => 'bayanaat',
            'type' => 'audio',
            'status' => 1
        ]);

        $year = Year::create([
            'name' => 2026,
            'status' => 1
        ]);

        $audio = Audio::create([
            'title' => 'Test Bayan 1',
            'uri' => 'media/test.mp3',
            'status' => 1
        ]);

        // Link audio using media bridge
        $audio->media()->create([
            'user_id' => User::factory()->create()->id,
            'category_id' => $category->id,
            'year_id' => $year->id,
            'uri' => $audio->uri,
            'type' => 'audio',
            'status' => 1
        ]);

        // Test categories list
        $this->getJson('/api/v1/categories')
            ->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'bayanaat');

        // Test years list
        $this->getJson('/api/v1/years')
            ->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 2026);

        // Test audio list
        $this->getJson('/api/v1/audio')
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'url', 'views']
                ]
            ]);

        // Test mark view
        $this->postJson("/api/v1/audio/{$audio->id}/mark-view")
            ->assertStatus(200)
            ->assertJsonPath('views', 1);
    }

    public function test_books_and_teachers_api_endpoints(): void
    {
        // Create active and inactive Book
        $bookActive = Book::create(['name' => 'Active Book', 'urdu_name' => 'کتاب ۱', 'status' => true]);
        $bookInactive = Book::create(['name' => 'Inactive Book', 'urdu_name' => 'کتاب ۲', 'status' => false]);

        // Create active and inactive Teacher
        $teacherActive = Teacher::create(['name' => 'Active Teacher', 'urdu_name' => 'استاد ۱', 'status' => true]);
        $teacherInactive = Teacher::create(['name' => 'Inactive Teacher', 'urdu_name' => 'استاد ۲', 'status' => false]);

        // Get books
        $this->getJson('/api/v1/books')
            ->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $bookActive->id);

        // Show single book
        $this->getJson("/api/v1/books/{$bookActive->id}")
            ->assertStatus(200)
            ->assertJsonPath('data.name', 'Active Book');

        // Show inactive book should fail (404)
        $this->getJson("/api/v1/books/{$bookInactive->id}")
            ->assertStatus(404);

        // Get teachers
        $this->getJson('/api/v1/teachers')
            ->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $teacherActive->id);

        // Show single teacher
        $this->getJson("/api/v1/teachers/{$teacherActive->id}")
            ->assertStatus(200)
            ->assertJsonPath('data.name', 'Active Teacher');

        // Show inactive teacher should fail (404)
        $this->getJson("/api/v1/teachers/{$teacherInactive->id}")
            ->assertStatus(404);
    }

    public function test_sanctum_session_revocation_endpoints(): void
    {
        $user = User::factory()->create([
            'email' => 'api-auth@test.com',
            'password' => Hash::make('password123'),
        ]);

        $token1 = $user->createToken('Device 1')->plainTextToken;
        $token2 = $user->createToken('Device 2')->plainTextToken;

        // List sessions/tokens
        $response = $this->withHeader('Authorization', 'Bearer ' . $token1)
            ->getJson('/api/v1/auth/sessions');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');

        // Revoke all tokens
        $this->withHeader('Authorization', 'Bearer ' . $token1)
            ->deleteJson('/api/v1/auth/revoke-all-tokens')
            ->assertStatus(200)
            ->assertJsonPath('message', 'All sessions/tokens revoked successfully');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_user_change_password_endpoint(): void
    {
        $user = User::factory()->create([
            'email' => 'pass-change@test.com',
            'password' => Hash::make('oldpassword123'),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        // Change password fails with wrong current password
        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/user/change-password', [
                'current_password' => 'wrongpassword',
                'new_password' => 'newpassword123',
                'new_password_confirmation' => 'newpassword123',
            ])
            ->assertStatus(422);

        // Change password succeeds
        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/user/change-password', [
                'current_password' => 'oldpassword123',
                'new_password' => 'newpassword123',
                'new_password_confirmation' => 'newpassword123',
            ])
            ->assertStatus(200);

        // Verify password is changed
        $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));
    }

    public function test_user_admission_status_and_document_upload_endpoints(): void
    {
        Storage::fake('public');

        $klass = Klass::create([
            'name' => 'Grade 10',
            'slug' => 'grade-10',
            'status' => 1
        ]);

        $user = User::factory()->create([
            'email' => 'student-docs@test.com',
            'password' => Hash::make('password123'),
        ]);
        $user->userDetail()->create([
            'class_id' => $klass->id,
            'guardian_name' => 'Guardian Name',
            'gender' => 'male',
            'address' => 'Test Address',
            'id_card_no' => '12345-6789012-3',
            'qualification' => 'Metric',
            'phone' => '03001234567',
            'country' => 'Pakistan',
            'admission_type' => 'regular',
            'is_approved' => false,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        // Get admission status
        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/user/admission-status')
            ->assertStatus(200)
            ->assertJsonPath('data.is_approved', false)
            ->assertJsonPath('data.class_name', 'Grade 10');

        // Upload documents
        $birthCert = UploadedFile::fake()->image('birth.jpg');
        $eduDegree = UploadedFile::fake()->image('degree.jpg');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/user/admission/documents', [
                'birth_certificate' => $birthCert,
                'education_degree' => $eduDegree,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Documents uploaded successfully.');

        $userDetail = $user->userDetail()->first();
        $this->assertNotNull($userDetail->birth_certificate_path);
        $this->assertNotNull($userDetail->education_degree_path);

        $this->assertTrue(Storage::disk('public')->exists($userDetail->birth_certificate_path));
        $this->assertTrue(Storage::disk('public')->exists($userDetail->education_degree_path));
    }
}
