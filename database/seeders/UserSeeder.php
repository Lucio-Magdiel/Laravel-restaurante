<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Admin', 'email' => 'admin@example.com', 'role' => 'admin'],
            ['name' => 'Mesero Demo', 'email' => 'mesero@example.com', 'role' => 'mesero'],
            ['name' => 'Cocina Demo', 'email' => 'cocina@example.com', 'role' => 'cocina'],
            ['name' => 'Caja Demo', 'email' => 'caja@example.com', 'role' => 'caja'],
        ];

        foreach ($users as $data) {
            User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'role' => $data['role'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
