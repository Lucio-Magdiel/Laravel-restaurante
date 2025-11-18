import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download, Calendar, TrendingUp, Package } from 'lucide-react';
import { useState } from 'react';

export default function ReportesIndex() {
    const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
    const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);

    const handleVerReporte = () => {
        router.get('/reportes/ventas', { fecha_inicio: fechaInicio, fecha_fin: fechaFin });
    };

    const handleDescargarPDF = () => {
        window.location.href = `/reportes/ventas/pdf?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
    };

    return (
        <AppLayout>
            <Head title="Reportes" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Reportes</h1>
                    <p className="text-muted-foreground">Genera reportes de ventas y consumo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                <CardTitle>Reporte de Ventas Diarias</CardTitle>
                            </div>
                            <CardDescription>
                                Analiza las ventas por período con desglose detallado
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                                    <Input
                                        id="fecha_inicio"
                                        type="date"
                                        value={fechaInicio}
                                        onChange={(e) => setFechaInicio(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fecha_fin">Fecha Fin</Label>
                                    <Input
                                        id="fecha_fin"
                                        type="date"
                                        value={fechaFin}
                                        onChange={(e) => setFechaFin(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleVerReporte} className="flex-1">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Ver Reporte
                                    </Button>
                                    <Button onClick={handleDescargarPDF} variant="outline">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                <CardTitle>Productos Más Vendidos</CardTitle>
                            </div>
                            <CardDescription>
                                Conoce los productos con mayor demanda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Este reporte está incluido en el reporte de ventas diarias.
                            </p>
                            <Button onClick={handleVerReporte} variant="outline" className="w-full">
                                <FileText className="mr-2 h-4 w-4" />
                                Ver en Ventas
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <CardTitle>Resumen del Día</CardTitle>
                            </div>
                            <CardDescription>
                                Obtén el reporte de ventas del día actual
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm font-medium mb-1">Fecha:</p>
                                    <p className="text-2xl font-bold">
                                        {new Date().toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => {
                                            const hoy = new Date().toISOString().split('T')[0];
                                            setFechaInicio(hoy);
                                            setFechaFin(hoy);
                                            router.get('/reportes/ventas', {
                                                fecha_inicio: hoy,
                                                fecha_fin: hoy,
                                            });
                                        }}
                                        className="flex-1"
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        Ver Hoy
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            const hoy = new Date().toISOString().split('T')[0];
                                            window.location.href = `/reportes/ventas/pdf?fecha_inicio=${hoy}&fecha_fin=${hoy}`;
                                        }}
                                        variant="outline"
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información de Reportes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Reporte de Ventas Diarias</h3>
                                <p className="text-sm text-muted-foreground">
                                    Incluye resumen general de ventas, productos más vendidos, detalle de todos los
                                    pedidos pagados con información de mesa, cliente, método de pago y totales.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Boletas de Venta</h3>
                                <p className="text-sm text-muted-foreground">
                                    Las boletas individuales se generan automáticamente desde el panel de Caja al
                                    procesar un pago. También puedes descargarlas desde el detalle de cada pedido.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Formatos Disponibles</h3>
                                <p className="text-sm text-muted-foreground">
                                    • PDF para impresión y archivo
                                    <br />
                                    • Vista web interactiva con gráficos y filtros
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
