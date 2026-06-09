<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * C5: Audit Log table — records all significant admin actions for compliance,
 * security review, and debugging. Tracks who changed what and when.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // Who performed the action
            $table->unsignedBigInteger('actor_id')->nullable();
            $table->string('actor_type', 20)->default('admin'); // 'admin' | 'student' | 'system'
            $table->string('actor_name', 150)->nullable();      // denormalized for history integrity

            // What event happened
            $table->string('event', 100);                       // e.g. 'admission.approved', 'student.deleted'

            // What record was affected (polymorphic)
            $table->string('auditable_type', 150)->nullable();  // e.g. 'App\Models\UserDetail'
            $table->unsignedBigInteger('auditable_id')->nullable();

            // What changed
            $table->json('old_values')->nullable();             // values before the change
            $table->json('new_values')->nullable();             // values after the change

            // Request context
            $table->string('ip_address', 50)->nullable();
            $table->string('url', 500)->nullable();
            $table->string('user_agent', 500)->nullable();

            // When
            $table->timestamp('created_at')->useCurrent();

            // ── Indexes for fast filtering in admin UI ────────────────────────
            $table->index(['actor_id', 'actor_type'],              'audit_actor_idx');
            $table->index(['auditable_type', 'auditable_id'],      'audit_auditable_idx');
            $table->index('event',                                  'audit_event_idx');
            $table->index('created_at',                             'audit_date_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
