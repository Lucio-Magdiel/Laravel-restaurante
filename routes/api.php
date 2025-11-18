<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MesaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\ClienteController;

Route::middleware(['auth'])->group(function () {
    // Mesas
    Route::get('/mesas', [MesaController::class, 'index']);
    Route::post('/mesas', [MesaController::class, 'store'])->middleware('role:admin');
    Route::put('/mesas/{mesa}', [MesaController::class, 'update'])->middleware('role:admin');
    Route::delete('/mesas/{mesa}', [MesaController::class, 'destroy'])->middleware('role:admin');
    Route::post('/mesas/{mesa}/estado', [MesaController::class, 'cambiarEstado'])->middleware('role:admin,mesero');

    // Productos
    Route::get('/productos', [ProductoController::class, 'index']);
    Route::post('/productos', [ProductoController::class, 'store'])->middleware('role:admin');
    Route::put('/productos/{producto}', [ProductoController::class, 'update'])->middleware('role:admin');
    Route::delete('/productos/{producto}', [ProductoController::class, 'destroy'])->middleware('role:admin');

    // Pedidos
    Route::get('/pedidos', [PedidoController::class, 'index']);
    Route::post('/pedidos', [PedidoController::class, 'store'])->middleware('role:mesero,admin');
    Route::get('/pedidos/{pedido}', [PedidoController::class, 'show']);
    Route::post('/pedidos/{pedido}/estado', [PedidoController::class, 'cambiarEstado'])->middleware('role:cocina,mesero,admin');
    Route::post('/pedidos/{pedido}/items', [PedidoController::class, 'agregarItem'])->middleware('role:mesero,admin');
    Route::delete('/pedidos/{pedido}/items/{item}', [PedidoController::class, 'eliminarItem'])->middleware('role:mesero,admin');
    Route::post('/pedidos/{pedido}/pagar', [PagoController::class, 'pagarSimulado'])->middleware('role:caja,admin');
    Route::get('/pedidos/{pedido}/pdf', [PedidoController::class, 'pdfRecibo'])->middleware('role:caja,admin');

    // Reservas
    Route::get('/reservas', [ReservaController::class, 'index']);
    Route::post('/reservas', [ReservaController::class, 'store'])->middleware('role:mesero,admin');
    Route::post('/reservas/{reserva}/estado', [ReservaController::class, 'cambiarEstado'])->middleware('role:mesero,admin');
    Route::delete('/reservas/{reserva}', [ReservaController::class, 'destroy'])->middleware('role:admin');

    // Reportes
    Route::get('/reportes/ventas', [ReporteController::class, 'ventasDiarias'])->middleware('role:caja,admin');

    // Clientes
    Route::get('/clientes', [ClienteController::class, 'index']);
    Route::post('/clientes', [ClienteController::class, 'store'])->middleware('role:mesero,admin');
    Route::get('/clientes/{cliente}', [ClienteController::class, 'show']);
    Route::put('/clientes/{cliente}', [ClienteController::class, 'update'])->middleware('role:mesero,admin');
    Route::delete('/clientes/{cliente}', [ClienteController::class, 'destroy'])->middleware('role:admin');
});
