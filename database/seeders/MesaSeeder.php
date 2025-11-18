<?php

namespace Database\Seeders;

use App\Models\Mesa;
use Illuminate\Database\Seeder;

class MesaSeeder extends Seeder
{
    public function run(): void
    {
        $mesas = [
            ['numero' => 'M1', 'capacidad' => 2],
            ['numero' => 'M2', 'capacidad' => 4],
            ['numero' => 'M3', 'capacidad' => 4],
            ['numero' => 'M4', 'capacidad' => 6],
            ['numero' => 'TERRAZA1', 'capacidad' => 4, 'ubicacion' => 'Terraza'],
        ];

        foreach ($mesas as $data) {
            Mesa::firstOrCreate(['numero' => $data['numero']], $data);
        }
    }
}
