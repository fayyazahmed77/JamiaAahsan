<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Student extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'student_id_number',
        'user_id',
        'program_id',
        'batch_id',
        'class_id',
        'current_semester_id',
        'name',
        'email',
        'password',
        'phone',
        'date_of_birth',
        'gender',
        'profile_photo',
        'pending_profile_photo',
        'photo_status',
        'current_year',
        'current_semester',
        'student_type',
        'status',
        'enrollment_date',
        'graduation_date',
        'last_login_at',
        'last_login_ip',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'date_of_birth'     => 'date',
            'enrollment_date'   => 'date',
            'graduation_date'   => 'date',
            'last_login_at'     => 'datetime',
            'current_year'      => 'integer',
            'current_semester'  => 'integer',
            'current_semester_id'=> 'integer',
        ];
    }

    // ─── Guard ─────────────────────────────────────────────────────────
    /**
     * The guard to use for this model.
     * Overrides default 'web' guard so auth()->guard('student') works correctly.
     */
    public function getAuthGuard(): string
    {
        return 'student';
    }

    // ─── Computed Attributes ───────────────────────────────────────────

    /**
     * Full URL to the profile photo.
     */
    public function getProfilePhotoUrlAttribute(): ?string
    {
        return $this->profile_photo
            ? asset('storage/' . $this->profile_photo)
            : null;
    }

    /**
     * Full URL to the pending profile photo.
     */
    public function getPendingProfilePhotoUrlAttribute(): ?string
    {
        return $this->pending_profile_photo
            ? asset('storage/' . $this->pending_profile_photo)
            : null;
    }

    /**
     * Human-readable student type.
     */
    public function getStudentTypeLabelAttribute(): string
    {
        return $this->student_type === 'online' ? 'Online Student' : 'Onsite Student';
    }

    /**
     * Progress percentage through total semesters.
     */
    public function getProgressPercentageAttribute(): float
    {
        $totalSemesters = $this->program?->total_semesters ?? 16;
        return round(($this->current_semester / $totalSemesters) * 100, 1);
    }

    /**
     * Expected graduation year.
     */
    public function getExpectedGraduationAttribute(): ?string
    {
        if (!$this->enrollment_date || !$this->program) return null;
        return $this->enrollment_date->addYears($this->program->duration_years)->format('F Y');
    }

    // ─── Relationships ─────────────────────────────────────────────────

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function klass()
    {
        return $this->belongsTo(Klass::class, 'class_id');
    }

    public function currentSemester()
    {
        return $this->belongsTo(Semester::class, 'current_semester_id');
    }

    public function enrolledSemesters()
    {
        return $this->hasMany(StudentSemester::class);
    }

    public function profile()
    {
        return $this->hasOne(StudentProfile::class);
    }

    public function guardians()
    {
        return $this->hasMany(StudentGuardian::class);
    }

    public function primaryGuardian()
    {
        return $this->hasOne(StudentGuardian::class)->where('is_primary', true);
    }

    public function loginHistory()
    {
        return $this->hasMany(StudentLoginHistory::class)->latest();
    }

    public function settings()
    {
        return $this->hasOne(StudentSetting::class);
    }

    public function notifications()
    {
        return $this->hasMany(StudentPortalNotification::class)->latest();
    }

    public function unreadNotifications()
    {
        return $this->hasMany(StudentPortalNotification::class)->where('is_read', false);
    }

    public function digitalId()
    {
        return $this->hasOne(DigitalStudentId::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'student_course_enrollments');
    }

    public function courseEnrollments()
    {
        return $this->hasMany(StudentCourseEnrollment::class);
    }

    public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    public function assignmentSubmissions()
    {
        return $this->hasMany(AssignmentSubmission::class);
    }

    public function hifzEnrollment()
    {
        return $this->hasOne(HifzEnrollment::class);
    }

    public function hifzSessions()
    {
        return $this->hasMany(HifzSession::class)->latest();
    }

    public function supportTickets()
    {
        return $this->hasMany(SupportTicket::class)->latest();
    }

    public function invoices()
    {
        return $this->hasMany(StudentInvoice::class)->latest();
    }

    // ─── Scopes ────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeOnline($query)
    {
        return $query->where('student_type', 'online');
    }

    public function scopeOnsite($query)
    {
        return $query->where('student_type', 'onsite');
    }
}
