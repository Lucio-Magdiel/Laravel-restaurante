<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategoriaProductoSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            'Entradas' => [
                ['nombre' => 'Bruschetta', 'precio' => 12.50],
                ['nombre' => 'Ensalada César', 'precio' => 18.00],
            ],
            'Platos Principales' => [
                ['nombre' => 'Pasta Alfredo', 'precio' => 28.00],
                ['nombre' => 'Pollo a la Parrilla', 'precio' => 32.00],
            ],
            'Bebidas' => [
                ['nombre' => 'Limonada', 'precio' => 8.00],
                ['nombre' => 'Café', 'precio' => 6.00],
            ],
            'Postres' => [
                ['nombre' => 'Tiramisú', 'precio' => 15.00],
                ['nombre' => 'Cheesecake', 'precio' => 14.50],
            ],
        ];

        foreach ($categorias as $catNombre => $productos) {
            $categoria = Categoria::firstOrCreate(
                ['slug' => Str::slug($catNombre)],
                ['nombre' => $catNombre]
            );

            foreach ($productos as $p) {
                Producto::firstOrCreate(
                    ['nombre' => $p['nombre'], 'categoria_id' => $categoria->id],
                    [
                        'categoria_id' => $categoria->id,
                        'nombre' => $p['nombre'],
                        'precio' => $p['precio'],
                        'tipo' => 'plato',
                        'activo' => true,
                    ]
                );
            }
        }
    }
}
