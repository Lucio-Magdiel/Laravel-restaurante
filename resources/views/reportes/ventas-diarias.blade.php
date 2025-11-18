<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Ventas Diarias</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
        }
        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        .header p {
            font-size: 14px;
            color: #666;
        }
        .info-section {
            margin-bottom: 20px;
        }
        .info-section h2 {
            font-size: 16px;
            margin-bottom: 10px;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        .stats-grid {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }
        .stat-item {
            display: table-cell;
            width: 25%;
            padding: 15px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            text-align: center;
        }
        .stat-label {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .stat-value {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background: #333;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background: #f9f9f9;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-row {
            font-weight: bold;
            background: #f0f0f0;
            border-top: 2px solid #333;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>REPORTE DE VENTAS DIARIAS</h1>
        <p>Restaurante</p>
        <p>Período: {{ \Carbon\Carbon::parse($fecha_inicio)->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($fecha_fin)->format('d/m/Y') }}</p>
    </div>

    <div class="info-section">
        <h2>Resumen General</h2>
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-label">Total Pedidos</div>
                <div class="stat-value">{{ $totales['cantidad_pedidos'] }}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Total Ventas</div>
                <div class="stat-value">S/. {{ number_format($totales['total_ventas'], 2) }}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Promedio Venta</div>
                <div class="stat-value">S/. {{ number_format($totales['promedio_venta'], 2) }}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Total Items</div>
                <div class="stat-value">{{ $totales['total_items'] }}</div>
            </div>
        </div>
    </div>

    <div class="info-section">
        <h2>Productos Más Vendidos</h2>
        <table>
            <thead>
                <tr>
                    <th style="width: 10%">#</th>
                    <th style="width: 50%">Producto</th>
                    <th style="width: 20%" class="text-center">Cantidad</th>
                    <th style="width: 20%" class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($productosMasVendidos as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item['producto'] }}</td>
                    <td class="text-center">{{ $item['cantidad'] }}</td>
                    <td class="text-right">S/. {{ number_format($item['total'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="page-break"></div>

    <div class="info-section">
        <h2>Detalle de Pedidos</h2>
        <table>
            <thead>
                <tr>
                    <th style="width: 8%">ID</th>
                    <th style="width: 15%">Fecha/Hora</th>
                    <th style="width: 10%">Mesa</th>
                    <th style="width: 25%">Cliente</th>
                    <th style="width: 12%" class="text-center">Items</th>
                    <th style="width: 15%" class="text-right">Total</th>
                    <th style="width: 15%">Método Pago</th>
                </tr>
            </thead>
            <tbody>
                @foreach($pedidos as $pedido)
                <tr>
                    <td>#{{ $pedido->id }}</td>
                    <td>{{ \Carbon\Carbon::parse($pedido->created_at)->format('d/m/Y H:i') }}</td>
                    <td>{{ $pedido->mesa->numero }}</td>
                    <td>{{ $pedido->cliente ? $pedido->cliente->nombre : 'N/A' }}</td>
                    <td class="text-center">{{ $pedido->items->sum('cantidad') }}</td>
                    <td class="text-right">S/. {{ number_format($pedido->total, 2) }}</td>
                    <td>{{ $pedido->pago ? ucfirst($pedido->pago->metodo) : 'N/A' }}</td>
                </tr>
                @endforeach
                <tr class="total-row">
                    <td colspan="4" class="text-right">TOTAL GENERAL:</td>
                    <td class="text-center">{{ $pedidos->sum(fn($p) => $p->items->sum('cantidad')) }}</td>
                    <td class="text-right">S/. {{ number_format($pedidos->sum('total'), 2) }}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>Reporte generado el {{ now()->format('d/m/Y H:i:s') }}</p>
        <p>Sistema de Gestión de Restaurante</p>
    </div>
</body>
</html>
