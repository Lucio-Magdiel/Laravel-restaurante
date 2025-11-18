<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\Mesa;
use App\Models\Cliente;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PedidoWebController extends Controller
{
    public function index(): Response
    {
        $pedidos = Pedido::with(['items.producto', 'mesa', 'cliente', 'usuario'])
            ->orderByDesc('id')
            ->paginate(20);

        return Inertia::render('pedidos/index', [
            'pedidos' => $pedidos,
        ]);
    }

    public function create(): Response
    {
        $mesas = Mesa::where('estado', 'disponible')->orderBy('numero')->get();
        $clientes = Cliente::orderBy('nombre')->limit(100)->get();
        $productos = Producto::with('categoria')->where('activo', true)->orderBy('nombre')->get();

        return Inertia::render('pedidos/create', [
            'mesas' => $mesas,
            'clientes' => $clientes,
            'productos' => $productos,
        ]);
    }

    public function store(Request $request)
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
            return $pedido;
        });

        return redirect()->route('pedidos.show', $pedido->id)->with('success', 'Pedido creado correctamente');
    }

    public function show(Pedido $pedido): Response
    {
        $pedido->load(['items.producto', 'mesa', 'cliente', 'usuario', 'pagos']);
        return Inertia::render('pedidos/show', [
            'pedido' => $pedido,
        ]);
    }
}
