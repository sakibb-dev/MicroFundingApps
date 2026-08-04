<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database. Admins aren't self-registerable
     * (see AuthController), so a default admin account is seeded here for
     * local development/demo purposes.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@microinvest.id'],
            [
                'name' => 'Admin Utama',
                'password' => bcrypt('password123'),
                'role' => UserRole::Admin,
            ]
        );
    }
}
