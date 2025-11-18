<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\PedidoItem;
use Illuminate\Support\Facades\DB;

class ReporteController extends Controller
{
    public function ventasDiarias(Request $request): JsonResponse
    {
        $fecha = $request->query('fecha');
        $fecha = $fecha ? date('Y-m-d', strtotime($fecha)) : date('Y-m-d');
        $inicio = $fecha.' 00:00:00';
        $fin = $fecha.' 23:59:59';

        $ventas = Pedido::whereBetween('created_at', [$inicio, $fin])
            ->where('estado', 'pagado')
            ->sum('total');

        $consumoPorProducto = PedidoItem::select('producto_id', DB::raw('SUM(cantidad) as total_cantidad'), DB::raw('SUM(subtotal) as total_importe'))
            ->whereBetween('created_at', [$inicio, $fin])
            ->groupBy('producto_id')
            ->with('producto')
            ->orderByDesc('total_cantidad')
            ->get();

        return response()->json([
            'fecha' => $fecha,
            'ventas_total' => $ventas,
            'consumo_productos' => $consumoPorProducto,
        ]);
    }
}
