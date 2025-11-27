<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CocinaController extends Controller
{
    public function index(): Response
    {
        $pedidos = Pedido::with(['items.producto', 'mesa', 'usuario'])
            ->whereIn('estado', ['pendiente', 'en_progreso', 'cancelado'])
            ->where('updated_at', '>=', now()->subHours(12)) // Only show recent orders to avoid clutter
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('cocina/index', [
            'pedidos' => $pedidos,
        ]);
    }

    public function cambiarEstado(Request $request, Pedido $pedido)
    {
        $request->validate(['estado' => 'required|string']);
        
        $pedido->estado = $request->estado;
        if ($request->estado === 'listo') {
            $pedido->hora_entregado = now();
        }
        $pedido->save();

        return back()->with('success', 'Estado actualizado correctamente');
    }

    public function cancelar(Pedido $pedido)
    {
        $pedido->estado = 'cancelado';
        $pedido->save();

        return back()->with('success', 'Pedido cancelado correctamente');
    }
}
