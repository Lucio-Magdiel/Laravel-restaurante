import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Mesa {
    id: number;
    numero: string;
    capacidad: number;
    estado: string;
}

interface Cliente {
    id: number;
    nombre: string;
    telefono: string;
}

interface Reserva {
    id: number;
    mesa_id: number;
    cliente_id: number;
    fecha_hora_inicio: string;
    fecha_hora_fin: string;
    numero_personas: number;
    estado: string;
    notas: string | null;
    created_at: string;
    mesa: Mesa;
    cliente: Cliente;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ReservasData {
    data: Reserva[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Props {
    reservas: ReservasData;
    filters: {
        fecha?: string;
        estado?: string;
    };
}

export default function ReservasIndex({ reservas, filters }: Props) {
    const [fecha, setFecha] = useState(filters.fecha || '');
    const [estado, setEstado] = useState(filters.estado || '');

    const handleFilter = () => {
        router.get('/reservas', { fecha, estado }, { preserveState: true });
    };

    const handleClearFilters = () => {
        setFecha('');
        setEstado('');
        router.get('/reservas');
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de cancelar esta reserva?')) {
            router.delete(`/reservas/${id}`);
        }
    };

    const handleConfirmar = (id: number) => {
        router.post(`/reservas/${id}/confirmar`);
    };

    const handleCompletar = (id: number) => {
        router.post(`/reservas/${id}/completar`);
    };

    const getEstadoBadge = (estado: string) => {
        const badges = {
            pendiente: <Badge variant="outline" className="bg-yellow-50">Pendiente</Badge>,
            confirmada: <Badge variant="outline" className="bg-blue-50">Confirmada</Badge>,
            completada: <Badge variant="outline" className="bg-green-50">Completada</Badge>,
            cancelada: <Badge variant="outline" className="bg-red-50">Cancelada</Badge>,
        };
        return badges[estado as keyof typeof badges] || <Badge>{estado}</Badge>;
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
            <Head title="Reservas" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Reservas</h1>
                        <p className="text-muted-foreground">Gestiona las reservas de mesas</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/reservas/calendario/view">
                            <Button variant="outline">
                                <Calendar className="mr-2 h-4 w-4" />
                                Vista Calendario
                            </Button>
                        </Link>
                        <Link href="/reservas/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nueva Reserva
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="text-sm font-medium mb-2 block">Fecha</label>
                                <Input
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-medium mb-2 block">Estado</label>
                                <Select value={estado || undefined} onValueChange={setEstado}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pendiente">Pendiente</SelectItem>
                                        <SelectItem value="confirmada">Confirmada</SelectItem>
                                        <SelectItem value="completada">Completada</SelectItem>
                                        <SelectItem value="cancelada">Cancelada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleFilter}>Filtrar</Button>
                            <Button variant="outline" onClick={handleClearFilters}>
                                Limpiar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Mesa</TableHead>
                                    <TableHead>Fecha/Hora Inicio</TableHead>
                                    <TableHead>Fecha/Hora Fin</TableHead>
                                    <TableHead>Personas</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reservas.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                            No hay reservas registradas
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reservas.data.map((reserva) => (
                                        <TableRow key={reserva.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{reserva.cliente.nombre}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {reserva.cliente.telefono}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                Mesa {reserva.mesa.numero}
                                                <div className="text-sm text-muted-foreground">
                                                    Cap. {reserva.mesa.capacidad}
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatFecha(reserva.fecha_hora_inicio)}</TableCell>
                                            <TableCell>{formatFecha(reserva.fecha_hora_fin)}</TableCell>
                                            <TableCell>{reserva.numero_personas}</TableCell>
                                            <TableCell>{getEstadoBadge(reserva.estado)}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Link href={`/reservas/${reserva.id}`}>
                                                        <Button size="sm" variant="outline">
                                                            Ver
                                                        </Button>
                                                    </Link>
                                                    {reserva.estado === 'pendiente' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleConfirmar(reserva.id)}
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {reserva.estado === 'confirmada' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleCompletar(reserva.id)}
                                                        >
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                        </Button>
                                                    )}
                                                    {reserva.estado !== 'cancelada' && reserva.estado !== 'completada' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDelete(reserva.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {reservas.last_page > 1 && (
                            <div className="flex justify-center gap-2 p-4 border-t">
                                {reservas.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
