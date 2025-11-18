<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\Pago;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PagoController extends Controller
{
    public function pagarSimulado(Request $request, Pedido $pedido): JsonResponse
    {
        $data = $request->validate([
            'metodo' => 'nullable|string',
        ]);
        if ($pedido->estado !== 'entregado' && $pedido->estado !== 'listo') {
            return response()->json(['error' => 'Pedido no está listo para pagar'], 422);
        }
        $pago = Pago::create([
            'pedido_id' => $pedido->id,
            'usuario_id' => $request->user()->id,
            'metodo' => $data['metodo'] ?? 'simulacion',
            'monto' => $pedido->total,
            'estado' => 'confirmado',
            'recibo_numero' => 'R-'.Str::upper(Str::random(8)),
            'recibido_en' => now(),
            'detalles' => ['simulado' => true],
        ]);
        $pedido->estado = 'pagado';
        $pedido->hora_pagado = now();
        $pedido->save();
        return response()->json(['ok' => true, 'pago' => $pago]);
    }
}
