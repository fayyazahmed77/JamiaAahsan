<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;

/**
 * C5: AuditLog — immutable record of admin/student actions.
 *
 * Usage:
 *   AuditLog::record('admission.approved', $userDetail, ['is_approved' => false], ['is_approved' => true]);
 *   AuditLog::recordSystem('sitemap.generated');
 */
class AuditLog extends Model
{
    // Audit logs are append-only — never update or soft-delete.
    public $timestamps = false;

    protected $fillable = [
        'actor_id',
        'actor_type',
        'actor_name',
        'event',
        'auditable_type',
        'auditable_id',
        'old_values',
        'new_values',
        'ip_address',
        'url',
        'user_agent',
        'created_at',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime',
    ];

    // ── Factory Methods ───────────────────────────────────────────────────────

    /**
     * Record an admin action against a model.
     *
     * @param string      $event     e.g. 'admission.approved'
     * @param Model|null  $subject   The model being acted upon
     * @param array       $oldValues Values before the change
     * @param array       $newValues Values after the change
     */
    public static function record(
        string $event,
        ?Model $subject = null,
        array  $oldValues = [],
        array  $newValues = [],
    ): void {
        $actor = auth()->user() ?? auth('student')->user();

        static::create([
            'actor_id'       => $actor?->id,
            'actor_type'     => auth()->check() ? 'admin' : (auth('student')->check() ? 'student' : 'system'),
            'actor_name'     => $actor?->name,
            'event'          => $event,
            'auditable_type' => $subject ? get_class($subject) : null,
            'auditable_id'   => $subject?->getKey(),
            'old_values'     => $oldValues ?: null,
            'new_values'     => $newValues ?: null,
            'ip_address'     => Request::ip(),
            'url'            => Request::fullUrl(),
            'user_agent'     => Request::userAgent(),
            'created_at'     => now(),
        ]);
    }

    /**
     * Record a system event (no authenticated user).
     *
     * @param string $event e.g. 'sitemap.generated', 'queue.failed'
     */
    public static function recordSystem(string $event, array $data = []): void
    {
        static::create([
            'actor_id'   => null,
            'actor_type' => 'system',
            'actor_name' => 'System',
            'event'      => $event,
            'new_values' => $data ?: null,
            'ip_address' => Request::ip(),
            'url'        => Request::fullUrl(),
            'created_at' => now(),
        ]);
    }

    // ── Scopes ────────────────────────────────────────────────────────────────

    public function scopeForEvent($query, string $event)
    {
        return $query->where('event', $event);
    }

    public function scopeForActor($query, int $actorId, string $actorType = 'admin')
    {
        return $query->where('actor_id', $actorId)->where('actor_type', $actorType);
    }

    public function scopeForSubject($query, string $type, int $id)
    {
        return $query->where('auditable_type', $type)->where('auditable_id', $id);
    }
}
