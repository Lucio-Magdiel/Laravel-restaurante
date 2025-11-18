import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, TrendingUp, ShoppingCart, DollarSign, Package } from 'lucide-react';

interface Pedido {
    id: number;
    mesa: { numero: string };
    cliente: { nombre: string } | null;
    created_at: string;
    total: number;
    items: { cantidad: number }[];
    pago: { metodo: string } | null;
}

interface Totales {
    cantidad_pedidos: number;
    total_ventas: number;
    promedio_venta: number;
    total_items: number;
}

interface VentaPorDia {
    fecha: string;
    cantidad: number;
    total: number;
}

interface ProductoMasVendido {
    producto: string;
    cantidad: number;
    total: number;
}

interface Props {
    pedidos: Pedido[];
    totales: Totales;
    ventasPorDia: VentaPorDia[];
    productosMasVendidos: ProductoMasVendido[];
    filtros: {
        fecha_inicio: string;
        fecha_fin: string;
    };
}

export default function ReportesVentas({ pedidos, totales, ventasPorDia, productosMasVendidos, filtros }: Props) {
    const handleDescargarPDF = () => {
        window.location.href = `/reportes/ventas/pdf?fecha_inicio=${filtros.fecha_inicio}&fecha_fin=${filtros.fecha_fin}`;
    };

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout>
            <Head title="Reporte de Ventas" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/reportes">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Reporte de Ventas</h1>
                            <p className="text-muted-foreground">
                                {new Date(filtros.fecha_inicio).toLocaleDateString('es-ES')} -{' '}
                                {new Date(filtros.fecha_fin).toLocaleDateString('es-ES')}
                            </p>
                        </div>
                    </div>
                    <Button onClick={handleDescargarPDF}>
                        <Download className="mr-2 h-4 w-4" />
                        Descargar PDF
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totales.cantidad_pedidos || 0}</div>
                            <p className="text-xs text-muted-foreground">Pedidos completados</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">S/. {(totales.total_ventas || 0).toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Ingresos totales</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Promedio Venta</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">S/. {(totales.promedio_venta || 0).toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Por pedido</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totales.total_items || 0}</div>
                            <p className="text-xs text-muted-foreground">Productos vendidos</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Productos Más Vendidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="text-center">Cantidad</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productosMasVendidos.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                No hay datos disponibles
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        productosMasVendidos.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="font-medium">{item.producto}</TableCell>
                                                <TableCell className="text-center">{item.cantidad}</TableCell>
                                                <TableCell className="text-right">
                                                    S/. {(item.total || 0).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ventas por Día</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead className="text-center">Pedidos</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ventasPorDia.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                                                No hay datos disponibles
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        ventasPorDia.map((venta, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {new Date(venta.fecha).toLocaleDateString('es-ES')}
                                                </TableCell>
                                                <TableCell className="text-center">{venta.cantidad}</TableCell>
                                                <TableCell className="text-right">
                                                    S/. {(venta.total || 0).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Detalle de Pedidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Fecha/Hora</TableHead>
                                    <TableHead>Mesa</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead className="text-center">Items</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Método Pago</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pedidos.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                            No hay pedidos en este período
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pedidos.map((pedido) => (
                                        <TableRow key={pedido.id}>
                                            <TableCell>#{pedido.id}</TableCell>
                                            <TableCell>{formatFecha(pedido.created_at)}</TableCell>
                                            <TableCell>{pedido.mesa.numero}</TableCell>
                                            <TableCell>{pedido.cliente?.nombre || 'N/A'}</TableCell>
                                            <TableCell className="text-center">
                                                {pedido.items.reduce((sum, item) => sum + item.cantidad, 0)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                S/. {(pedido.total || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                {pedido.pago ? pedido.pago.metodo : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <a
                                                    href={`/reportes/boleta/${pedido.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button size="sm" variant="outline">
                                                        <Download className="h-3 w-3 mr-1" />
                                                        Boleta
                                                    </Button>
                                                </a>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
