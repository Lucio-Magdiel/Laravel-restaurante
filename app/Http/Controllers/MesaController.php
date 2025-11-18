<?php

namespace App\Http\Controllers;

use App\Models\Mesa;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MesaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Mesa::orderBy('numero')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'numero' => 'required|string|unique:mesas,numero',
            'capacidad' => 'required|integer|min:1',
            'ubicacion' => 'nullable|string',
            'descripcion' => 'nullable|string',
        ]);
        $mesa = Mesa::create($data);
        return response()->json($mesa, 201);
    }

    public function update(Request $request, Mesa $mesa): JsonResponse
    {
        $data = $request->validate([
            'capacidad' => 'sometimes|integer|min:1',
            'estado' => 'sometimes|string',
            'ubicacion' => 'nullable|string',
            'descripcion' => 'nullable|string',
        ]);
        $mesa->update($data);
        return response()->json($mesa);
    }

    public function cambiarEstado(Request $request, Mesa $mesa): JsonResponse
    {
        $request->validate(['estado' => 'required|string']);
        $mesa->estado = $request->estado;
        $mesa->save();
        return response()->json(['ok' => true, 'mesa' => $mesa]);
    }

    public function destroy(Mesa $mesa): JsonResponse
    {
        $mesa->delete();
        return response()->json(['ok' => true]);
    }
}
