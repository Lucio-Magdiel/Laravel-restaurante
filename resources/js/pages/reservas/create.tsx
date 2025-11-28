import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';

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
    email: string | null;
}

interface Props {
    mesas: Mesa[];
    clientes: Cliente[];
}

export default function ReservasCreate({ mesas, clientes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        mesa_id: '',
        cliente_id: '',
        fecha_hora_inicio: '',
        fecha_hora_fin: '',
        numero_personas: '2',
        notas: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/reservas');
    };

    // Calcular fecha mínima (hoy)
    const minDateTime = new Date().toISOString().slice(0, 16);

    // Auto-calcular fecha fin (2 horas después del inicio)
    const handleFechaInicioChange = (value: string) => {
        setData('fecha_hora_inicio', value);
        if (value) {
            const inicio = new Date(value);
            inicio.setHours(inicio.getHours() + 2);
            setData('fecha_hora_fin', inicio.toISOString().slice(0, 16));
        }
    };

    return (
        <AppLayout>
            <Head title="Nueva Reserva" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/reservas">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Nueva Reserva</h1>
                        <p className="text-muted-foreground">Crea una nueva reserva de mesa</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Reserva</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="cliente_id">
                                        Cliente <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.cliente_id}
                                        onValueChange={(value) => setData('cliente_id', value)}
                                    >
                                        <SelectTrigger id="cliente_id">
                                            <SelectValue placeholder="Selecciona un cliente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clientes.map((cliente) => (
                                                <SelectItem key={cliente.id} value={cliente.id.toString()}>
                                                    {cliente.nombre} - {cliente.telefono}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.cliente_id} />
                                    <p className="text-sm text-muted-foreground">
                                        ¿No encuentras al cliente?{' '}
                                        <Link href="/clientes/create" className="text-primary hover:underline">
                                            Crear nuevo cliente
                                        </Link>
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mesa_id">
                                        Mesa <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.mesa_id}
                                        onValueChange={(value) => setData('mesa_id', value)}
                                    >
                                        <SelectTrigger id="mesa_id">
                                            <SelectValue placeholder="Selecciona una mesa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mesas.map((mesa) => (
                                                <SelectItem
                                                    key={mesa.id}
                                                    value={mesa.id.toString()}
                                                    disabled={mesa.estado !== 'disponible'}
                                                >
                                                    Mesa {mesa.numero} - Capacidad: {mesa.capacidad} - {mesa.estado}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.mesa_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fecha_hora_inicio">
                                        Fecha y Hora de Inicio <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="fecha_hora_inicio"
                                        type="datetime-local"
                                        min={minDateTime}
                                        value={data.fecha_hora_inicio}
                                        onChange={(e) => handleFechaInicioChange(e.target.value)}
                                    />
                                    <InputError message={errors.fecha_hora_inicio} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fecha_hora_fin">
                                        Fecha y Hora de Fin <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="fecha_hora_fin"
                                        type="datetime-local"
                                        min={data.fecha_hora_inicio || minDateTime}
                                        value={data.fecha_hora_fin}
                                        onChange={(e) => setData('fecha_hora_fin', e.target.value)}
                                    />
                                    <InputError message={errors.fecha_hora_fin} />
                                    <p className="text-sm text-muted-foreground">
                                        Por defecto se asignan 2 horas de duración
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="numero_personas">
                                        Número de Personas <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="numero_personas"
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={data.numero_personas}
                                        onChange={(e) => setData('numero_personas', e.target.value)}
                                    />
                                    <InputError message={errors.numero_personas} />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="notas">Notas Adicionales</Label>
                                    <textarea
                                        id="notas"
                                        rows={3}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Ocasión especial, alergias, preferencias, etc."
                                        value={data.notas}
                                        onChange={(e) => setData('notas', e.target.value)}
                                    />
                                    <InputError message={errors.notas} />
                                    <p className="text-sm text-muted-foreground">Máximo 500 caracteres</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Link href="/reservas">
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Crear Reserva'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
