<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Role;
use App\Models\Permission;

class RolePermissionMigrationSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Check if old tables exist to migrate from
        if (Schema::hasTable('roles') && Schema::hasTable('permissions') && Schema::hasTable('role_user')) {
            // Check if it's the old schema by checking a column name (e.g. description or level in roles)
            if (Schema::hasColumn('roles', 'level')) {
                $this->migrateFromOldTables();
                return;
            }
        }

        // 2. Otherwise, seed standard default roles & permissions (Local Dev / Fresh DB)
        $this->seedDefaults();
    }

    private function migrateFromOldTables(): void
    {
        $this->command->info('Migrating roles and permissions from old schema...');

        // Read old roles and insert into Spatie roles
        $oldRoles = DB::table('roles')->get();
        foreach ($oldRoles as $oldRole) {
            Role::firstOrCreate([
                'name' => $oldRole->name,
                'guard_name' => 'web'
            ]);
        }

        // Read old permissions and insert into Spatie permissions
        $oldPermissions = DB::table('permissions')->get();
        foreach ($oldPermissions as $oldPermission) {
            Permission::firstOrCreate([
                'name' => $oldPermission->name,
                'guard_name' => 'web'
            ]);
        }

        // Migrate role_user to model_has_roles
        $oldRoleUsers = DB::table('role_user')->get();
        foreach ($oldRoleUsers as $oru) {
            $userExists = DB::table('users')->where('id', $oru->user_id)->exists();
            $role = DB::table('roles')->where('id', $oru->role_id)->first();
            if ($userExists && $role) {
                $spatieRole = Role::where('name', $role->name)->first();
                if ($spatieRole) {
                    DB::table('model_has_roles')->insertOrIgnore([
                        'role_id' => $spatieRole->id,
                        'model_type' => 'App\Models\User',
                        'model_id' => $oru->user_id
                    ]);
                }
            }
        }

        // Migrate permission_role to role_has_permissions
        if (Schema::hasTable('permission_role')) {
            $oldPermissionRoles = DB::table('permission_role')->get();
            foreach ($oldPermissionRoles as $opr) {
                $permission = DB::table('permissions')->where('id', $opr->permission_id)->first();
                $role = DB::table('roles')->where('id', $opr->role_id)->first();
                if ($permission && $role) {
                    $spatiePermission = Permission::where('name', $permission->name)->first();
                    $spatieRole = Role::where('name', $role->name)->first();
                    if ($spatiePermission && $spatieRole) {
                        DB::table('role_has_permissions')->insertOrIgnore([
                            'permission_id' => $spatiePermission->id,
                            'role_id' => $spatieRole->id
                        ]);
                    }
                }
            }
        }

        // Migrate permission_user to model_has_permissions
        if (Schema::hasTable('permission_user')) {
            $oldPermissionUsers = DB::table('permission_user')->get();
            foreach ($oldPermissionUsers as $opu) {
                $userExists = DB::table('users')->where('id', $opu->user_id)->exists();
                $permission = DB::table('permissions')->where('id', $opu->permission_id)->first();
                if ($userExists && $permission) {
                    $spatiePermission = Permission::where('name', $permission->name)->first();
                    if ($spatiePermission) {
                        DB::table('model_has_permissions')->insertOrIgnore([
                            'permission_id' => $spatiePermission->id,
                            'model_type' => 'App\Models\User',
                            'model_id' => $opu->user_id
                        ]);
                    }
                }
            }
        }

        $this->command->info('Migration of roles and permissions completed!');
    }

    private function seedDefaults(): void
    {
        $this->command->info('Seeding default roles, categories and permissions...');

        $categoriesData = [
            [
                'name' => 'Dashboard',
                'icon' => 'Dashboard',
                'permissions' => ['view dashboard'],
            ],
            [
                'name' => 'Audio',
                'icon' => 'Audio',
                'permissions' => ['view audio', 'create audio', 'edit audio', 'delete audio'],
            ],
            [
                'name' => 'Videos',
                'icon' => 'Video',
                'permissions' => ['view videos', 'create videos', 'edit videos', 'delete videos'],
            ],
            [
                'name' => 'Images & Banners',
                'icon' => 'Image',
                'permissions' => ['view home.main.banner', 'create home.main.banner', 'edit home.main.banner', 'delete home.main.banner'],
            ],
            [
                'name' => 'Downloads',
                'icon' => 'Download',
                'permissions' => ['view downloads', 'create downloads', 'edit downloads', 'delete downloads'],
            ],
            [
                'name' => 'Speakers',
                'icon' => 'Speaker',
                'permissions' => ['view speakers', 'create speakers', 'edit speakers', 'delete speakers'],
            ],
            [
                'name' => 'Categories',
                'icon' => 'Category',
                'permissions' => ['view categories', 'create categories', 'edit categories', 'delete categories'],
            ],
            [
                'name' => 'Years',
                'icon' => 'Year',
                'permissions' => ['view years', 'create years', 'edit years', 'delete years'],
            ],
            [
                'name' => 'Classes',
                'icon' => 'Class',
                'permissions' => ['view classes', 'create classes', 'edit classes', 'delete classes'],
            ],
            [
                'name' => 'Teachers',
                'icon' => 'Teacher',
                'permissions' => ['view teachers', 'create teachers', 'edit teachers', 'delete teachers'],
            ],
            [
                'name' => 'Books',
                'icon' => 'Book',
                'permissions' => ['view books', 'create books', 'edit books', 'delete books'],
            ],
            [
                'name' => 'Admissions',
                'icon' => 'Admission',
                'permissions' => ['view admissions', 'create admissions', 'edit admissions', 'delete admissions'],
            ],
            [
                'name' => 'Subscriptions',
                'icon' => 'Subscription',
                'permissions' => ['view subscriptions', 'create subscriptions', 'edit subscriptions', 'delete subscriptions'],
            ],
            [
                'name' => 'Question & Answers',
                'icon' => 'QA',
                'permissions' => ['view qa', 'create qa', 'edit qa', 'delete qa'],
            ],
            [
                'name' => 'Topics',
                'icon' => 'Category',
                'permissions' => ['view topics', 'create topics', 'edit topics', 'delete topics'],
            ],
            [
                'name' => 'Settings',
                'icon' => 'Settings',
                'permissions' => ['view settings', 'create settings', 'edit settings', 'delete settings'],
            ],
            [
                'name' => 'Prayer Timings',
                'icon' => 'Prayer',
                'permissions' => ['view prayer-timings', 'create prayer-timings', 'edit prayer-timings', 'delete prayer-timings'],
            ],
            [
                'name' => 'Latest News',
                'icon' => 'News',
                'permissions' => ['view latest-news', 'create latest-news', 'edit latest-news', 'delete latest-news'],
            ],
            [
                'name' => 'Feedback',
                'icon' => 'Feedback',
                'permissions' => ['view feedback', 'create feedback', 'edit feedback', 'delete feedback'],
            ],
            [
                'name' => 'Users',
                'icon' => 'Users',
                'permissions' => ['view users', 'create users', 'edit users', 'delete users'],
            ],
            [
                'name' => 'Roles & Permissions',
                'icon' => 'Roles',
                'permissions' => ['view roles', 'create roles', 'edit roles', 'delete roles'],
            ],
            [
                'name' => 'Notifications',
                'icon' => 'Bell',
                'permissions' => ['view notifications', 'create notifications', 'edit notifications', 'delete notifications'],
            ],
        ];

        foreach ($categoriesData as $cData) {
            $category = \App\Models\PermissionCategory::firstOrCreate([
                'name' => $cData['name']
            ], [
                'icon' => $cData['icon']
            ]);

            foreach ($cData['permissions'] as $pName) {
                Permission::firstOrCreate([
                    'name' => $pName,
                    'guard_name' => 'web'
                ], [
                    'category_id' => $category->id
                ]);

                Permission::firstOrCreate([
                    'name' => $pName,
                    'guard_name' => 'api'
                ], [
                    'category_id' => $category->id
                ]);
            }
        }

        // Create Roles
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $admin = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $student = Role::firstOrCreate(['name' => 'Student', 'guard_name' => 'web']);

        // Super Admin gets all permissions
        $superAdmin->syncPermissions(Permission::where('guard_name', 'web')->get());

        // Admin gets most permissions
        $admin->syncPermissions(Permission::where('guard_name', 'web')->where('name', 'not like', '%delete%')->get());

        // Student gets view permissions
        $student->syncPermissions(Permission::where('guard_name', 'web')->where('name', 'like', 'view%')->get());

        $this->command->info('Seeding completed! Default roles (Super Admin, Admin, Student) created and permissions categorized.');
    }
}
