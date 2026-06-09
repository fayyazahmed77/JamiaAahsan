<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('user_details')) {
            Schema::create('user_details', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
                $table->string('registration_no')->unique()->nullable();
                $table->string('guardian_name');
                $table->enum('gender', ['male', 'female', 'other'])->default('male');
                $table->text('address');
                $table->string('id_card_no');
                $table->text('qualification');
                $table->string('phone');
                $table->string('country')->nullable();
                $table->string('admission_type')->nullable();
                $table->tinyInteger('is_approved')->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('log_admission_classes')) {
            Schema::create('log_admission_classes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
                $table->text('note')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('log_admission_classes');
        Schema::dropIfExists('user_details');
    }
};
