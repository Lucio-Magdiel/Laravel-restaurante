<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Mesa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ReporteController extends Controller
{
    public function index()
    {
        return Inertia::render('reportes/index');
    }

    public function ventasDiarias(Request $request)
    {
        $validated = $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);

        $pedidos = Pedido::with(['mesa', 'cliente', 'items.producto'])
            ->whereBetween('created_at', [
                Carbon::parse($validated['fecha_inicio'])->startOfDay(),
                Carbon::parse($validated['fecha_fin'])->endOfDay(),
            ])
            ->where('estado', 'pagado')
            ->orderBy('created_at', 'desc')
            ->get();

        $totales = [
            'cantidad_pedidos' => $pedidos->count(),
            'total_ventas' => $pedidos->sum('total'),
            'promedio_venta' => $pedidos->avg('total'),
            'total_items' => $pedidos->sum(fn($p) => $p->items->sum('cantidad')),
        ];

        // Ventas por día
        $ventasPorDia = $pedidos->groupBy(function ($pedido) {
            return Carbon::parse($pedido->created_at)->format('Y-m-d');
        })->map(function ($pedidos, $fecha) {
            return [
                'fecha' => $fecha,
                'cantidad' => $pedidos->count(),
                'total' => $pedidos->sum('total'),
            ];
        })->values();

        // Productos más vendidos
        $productosMasVendidos = [];
        foreach ($pedidos as $pedido) {
            foreach ($pedido->items as $item) {
                $key = $item->producto_id;
                if (!isset($productosMasVendidos[$key])) {
                    $productosMasVendidos[$key] = [
                        'producto' => $item->producto->nombre,
                        'cantidad' => 0,
                        'total' => 0,
                    ];
                }
                $productosMasVendidos[$key]['cantidad'] += $item->cantidad;
                $productosMasVendidos[$key]['total'] += $item->subtotal;
            }
        }
        $productosMasVendidos = collect($productosMasVendidos)
            ->sortByDesc('cantidad')
            ->take(10)
            ->values();

        return Inertia::render('reportes/ventas', [
            'pedidos' => $pedidos,
            'totales' => $totales,
            'ventasPorDia' => $ventasPorDia,
            'productosMasVendidos' => $productosMasVendidos,
            'filtros' => $validated,
        ]);
    }

    public function ventasDiariasPDF(Request $request)
    {
        $validated = $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);

        $pedidos = Pedido::with(['mesa', 'cliente', 'items.producto', 'pago'])
            ->whereBetween('created_at', [
                Carbon::parse($validated['fecha_inicio'])->startOfDay(),
                Carbon::parse($validated['fecha_fin'])->endOfDay(),
            ])
            ->where('estado', 'pagado')
            ->orderBy('created_at', 'desc')
            ->get();

        $totales = [
            'cantidad_pedidos' => $pedidos->count(),
            'total_ventas' => $pedidos->sum('total'),
            'promedio_venta' => $pedidos->avg('total'),
            'total_items' => $pedidos->sum(fn($p) => $p->items->sum('cantidad')),
        ];

        // Productos más vendidos
        $productosMasVendidos = [];
        foreach ($pedidos as $pedido) {
            foreach ($pedido->items as $item) {
                $key = $item->producto_id;
                if (!isset($productosMasVendidos[$key])) {
                    $productosMasVendidos[$key] = [
                        'producto' => $item->producto->nombre,
                        'cantidad' => 0,
                        'total' => 0,
                    ];
                }
                $productosMasVendidos[$key]['cantidad'] += $item->cantidad;
                $productosMasVendidos[$key]['total'] += $item->subtotal;
            }
        }
        $productosMasVendidos = collect($productosMasVendidos)
            ->sortByDesc('cantidad')
            ->take(10);

        $pdf = Pdf::loadView('reportes.ventas-diarias', [
            'pedidos' => $pedidos,
            'totales' => $totales,
            'productosMasVendidos' => $productosMasVendidos,
            'fecha_inicio' => $validated['fecha_inicio'],
            'fecha_fin' => $validated['fecha_fin'],
        ]);

        $filename = 'ventas-' . $validated['fecha_inicio'] . '-' . $validated['fecha_fin'] . '.pdf';
        
        return $pdf->download($filename);
    }

    public function boletaPDF(Pedido $pedido)
    {
        $pedido->load(['mesa', 'cliente', 'items.producto', 'pago', 'usuario']);

        $pdf = Pdf::loadView('reportes.boleta', [
            'pedido' => $pedido,
        ]);

        $filename = 'boleta-pedido-' . $pedido->id . '.pdf';
        
        return $pdf->download($filename);
    }
}
