import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClockIcon, CheckCircleIcon, PlayIcon } from 'lucide-react';
import { useState } from 'react';

interface PedidoItem {
    id: number;
    cantidad: number;
    producto?: { nombre: string };
    notas?: string;
}

interface Pedido {
    id: number;
    estado: string;
    created_at: string;
    mesa?: { numero: string };
    usuario?: { name: string };
    notas?: string;
    items: PedidoItem[];
}

interface Props {
    pedidos: Pedido[];
}

export default function CocinaIndex({ pedidos }: Props) {
    const [procesando, setProcesando] = useState<number | null>(null);

    const cambiarEstado = (pedidoId: number, nuevoEstado: string) => {
        setProcesando(pedidoId);
        router.post(
            `/cocina/${pedidoId}/estado`,
            { estado: nuevoEstado },
            {
                preserveScroll: true,
                onFinish: () => setProcesando(null),
            }
        );
    };

    const tiempoTranscurrido = (fecha: string) => {
        const diff = Math.floor((Date.now() - new Date(fecha).getTime()) / 1000 / 60);
        if (diff < 1) return 'Ahora';
        if (diff < 60) return `${diff} min`;
        return `${Math.floor(diff / 60)}h ${diff % 60}m`;
    };

    const pendientes = pedidos.filter((p) => p.estado === 'pendiente');
    const enProgreso = pedidos.filter((p) => p.estado === 'en_progreso');

    return (
        <AppLayout>
            <Head title="Cocina" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Panel de Cocina</h1>
                        <p className="text-muted-foreground">
                            {pendientes.length} pendientes • {enProgreso.length} en preparación
                        </p>
                    </div>
                    <Button onClick={() => router.reload({ only: ['pedidos'] })} variant="outline">
                        Actualizar
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Pedidos Pendientes */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Pendientes</h2>
                        {pendientes.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6 text-center text-muted-foreground">
                                    No hay pedidos pendientes
                                </CardContent>
                            </Card>
                        ) : (
                            pendientes.map((pedido) => (
                                <Card key={pedido.id} className="border-yellow-500">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    Pedido #{pedido.id}
                                                    <Badge variant="secondary">{pedido.mesa?.numero || 'Sin mesa'}</Badge>
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-2 mt-1">
                                                    <ClockIcon className="h-3 w-3" />
                                                    {tiempoTranscurrido(pedido.created_at)}
                                                </CardDescription>
                                            </div>
                                            <Badge className="bg-yellow-500">Pendiente</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            {pedido.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex justify-between items-start border-b pb-2"
                                                >
                                                    <div>
                                                        <span className="font-medium">
                                                            {item.cantidad}x {item.producto?.nombre}
                                                        </span>
                                                        {item.notas && (
                                                            <p className="text-sm text-muted-foreground">
                                                                Nota: {item.notas}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {pedido.notas && (
                                            <div className="rounded-md bg-muted p-3">
                                                <p className="text-sm">
                                                    <strong>Instrucciones:</strong> {pedido.notas}
                                                </p>
                                            </div>
                                        )}
                                        <Button
                                            className="w-full"
                                            onClick={() => cambiarEstado(pedido.id, 'en_progreso')}
                                            disabled={procesando === pedido.id}
                                        >
                                            <PlayIcon className="mr-2 h-4 w-4" />
                                            Comenzar a Preparar
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Pedidos En Progreso */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">En Preparación</h2>
                        {enProgreso.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6 text-center text-muted-foreground">
                                    No hay pedidos en preparación
                                </CardContent>
                            </Card>
                        ) : (
                            enProgreso.map((pedido) => (
                                <Card key={pedido.id} className="border-blue-500">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    Pedido #{pedido.id}
                                                    <Badge variant="secondary">{pedido.mesa?.numero || 'Sin mesa'}</Badge>
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-2 mt-1">
                                                    <ClockIcon className="h-3 w-3" />
                                                    {tiempoTranscurrido(pedido.created_at)}
                                                </CardDescription>
                                            </div>
                                            <Badge className="bg-blue-500">En Preparación</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            {pedido.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex justify-between items-start border-b pb-2"
                                                >
                                                    <div>
                                                        <span className="font-medium">
                                                            {item.cantidad}x {item.producto?.nombre}
                                                        </span>
                                                        {item.notas && (
                                                            <p className="text-sm text-muted-foreground">
                                                                Nota: {item.notas}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {pedido.notas && (
                                            <div className="rounded-md bg-muted p-3">
                                                <p className="text-sm">
                                                    <strong>Instrucciones:</strong> {pedido.notas}
                                                </p>
                                            </div>
                                        )}
                                        <Button
                                            className="w-full"
                                            variant="default"
                                            onClick={() => cambiarEstado(pedido.id, 'listo')}
                                            disabled={procesando === pedido.id}
                                        >
                                            <CheckCircleIcon className="mr-2 h-4 w-4" />
                                            Marcar como Listo
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
