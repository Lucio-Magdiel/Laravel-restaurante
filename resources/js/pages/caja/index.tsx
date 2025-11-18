import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CreditCardIcon, DollarSignIcon } from 'lucide-react';
import { useState } from 'react';

interface Pago {
    id: number;
    metodo: string;
    monto: number;
    recibo_numero: string;
}

interface Pedido {
    id: number;
    estado: string;
    total: number;
    created_at: string;
    mesa?: { numero: string };
    cliente?: { nombre: string };
    items: Array<{
        id: number;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
        producto?: { nombre: string };
    }>;
    pagos: Pago[];
}

interface Props {
    pedidos: {
        data: Pedido[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function CajaIndex({ pedidos }: Props) {
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
    const { data, setData, post, processing, reset } = useForm({
        metodo: 'simulacion',
    });

    const handlePagar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pedidoSeleccionado) return;

        post(`/caja/${pedidoSeleccionado.id}/pagar`, {
            preserveScroll: true,
            onSuccess: () => {
                setPedidoSeleccionado(null);
                reset();
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Caja" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Panel de Caja</h1>
                    <p className="text-muted-foreground">Gestiona los pagos de los pedidos listos</p>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Mesa</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pedidos.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No hay pedidos listos para cobrar
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pedidos.data.map((pedido) => (
                                    <TableRow key={pedido.id}>
                                        <TableCell className="font-medium">#{pedido.id}</TableCell>
                                        <TableCell>{pedido.mesa?.numero || '-'}</TableCell>
                                        <TableCell>{pedido.cliente?.nombre || '-'}</TableCell>
                                        <TableCell>S/ {pedido.total.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    pedido.estado === 'pagado' ? 'bg-gray-500' : 'bg-green-500'
                                                }
                                            >
                                                {pedido.estado}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {pedido.estado === 'pagado' ? (
                                                <span className="text-sm text-muted-foreground">
                                                    Pagado - {pedido.pagos[0]?.recibo_numero}
                                                </span>
                                            ) : (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => setPedidoSeleccionado(pedido)}
                                                        >
                                                            <CreditCardIcon className="mr-2 h-4 w-4" />
                                                            Cobrar
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Procesar Pago - Pedido #{pedido.id}</DialogTitle>
                                                            <DialogDescription>
                                                                Mesa: {pedido.mesa?.numero || 'Sin mesa'}
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        <div className="space-y-4">
                                                            <div className="rounded-lg border p-4">
                                                                <h3 className="font-semibold mb-2">Detalle del Pedido</h3>
                                                                {pedido.items.map((item) => (
                                                                    <div
                                                                        key={item.id}
                                                                        className="flex justify-between text-sm"
                                                                    >
                                                                        <span>
                                                                            {item.cantidad}x {item.producto?.nombre}
                                                                        </span>
                                                                        <span>S/ {item.subtotal.toFixed(2)}</span>
                                                                    </div>
                                                                ))}
                                                                <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                                                                    <span>TOTAL:</span>
                                                                    <span>S/ {pedido.total.toFixed(2)}</span>
                                                                </div>
                                                            </div>

                                                            <form onSubmit={handlePagar} className="space-y-4">
                                                                <div>
                                                                    <Label htmlFor="metodo">Método de Pago</Label>
                                                                    <Select
                                                                        value={data.metodo}
                                                                        onValueChange={(val) => setData('metodo', val)}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="simulacion">
                                                                                Simulación (Demo)
                                                                            </SelectItem>
                                                                            <SelectItem value="efectivo">
                                                                                Efectivo
                                                                            </SelectItem>
                                                                            <SelectItem value="tarjeta">
                                                                                Tarjeta
                                                                            </SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>

                                                                <Button type="submit" className="w-full" disabled={processing}>
                                                                    <DollarSignIcon className="mr-2 h-4 w-4" />
                                                                    {processing ? 'Procesando...' : 'Confirmar Pago'}
                                                                </Button>
                                                            </form>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {pedidos.last_page > 1 && (
                    <div className="mt-4 flex justify-center gap-2">
                        {pedidos.links.map((link, idx) => (
                            <Button
                                key={idx}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
