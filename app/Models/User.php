<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'otp_code',
        'otp_expires_at',
        'failed_attempts',
        'locked_until',
        'last_login_at',
        'last_login_ip',
        'profile_image',
        'phone',
        'country',
        'job_title',
        'department',
        'bio',
        'linkedin_url',
        'facebook_url',
        'instagram_url',
        'twitter_url',
        'portfolio_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => 'boolean',
            'otp_expires_at' => 'datetime',
            'locked_until' => 'datetime',
            'last_login_at' => 'datetime',
            'failed_attempts' => 'integer',
        ];
    }

    public function userDetail()
    {
        return $this->hasOne(UserDetail::class);
    }

    public function deviceTokens()
    {
        return $this->hasMany(DeviceToken::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(UserSubscription::class);
    }
}
