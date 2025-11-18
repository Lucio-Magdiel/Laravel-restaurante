<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReservaController extends Controller
{
    public function index(): JsonResponse
    {
        $reservas = Reserva::with(['mesa','cliente'])->orderByDesc('fecha_hora_inicio')->limit(100)->get();
        return response()->json($reservas);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'mesa_id' => 'required|exists:mesas,id',
            'cliente_id' => 'required|exists:clientes,id',
            'fecha_hora_inicio' => 'required|date',
            'fecha_hora_fin' => 'required|date|after:fecha_hora_inicio',
            'notas' => 'nullable|string',
        ]);
        $data['usuario_id'] = $request->user()->id;
        // Validar traslape de reservas para la misma mesa en estados activos
        $overlap = Reserva::where('mesa_id', $data['mesa_id'])
            ->whereIn('estado', ['pendiente','confirmada'])
            ->where(function ($q) use ($data) {
                $q->whereBetween('fecha_hora_inicio', [$data['fecha_hora_inicio'], $data['fecha_hora_fin']])
                  ->orWhereBetween('fecha_hora_fin', [$data['fecha_hora_inicio'], $data['fecha_hora_fin']])
                  ->orWhere(function ($qq) use ($data) {
                      $qq->where('fecha_hora_inicio', '<=', $data['fecha_hora_inicio'])
                         ->where('fecha_hora_fin', '>=', $data['fecha_hora_fin']);
                  });
            })
            ->exists();
        if ($overlap) {
            return response()->json(['error' => 'La mesa ya está reservada en ese horario'], 422);
        }

        $reserva = Reserva::create($data);
        return response()->json($reserva->load(['mesa','cliente']), 201);
    }

    public function cambiarEstado(Request $request, Reserva $reserva): JsonResponse
    {
        $request->validate(['estado' => 'required|string']);
        $reserva->estado = $request->estado;
        $reserva->save();
        return response()->json(['ok' => true, 'reserva' => $reserva]);
    }

    public function destroy(Reserva $reserva): JsonResponse
    {
        $reserva->delete();
        return response()->json(['ok' => true]);
    }
}
