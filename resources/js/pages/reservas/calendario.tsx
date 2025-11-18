import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Calendar, ChevronLeft, ChevronRight, List } from 'lucide-react';
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
    mesa: Mesa;
    cliente: Cliente;
}

interface Props {
    reservas: Reserva[];
    mesas: Mesa[];
    fecha: string;
}

export default function ReservasCalendario({ reservas, mesas, fecha }: Props) {
    const [selectedFecha, setSelectedFecha] = useState(fecha);

    const handleFechaChange = (newFecha: string) => {
        setSelectedFecha(newFecha);
        router.get('/reservas/calendario/view', { fecha: newFecha }, { preserveState: true });
    };

    const cambiarDia = (dias: number) => {
        const nuevaFecha = new Date(selectedFecha);
        nuevaFecha.setDate(nuevaFecha.getDate() + dias);
        handleFechaChange(nuevaFecha.toISOString().split('T')[0]);
    };

    const hoy = () => {
        handleFechaChange(new Date().toISOString().split('T')[0]);
    };

    // Generar horas del día (8:00 - 23:00)
    const horas = Array.from({ length: 16 }, (_, i) => 8 + i);

    // Obtener reservas para una mesa y hora específica
    const getReservasPorMesaYHora = (mesaId: number, hora: number) => {
        return reservas.filter((reserva) => {
            const inicio = new Date(reserva.fecha_hora_inicio);
            const fin = new Date(reserva.fecha_hora_fin);
            const horaActual = new Date(selectedFecha);
            horaActual.setHours(hora, 0, 0, 0);

            return (
                reserva.mesa_id === mesaId &&
                reserva.estado !== 'cancelada' &&
                inicio <= horaActual &&
                fin > horaActual
            );
        });
    };

    const getEstadoColor = (estado: string) => {
        const colores = {
            pendiente: 'bg-yellow-100 border-yellow-300 text-yellow-800',
            confirmada: 'bg-blue-100 border-blue-300 text-blue-800',
            completada: 'bg-green-100 border-green-300 text-green-800',
            cancelada: 'bg-gray-100 border-gray-300 text-gray-800',
        };
        return colores[estado as keyof typeof colores] || 'bg-gray-100';
    };

    const formatHora = (hora: number) => {
        return `${hora.toString().padStart(2, '0')}:00`;
    };

    const fechaActual = new Date(selectedFecha);
    const nombreMes = fechaActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const nombreDia = fechaActual.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' });

    return (
        <AppLayout>
            <Head title="Calendario de Reservas" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Calendario de Reservas</h1>
                        <p className="text-muted-foreground capitalize">{nombreMes}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/reservas">
                            <Button variant="outline">
                                <List className="mr-2 h-4 w-4" />
                                Vista Lista
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
                        <div className="flex items-center justify-between">
                            <CardTitle className="capitalize">{nombreDia}</CardTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => cambiarDia(-1)}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={hoy}>
                                    Hoy
                                </Button>
                                <Input
                                    type="date"
                                    value={selectedFecha}
                                    onChange={(e) => handleFechaChange(e.target.value)}
                                    className="w-40"
                                />
                                <Button variant="outline" size="sm" onClick={() => cambiarDia(1)}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border p-2 bg-muted text-left sticky left-0 z-10 bg-background min-w-[100px]">
                                            Hora
                                        </th>
                                        {mesas.map((mesa) => (
                                            <th key={mesa.id} className="border p-2 bg-muted text-center min-w-[150px]">
                                                <div className="font-semibold">Mesa {mesa.numero}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Cap. {mesa.capacidad}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {horas.map((hora) => (
                                        <tr key={hora}>
                                            <td className="border p-2 font-medium sticky left-0 bg-background">
                                                {formatHora(hora)}
                                            </td>
                                            {mesas.map((mesa) => {
                                                const reservasEnHora = getReservasPorMesaYHora(mesa.id, hora);
                                                return (
                                                    <td key={mesa.id} className="border p-1">
                                                        {reservasEnHora.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {reservasEnHora.map((reserva) => (
                                                                    <Link
                                                                        key={reserva.id}
                                                                        href={`/reservas/${reserva.id}`}
                                                                    >
                                                                        <div
                                                                            className={`p-2 rounded border text-xs cursor-pointer hover:shadow-md transition-shadow ${getEstadoColor(
                                                                                reserva.estado
                                                                            )}`}
                                                                        >
                                                                            <div className="font-semibold">
                                                                                {reserva.cliente.nombre}
                                                                            </div>
                                                                            <div className="flex items-center justify-between mt-1">
                                                                                <span>
                                                                                    👥 {reserva.numero_personas}
                                                                                </span>
                                                                                <span className="text-[10px]">
                                                                                    {new Date(
                                                                                        reserva.fecha_hora_inicio
                                                                                    ).toLocaleTimeString('es-ES', {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                    })}{' '}
                                                                                    -{' '}
                                                                                    {new Date(
                                                                                        reserva.fecha_hora_fin
                                                                                    ).toLocaleTimeString('es-ES', {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                    })}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="h-12 flex items-center justify-center text-muted-foreground text-xs">
                                                                -
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                                <span className="text-sm">Pendiente</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                                <span className="text-sm">Confirmada</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                                <span className="text-sm">Completada</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {reservas.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No hay reservas para esta fecha</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
