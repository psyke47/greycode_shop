<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::firstOrCreate(
            ['email' => 'funanani.mugagadeli@greycode.co.za'], // Check by email
            [
                'first_name'   => 'Funanani',
                'last_name'    => 'Mugagadeli',
                'password'     => Hash::make('securepassword'),
                'phone'        => '0123456789',
                'date_of_birth'=> '1990-01-01',
                'is_admin'     => true,
            ]
        );

        // Regular user - John
        User::firstOrCreate(
            ['email' => 'funiemugacs@gmail.com'],
            [
                'first_name'   => 'John',
                'last_name'    => 'Doe',
                'password'     => Hash::make('password123'),
                'phone'        => '0987654321',
                'date_of_birth'=> '1995-05-15',
                'is_admin'     => false,
            ]
        );

        // Regular user - Bob
        User::firstOrCreate(
            ['email' => 'bob@example.com'],
            [
                'first_name'   => 'Bob',
                'last_name'    => 'Smith',
                'password'     => Hash::make('password789'),
                'phone'        => '0987654323',
                'date_of_birth'=> '1997-06-20',
                'is_admin'     => false,
            ]
        );

        // Regular user - Norah
        User::firstOrCreate(
            ['email' => 'norah@example.com'],
            [
                'first_name'   => 'Norah',
                'last_name'    => 'Smith',
                'password'     => Hash::make('password106'),
                'phone'        => '0987654111',
                'date_of_birth'=> '1997-06-20',
                'is_admin'     => false,
            ]
        );
    }
}

/* User::create([
            'first_name'   => 'Jane',
            'last_name'    => 'Doe',
            'email'        => 'jane@example.com',
            'password'     => Hash::make('password456'),
            'phone'        => '0987654322',
            'date_of_birth'=> '1996-07-20',
            'is_admin'     => false,
        ]); */