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
        // 1. Add fields to user_details
        if (Schema::hasTable('user_details')) {
            Schema::table('user_details', function (Blueprint $table) {
                if (!Schema::hasColumn('user_details', 'dob')) {
                    $table->date('dob')->nullable()->after('gender');
                }
                if (!Schema::hasColumn('user_details', 'birth_certificate_path')) {
                    $table->string('birth_certificate_path')->nullable()->after('qualification');
                }
                if (!Schema::hasColumn('user_details', 'education_degree_path')) {
                    $table->string('education_degree_path')->nullable()->after('birth_certificate_path');
                }
            });
        }

        // 2. Add fields to download_links
        if (Schema::hasTable('download_links')) {
            Schema::table('download_links', function (Blueprint $table) {
                if (!Schema::hasColumn('download_links', 'title')) {
                    $table->string('title')->after('id');
                }
                if (!Schema::hasColumn('download_links', 'description')) {
                    $table->text('description')->nullable()->after('title');
                }
                if (!Schema::hasColumn('download_links', 'file_size')) {
                    $table->string('file_size')->nullable()->after('url');
                }
                if (!Schema::hasColumn('download_links', 'sort_order')) {
                    $table->integer('sort_order')->default(0)->after('status');
                }
            });
        }

        // 3. Add fields to feedback
        if (Schema::hasTable('feedback')) {
            Schema::table('feedback', function (Blueprint $table) {
                if (!Schema::hasColumn('feedback', 'is_read')) {
                    $table->boolean('is_read')->default(false)->after('rating');
                }
                if (!Schema::hasColumn('feedback', 'replied_at')) {
                    $table->timestamp('replied_at')->nullable()->after('is_read');
                }
                if (!Schema::hasColumn('feedback', 'replied_by')) {
                    $table->foreignId('replied_by')->nullable()->constrained('users')->onDelete('set null')->after('replied_at');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('feedback')) {
            Schema::table('feedback', function (Blueprint $table) {
                if (Schema::hasColumn('feedback', 'replied_by')) {
                    $table->dropForeign(['replied_by']);
                    $table->dropColumn('replied_by');
                }
                if (Schema::hasColumn('feedback', 'replied_at')) {
                    $table->dropColumn('replied_at');
                }
                if (Schema::hasColumn('feedback', 'is_read')) {
                    $table->dropColumn('is_read');
                }
            });
        }

        if (Schema::hasTable('download_links')) {
            Schema::table('download_links', function (Blueprint $table) {
                $columns = ['title', 'description', 'file_size', 'sort_order'];
                foreach ($columns as $col) {
                    if (Schema::hasColumn('download_links', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }

        if (Schema::hasTable('user_details')) {
            Schema::table('user_details', function (Blueprint $table) {
                $columns = ['dob', 'birth_certificate_path', 'education_degree_path'];
                foreach ($columns as $col) {
                    if (Schema::hasColumn('user_details', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }
    }
};
