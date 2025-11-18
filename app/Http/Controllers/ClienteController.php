<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClienteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = $request->query('q');
        $clientes = Cliente::when($q, function ($query) use ($q) {
                $like = "%$q%";
                $query->where(function ($sub) use ($like) {
                    $sub->where('nombre', 'like', $like)
                        ->orWhere('email', 'like', $like)
                        ->orWhere('telefono', 'like', $like)
                        ->orWhere('documento', 'like', $like);
                });
            })
            ->orderBy('nombre')
            ->limit(200)
            ->get();
        return response()->json($clientes);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:50',
            'documento' => 'nullable|string|max:50',
        ]);
        $cliente = Cliente::create($data);
        return response()->json($cliente, 201);
    }

    public function show(Cliente $cliente): JsonResponse
    {
        return response()->json($cliente);
    }

    public function update(Request $request, Cliente $cliente): JsonResponse
    {
        $data = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'email' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:50',
            'documento' => 'nullable|string|max:50',
        ]);
        $cliente->update($data);
        return response()->json($cliente);
    }

    public function destroy(Cliente $cliente): JsonResponse
    {
        $cliente->delete();
        return response()->json(['ok' => true]);
    }
}
