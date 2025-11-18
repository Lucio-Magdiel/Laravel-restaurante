<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductoWebController extends Controller
{
    public function index(): Response
    {
        $productos = Producto::with('categoria')->orderBy('nombre')->paginate(20);
        return Inertia::render('productos/index', [
            'productos' => $productos,
        ]);
    }

    public function create(): Response
    {
        $categorias = Categoria::orderBy('nombre')->get();
        return Inertia::render('productos/create', [
            'categorias' => $categorias,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'categoria_id' => 'nullable|exists:categorias,id',
            'nombre' => 'required|string',
            'precio' => 'required|numeric|min:0',
            'tipo' => 'nullable|string',
            'descripcion' => 'nullable|string',
        ]);
        Producto::create($data);
        return redirect()->route('productos.index')->with('success', 'Producto creado correctamente');
    }
}
