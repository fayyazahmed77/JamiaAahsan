<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Run Role/Permission Seeder
        $this->call(RolePermissionMigrationSeeder::class);
        $this->call(AboutPageSeeder::class);
        $this->call(QASeeder::class);

        // 2. Create default Admin/Super Admin users
        $usersToCreate = [
            [
                'name' => 'System Admin',
                'email' => 'admin@gmail.com',
                'password' => 'Admin123',
                'roles' => ['Admin', 'Super Admin'],
            ],
            [
                'name' => 'System Admin Typo',
                'email' => 'admin@gmial.com',
                'password' => 'Admin123',
                'roles' => ['Admin', 'Super Admin'],
            ],
            [
                'name' => 'Super Admin',
                'email' => 'supper@gmail.com',
                'password' => 'Admin_123',
                'roles' => ['Super Admin'],
            ]
        ];

        foreach ($usersToCreate as $u) {
            $user = User::where('email', $u['email'])->first();

            if (!$user) {
                $user = User::create([
                    'name' => $u['name'],
                    'email' => $u['email'],
                    'password' => Hash::make($u['password']),
                    'status' => true,
                    'email_verified_at' => now(),
                ]);
                $this->command->info("User created: email = {$u['email']}, password = {$u['password']}");
            } else {
                $user->update([
                    'password' => Hash::make($u['password']),
                    'status' => true,
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ]);
                $this->command->info("User already existed. Password updated to: {$u['password']}");
            }

            foreach ($u['roles'] as $roleName) {
                $role = Role::where('name', $roleName)->first();
                if ($role) {
                    $user->assignRole($role);
                    $this->command->info("Assigned '{$roleName}' role to {$u['email']}");
                }
            }
        }
    }
}