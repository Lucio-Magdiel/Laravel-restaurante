<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\Producto;
use App\Models\Pago;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PedidoController extends Controller
{
    public function index(): JsonResponse
    {
        $pedidos = Pedido::with(['items.producto','mesa','cliente'])
            ->orderByDesc('id')
            ->limit(100)
            ->get();
        return response()->json($pedidos);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'mesa_id' => 'nullable|exists:mesas,id',
            'cliente_id' => 'nullable|exists:clientes,id',
            'items' => 'required|array|min:1',
            'items.*.producto_id' => 'required|exists:productos,id',
            'items.*.cantidad' => 'required|integer|min:1',
            'notas' => 'nullable|string',
        ]);

        $pedido = DB::transaction(function () use ($data, $request) {
            $pedido = Pedido::create([
                'mesa_id' => $data['mesa_id'] ?? null,
                'cliente_id' => $data['cliente_id'] ?? null,
                'usuario_id' => $request->user()->id,
                'estado' => 'pendiente',
                'total' => 0,
                'notas' => $data['notas'] ?? null,
            ]);
            $total = 0;
            foreach ($data['items'] as $i) {
                $producto = Producto::findOrFail($i['producto_id']);
                $subtotal = $producto->precio * $i['cantidad'];
                PedidoItem::create([
                    'pedido_id' => $pedido->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $i['cantidad'],
                    'precio_unitario' => $producto->precio,
                    'subtotal' => $subtotal,
                    'estado' => 'pendiente',
                ]);
                $total += $subtotal;
            }
            $pedido->total = $total;
            $pedido->save();
            return $pedido->load(['items.producto']);
        });

        return response()->json($pedido, 201);
    }

    public function show(Pedido $pedido): JsonResponse
    {
        return response()->json($pedido->load(['items.producto','mesa','cliente','pagos']));
    }

    public function cambiarEstado(Request $request, Pedido $pedido): JsonResponse
    {
        $request->validate(['estado' => 'required|string']);
        $pedido->estado = $request->estado;
        if ($request->estado === 'entregado') {
            $pedido->hora_entregado = now();
        }
        $pedido->save();
        return response()->json(['ok' => true, 'pedido' => $pedido]);
    }

    public function agregarItem(Request $request, Pedido $pedido): JsonResponse
    {
        $data = $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:1',
        ]);
        $producto = Producto::findOrFail($data['producto_id']);
        $subtotal = $producto->precio * $data['cantidad'];
        $item = PedidoItem::create([
            'pedido_id' => $pedido->id,
            'producto_id' => $producto->id,
            'cantidad' => $data['cantidad'],
            'precio_unitario' => $producto->precio,
            'subtotal' => $subtotal,
            'estado' => 'pendiente',
        ]);
        $pedido->total += $subtotal;
        $pedido->save();
        return response()->json(['ok' => true, 'item' => $item]);
    }

    public function eliminarItem(Pedido $pedido, PedidoItem $item): JsonResponse
    {
        if ($item->pedido_id !== $pedido->id) {
            abort(422, 'Item no pertenece al pedido');
        }
        $pedido->total -= $item->subtotal;
        $pedido->save();
        $item->delete();
        return response()->json(['ok' => true]);
    }

    public function pdfRecibo(Pedido $pedido): JsonResponse
    {
        // Placeholder: en el futuro integrar DomPDF o Snappy.
        return response()->json([
            'ok' => true,
            'pedido_id' => $pedido->id,
            'mensaje' => 'Generación PDF pendiente de implementar',
        ]);
    }
}
