<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boleta de Venta #{{ $pedido->id }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            padding: 20px;
            max-width: 300px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px dashed #000;
            padding-bottom: 15px;
        }
        .header h1 {
            font-size: 18px;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .header p {
            font-size: 11px;
            margin: 2px 0;
        }
        .section {
            margin-bottom: 15px;
        }
        .section-title {
            font-weight: bold;
            margin-bottom: 5px;
            text-transform: uppercase;
            font-size: 11px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
            font-size: 11px;
        }
        .info-label {
            font-weight: bold;
        }
        table {
            width: 100%;
            margin: 10px 0;
            border-collapse: collapse;
        }
        th {
            border-bottom: 1px solid #000;
            padding: 5px 0;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
        }
        td {
            padding: 5px 0;
            font-size: 11px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .items-table {
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
            padding: 10px 0;
        }
        .total-section {
            margin-top: 15px;
            border-top: 2px solid #000;
            padding-top: 10px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            font-size: 12px;
        }
        .total-row.grand {
            font-size: 14px;
            font-weight: bold;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px dashed #000;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
            border-top: 2px dashed #000;
            padding-top: 15px;
        }
        .footer p {
            margin: 3px 0;
        }
        .barcode {
            text-align: center;
            font-family: 'Courier New', monospace;
            font-size: 24px;
            letter-spacing: 2px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>RESTAURANTE</h1>
        <p>RUC: 20123456789</p>
        <p>Av. Principal 123</p>
        <p>Tel: (01) 234-5678</p>
        <p style="margin-top: 10px; font-weight: bold;">BOLETA DE VENTA</p>
        <p style="font-size: 13px; font-weight: bold;">{{ $pedido->pago ? $pedido->pago->recibo_numero : 'N/A' }}</p>
    </div>

    <div class="section">
        <div class="info-row">
            <span class="info-label">Fecha:</span>
            <span>{{ \Carbon\Carbon::parse($pedido->created_at)->format('d/m/Y H:i') }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Pedido N°:</span>
            <span>#{{ $pedido->id }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Mesa:</span>
            <span>{{ $pedido->mesa->numero }}</span>
        </div>
        @if($pedido->cliente)
        <div class="info-row">
            <span class="info-label">Cliente:</span>
            <span>{{ $pedido->cliente->nombre }}</span>
        </div>
        @endif
        <div class="info-row">
            <span class="info-label">Atendido por:</span>
            <span>{{ $pedido->usuario->name }}</span>
        </div>
    </div>

    <div class="items-table">
        <table>
            <thead>
                <tr>
                    <th style="width: 50%">PRODUCTO</th>
                    <th style="width: 15%" class="text-center">CANT</th>
                    <th style="width: 15%" class="text-right">P.U.</th>
                    <th style="width: 20%" class="text-right">SUBTOTAL</th>
                </tr>
            </thead>
            <tbody>
                @foreach($pedido->items as $item)
                <tr>
                    <td>{{ $item->producto->nombre }}</td>
                    <td class="text-center">{{ $item->cantidad }}</td>
                    <td class="text-right">{{ number_format($item->precio_unitario, 2) }}</td>
                    <td class="text-right">{{ number_format($item->subtotal, 2) }}</td>
                </tr>
                @if($item->notas)
                <tr>
                    <td colspan="4" style="font-size: 10px; font-style: italic; padding-left: 10px;">
                        * {{ $item->notas }}
                    </td>
                </tr>
                @endif
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="total-section">
        <div class="total-row">
            <span>Subtotal:</span>
            <span>S/. {{ number_format($pedido->subtotal, 2) }}</span>
        </div>
        <div class="total-row">
            <span>IGV (18%):</span>
            <span>S/. {{ number_format($pedido->impuestos, 2) }}</span>
        </div>
        <div class="total-row grand">
            <span>TOTAL:</span>
            <span>S/. {{ number_format($pedido->total, 2) }}</span>
        </div>
    </div>

    @if($pedido->pago)
    <div class="section" style="margin-top: 15px;">
        <div class="section-title">Información de Pago</div>
        <div class="info-row">
            <span class="info-label">Método:</span>
            <span>{{ ucfirst($pedido->pago->metodo) }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Fecha Pago:</span>
            <span>{{ \Carbon\Carbon::parse($pedido->pago->created_at)->format('d/m/Y H:i') }}</span>
        </div>
    </div>
    @endif

    @if($pedido->notas)
    <div class="section">
        <div class="section-title">Notas:</div>
        <p style="font-size: 10px;">{{ $pedido->notas }}</p>
    </div>
    @endif

    <div class="barcode">
        *{{ str_pad($pedido->id, 8, '0', STR_PAD_LEFT) }}*
    </div>

    <div class="footer">
        <p>¡GRACIAS POR SU PREFERENCIA!</p>
        <p>Vuelva Pronto</p>
        <p style="margin-top: 10px;">{{ now()->format('d/m/Y H:i:s') }}</p>
    </div>
</body>
</html>
