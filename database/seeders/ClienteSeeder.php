<?php

namespace Database\Seeders;

use App\Models\Cliente;
use Illuminate\Database\Seeder;

class ClienteSeeder extends Seeder
{
    public function run(): void
    {
        $clientes = [
            ['nombre' => 'Juan Pérez', 'email' => 'juan@example.com', 'telefono' => '999111222', 'documento' => 'DNI12345678'],
            ['nombre' => 'María García', 'email' => 'maria@example.com', 'telefono' => '999333444', 'documento' => 'DNI87654321'],
            ['nombre' => 'Empresa ABC', 'email' => 'contacto@abc.com', 'telefono' => '555000111', 'documento' => 'RUC20123456789'],
        ];

        foreach ($clientes as $c) {
            Cliente::firstOrCreate([
                'email' => $c['email'],
            ], $c);
        }
    }
}
