<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductoController extends Controller
{
    public function index(): JsonResponse
    {
        $productos = Producto::with('categoria')->where('activo', true)->orderBy('nombre')->get();
        return response()->json($productos);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'categoria_id' => 'nullable|exists:categorias,id',
            'nombre' => 'required|string',
            'precio' => 'required|numeric|min:0',
            'tipo' => 'nullable|string',
            'descripcion' => 'nullable|string',
        ]);
        $producto = Producto::create($data);
        return response()->json($producto, 201);
    }

    public function update(Request $request, Producto $producto): JsonResponse
    {
        $data = $request->validate([
            'categoria_id' => 'nullable|exists:categorias,id',
            'nombre' => 'sometimes|string',
            'precio' => 'sometimes|numeric|min:0',
            'tipo' => 'nullable|string',
            'descripcion' => 'nullable|string',
            'activo' => 'sometimes|boolean',
        ]);
        $producto->update($data);
        return response()->json($producto);
    }

    public function destroy(Producto $producto): JsonResponse
    {
        $producto->delete();
        return response()->json(['ok' => true]);
    }
}
