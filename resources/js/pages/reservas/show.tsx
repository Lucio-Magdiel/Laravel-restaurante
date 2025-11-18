import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Users, MapPin, Phone, Mail, FileText, Trash2, CheckCircle } from 'lucide-react';

interface Mesa {
    id: number;
    numero: string;
    capacidad: number;
    estado: string;
    ubicacion: string | null;
}

interface Cliente {
    id: number;
    nombre: string;
    telefono: string;
    email: string | null;
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
    updated_at: string;
    mesa: Mesa;
    cliente: Cliente;
}

interface Props {
    reserva: Reserva;
}

export default function ReservasShow({ reserva }: Props) {
    const handleDelete = () => {
        if (confirm('¿Estás seguro de cancelar esta reserva?')) {
            router.delete(`/reservas/${reserva.id}`);
        }
    };

    const handleConfirmar = () => {
        router.post(`/reservas/${reserva.id}/confirmar`);
    };

    const handleCompletar = () => {
        router.post(`/reservas/${reserva.id}/completar`);
    };

    const getEstadoBadge = (estado: string) => {
        const badges = {
            pendiente: <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pendiente</Badge>,
            confirmada: <Badge variant="outline" className="bg-blue-50 text-blue-700">Confirmada</Badge>,
            completada: <Badge variant="outline" className="bg-green-50 text-green-700">Completada</Badge>,
            cancelada: <Badge variant="outline" className="bg-red-50 text-red-700">Cancelada</Badge>,
        };
        return badges[estado as keyof typeof badges] || <Badge>{estado}</Badge>;
    };

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleString('es-ES', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const calcularDuracion = () => {
        const inicio = new Date(reserva.fecha_hora_inicio);
        const fin = new Date(reserva.fecha_hora_fin);
        const diff = fin.getTime() - inicio.getTime();
        const horas = Math.floor(diff / (1000 * 60 * 60));
        const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${horas}h ${minutos}min`;
    };

    return (
        <AppLayout>
            <Head title={`Reserva #${reserva.id}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/reservas">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Reserva #{reserva.id}</h1>
                            <p className="text-muted-foreground">
                                Creada el {new Date(reserva.created_at).toLocaleDateString('es-ES')}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {reserva.estado === 'pendiente' && (
                            <Button variant="outline" onClick={handleConfirmar}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Confirmar
                            </Button>
                        )}
                        {reserva.estado === 'confirmada' && (
                            <Button variant="outline" onClick={handleCompletar}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                Completar
                            </Button>
                        )}
                        {reserva.estado !== 'cancelada' && reserva.estado !== 'completada' && (
                            <Button variant="destructive" onClick={handleDelete}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancelar Reserva
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Detalles de la Reserva</CardTitle>
                                    {getEstadoBadge(reserva.estado)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Fecha y Hora</p>
                                            <p className="font-medium capitalize">{formatFecha(reserva.fecha_hora_inicio)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Duración</p>
                                            <p className="font-medium">{calcularDuracion()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Número de Personas</p>
                                            <p className="font-medium">{reserva.numero_personas} personas</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Mesa</p>
                                            <p className="font-medium">Mesa {reserva.mesa.numero}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Capacidad: {reserva.mesa.capacidad} personas
                                            </p>
                                            {reserva.mesa.ubicacion && (
                                                <p className="text-sm text-muted-foreground">{reserva.mesa.ubicacion}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {reserva.notas && (
                                    <div className="pt-4 border-t">
                                        <div className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                                    Notas Adicionales
                                                </p>
                                                <p className="text-sm">{reserva.notas}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Cliente</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Nombre</p>
                                    <p className="font-medium">{reserva.cliente.nombre}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                                        <p className="font-medium">{reserva.cliente.telefono}</p>
                                    </div>
                                </div>

                                {reserva.cliente.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                                            <p className="font-medium text-sm break-all">{reserva.cliente.email}</p>
                                        </div>
                                    </div>
                                )}

                                <Link href={`/clientes/${reserva.cliente.id}`}>
                                    <Button variant="outline" className="w-full mt-4">
                                        Ver Perfil del Cliente
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Línea de Tiempo</CardTitle>
                                </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                    <div>
                                        <p className="text-sm font-medium">Reserva creada</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(reserva.created_at).toLocaleString('es-ES')}
                                        </p>
                                    </div>
                                </div>

                                {reserva.estado !== 'pendiente' && (
                                    <div className="flex items-start gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                Estado: {reserva.estado}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(reserva.updated_at).toLocaleString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
