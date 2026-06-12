<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('class_rooms', function (Blueprint $table) {
            $table->string('room_number', 50)->nullable()->after('name');
            $table->string('building_name', 100)->default('Main Building')->after('room_number');
            $table->string('floor_name', 100)->default('Ground Floor')->after('building_name');
            $table->string('room_type', 50)->default('classroom')->after('capacity');
            $table->json('features')->nullable()->after('room_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('class_rooms', function (Blueprint $table) {
            $table->dropColumn(['room_number', 'building_name', 'floor_name', 'room_type', 'features']);
        });
    }
};
