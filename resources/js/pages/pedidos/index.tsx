import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusIcon } from 'lucide-react';

interface Pedido {
    id: number;
    estado: string;
    total: number;
    mesa?: { numero: string };
    cliente?: { nombre: string };
    created_at: string;
}

interface Props {
    pedidos: {
        data: Pedido[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

const estadoColors: Record<string, string> = {
    pendiente: 'bg-yellow-500',
    en_progreso: 'bg-blue-500',
    listo: 'bg-purple-500',
    entregado: 'bg-green-500',
    cancelado: 'bg-red-500',
    pagado: 'bg-gray-500',
};

export default function PedidosIndex({ pedidos }: Props) {
    return (
        <AppLayout>
            <Head title="Pedidos" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Pedidos</h1>
                    <Link href="/pedidos/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Nuevo Pedido
                        </Button>
                    </Link>
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
                                <TableHead>Fecha</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pedidos.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No hay pedidos registrados
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
                                            <Badge className={estadoColors[pedido.estado]}>{pedido.estado}</Badge>
                                        </TableCell>
                                        <TableCell>{new Date(pedido.created_at).toLocaleString('es-PE')}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Link href={`/pedidos/${pedido.id}`}>
                                                    <Button size="sm" variant="outline">
                                                        Ver
                                                    </Button>
                                                </Link>
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
