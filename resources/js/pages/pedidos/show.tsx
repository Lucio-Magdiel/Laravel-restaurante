import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Pedido {
    id: number;
    estado: string;
    total: number;
    notas: string | null;
    created_at: string;
    mesa?: { numero: string };
    cliente?: { nombre: string; email?: string };
    usuario?: { name: string };
    items: Array<{
        id: number;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
        producto?: { nombre: string };
    }>;
    pagos: Array<{
        id: number;
        metodo: string;
        monto: number;
        estado: string;
        recibo_numero: string;
        created_at: string;
    }>;
}

interface Props {
    pedido: Pedido;
}

const estadoColors: Record<string, string> = {
    pendiente: 'bg-yellow-500',
    en_progreso: 'bg-blue-500',
    listo: 'bg-purple-500',
    entregado: 'bg-green-500',
    cancelado: 'bg-red-500',
    pagado: 'bg-gray-500',
};

export default function PedidosShow({ pedido }: Props) {
    return (
        <AppLayout>
            <Head title={`Pedido #${pedido.id}`} />
            <div className="p-6">
                <div className="mx-auto max-w-4xl space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Pedido #{pedido.id}</CardTitle>
                                    <CardDescription>
                                        Creado el {new Date(pedido.created_at).toLocaleString('es-PE')}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Badge className={estadoColors[pedido.estado]}>{pedido.estado}</Badge>
                                    <Link href={`/pedidos/${pedido.id}/edit`}>
                                        <Button size="sm" variant="secondary">
                                            Editar
                                        </Button>
                                    </Link>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => {
                                            if (confirm('¿Estás seguro de eliminar este pedido?')) {
                                                router.delete(`/pedidos/${pedido.id}`);
                                            }
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Mesa</p>
                                    <p className="font-medium">{pedido.mesa?.numero || 'Sin mesa'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Cliente</p>
                                    <p className="font-medium">{pedido.cliente?.nombre || 'Anónimo'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Atendido por</p>
                                    <p className="font-medium">{pedido.usuario?.name || '-'}</p>
                                </div>
                                {pedido.notas && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-muted-foreground">Notas</p>
                                        <p className="font-medium">{pedido.notas}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Items del Pedido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Cantidad</TableHead>
                                        <TableHead>Precio Unit.</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pedido.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.producto?.nombre}</TableCell>
                                            <TableCell>{item.cantidad}</TableCell>
                                            <TableCell>S/ {item.precio_unitario.toFixed(2)}</TableCell>
                                            <TableCell>S/ {item.subtotal.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-right font-bold">
                                            TOTAL:
                                        </TableCell>
                                        <TableCell className="font-bold">S/ {pedido.total.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {pedido.pagos.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Pagos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Recibo</TableHead>
                                            <TableHead>Método</TableHead>
                                            <TableHead>Monto</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Fecha</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pedido.pagos.map((pago) => (
                                            <TableRow key={pago.id}>
                                                <TableCell className="font-mono">{pago.recibo_numero}</TableCell>
                                                <TableCell>{pago.metodo}</TableCell>
                                                <TableCell>S/ {pago.monto.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            pago.estado === 'confirmado' ? 'default' : 'secondary'
                                                        }
                                                    >
                                                        {pago.estado}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(pago.created_at).toLocaleString('es-PE')}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
