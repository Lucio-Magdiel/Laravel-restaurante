<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use App\Models\Pago;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CajaController extends Controller
{
    public function index(): Response
    {
        $pedidos = Pedido::with(['items.producto', 'mesa', 'cliente', 'pagos'])
            ->whereIn('estado', ['listo', 'entregado'])
            ->orderByDesc('id')
            ->paginate(20);

        return Inertia::render('caja/index', [
            'pedidos' => $pedidos,
        ]);
    }

    public function pagarPedido(Request $request, Pedido $pedido)
    {
        $data = $request->validate([
            'metodo' => 'required|string',
        ]);

        if ($pedido->estado === 'pagado') {
            return back()->with('error', 'El pedido ya fue pagado');
        }

        $pago = Pago::create([
            'pedido_id' => $pedido->id,
            'usuario_id' => $request->user()->id,
            'metodo' => $data['metodo'],
            'monto' => $pedido->total,
            'estado' => 'confirmado',
            'recibo_numero' => 'R-' . Str::upper(Str::random(8)),
            'recibido_en' => now(),
            'detalles' => ['simulado' => true],
        ]);

        $pedido->estado = 'pagado';
        $pedido->hora_pagado = now();
        $pedido->save();

        if ($pedido->mesa_id) {
            $mesa = $pedido->mesa;
            if ($mesa) {
                $mesa->estado = 'disponible';
                $mesa->save();
            }
        }

        return back()->with('success', 'Pago registrado correctamente. Recibo: ' . $pago->recibo_numero);
    }
}
