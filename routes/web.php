<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Web\ClienteWebController;
use App\Http\Controllers\Web\MesaWebController;
use App\Http\Controllers\Web\ProductoWebController;
use App\Http\Controllers\Web\PedidoWebController;
use App\Http\Controllers\Web\CocinaController;
use App\Http\Controllers\Web\CajaController;
use App\Http\Controllers\Web\ReservaWebController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $stats = [
            'pedidos_hoy' => \App\Models\Pedido::whereDate('created_at', today())->count(),
            'pedidos_pendientes' => \App\Models\Pedido::whereIn('estado', ['pendiente', 'en_progreso'])->count(),
            'mesas_ocupadas' => \App\Models\Mesa::where('estado', 'ocupada')->count(),
            'total_ventas_hoy' => \App\Models\Pedido::whereDate('created_at', today())->where('estado', 'pagado')->sum('total'),
        ];
        return Inertia::render('dashboard', ['stats' => $stats]);
    })->name('dashboard');

    // Clientes
    Route::get('/clientes', [ClienteWebController::class, 'index'])->name('clientes.index');
    Route::get('/clientes/create', [ClienteWebController::class, 'create'])->name('clientes.create');
    Route::post('/clientes', [ClienteWebController::class, 'store'])->name('clientes.store');

    // Mesas
    Route::get('/mesas', [MesaWebController::class, 'index'])->name('mesas.index');
    Route::get('/mesas/create', [MesaWebController::class, 'create'])->name('mesas.create');
    Route::post('/mesas', [MesaWebController::class, 'store'])->name('mesas.store');

    // Productos
    Route::get('/productos', [ProductoWebController::class, 'index'])->name('productos.index');
    Route::get('/productos/create', [ProductoWebController::class, 'create'])->name('productos.create');
    Route::post('/productos', [ProductoWebController::class, 'store'])->name('productos.store');

    // Pedidos
    Route::get('/pedidos', [PedidoWebController::class, 'index'])->name('pedidos.index');
    Route::get('/pedidos/create', [PedidoWebController::class, 'create'])->name('pedidos.create');
    Route::post('/pedidos', [PedidoWebController::class, 'store'])->name('pedidos.store');
    Route::get('/pedidos/{pedido}', [PedidoWebController::class, 'show'])->name('pedidos.show');

    // Cocina
    Route::get('/cocina', [CocinaController::class, 'index'])->name('cocina.index');
    Route::post('/cocina/{pedido}/estado', [CocinaController::class, 'cambiarEstado'])->name('cocina.cambiarEstado');

    // Caja
    Route::get('/caja', [CajaController::class, 'index'])->name('caja.index');
    Route::post('/caja/{pedido}/pagar', [CajaController::class, 'pagarPedido'])->name('caja.pagarPedido');

    // Reservas
    Route::get('/reservas', [ReservaWebController::class, 'index'])->name('reservas.index');
    Route::get('/reservas/create', [ReservaWebController::class, 'create'])->name('reservas.create');
    Route::post('/reservas', [ReservaWebController::class, 'store'])->name('reservas.store');
    Route::get('/reservas/{reserva}', [ReservaWebController::class, 'show'])->name('reservas.show');
    Route::delete('/reservas/{reserva}', [ReservaWebController::class, 'destroy'])->name('reservas.destroy');
    Route::get('/reservas/calendario/view', [ReservaWebController::class, 'calendario'])->name('reservas.calendario');
    Route::post('/reservas/{reserva}/confirmar', [ReservaWebController::class, 'confirmar'])->name('reservas.confirmar');
    Route::post('/reservas/{reserva}/completar', [ReservaWebController::class, 'completar'])->name('reservas.completar');

    // Reportes
    Route::get('/reportes', [\App\Http\Controllers\Web\ReporteController::class, 'index'])->name('reportes.index');
    Route::get('/reportes/ventas', [\App\Http\Controllers\Web\ReporteController::class, 'ventasDiarias'])->name('reportes.ventas');
    Route::get('/reportes/ventas/pdf', [\App\Http\Controllers\Web\ReporteController::class, 'ventasDiariasPDF'])->name('reportes.ventas.pdf');
    Route::get('/reportes/boleta/{pedido}', [\App\Http\Controllers\Web\ReporteController::class, 'boletaPDF'])->name('reportes.boleta');
});

require __DIR__.'/settings.php';
