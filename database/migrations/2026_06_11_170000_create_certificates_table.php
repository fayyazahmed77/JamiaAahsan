<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('certificates')) {
            Schema::create('certificates', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
                $table->string('type', 50); // completion, hifz, participation
                $table->string('code', 20)->unique(); // unique QR code verification key
                $table->string('title', 255);
                $table->string('title_ur', 255)->nullable();
                $table->date('issued_date');
                $table->date('valid_until')->nullable();
                $table->string('pdf_path', 500)->nullable();
                $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
                $table->timestamps();

                $table->index('code');
                $table->index(['student_id', 'type']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
