import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusIcon } from 'lucide-react';

interface Mesa {
    id: number;
    numero: string;
    capacidad: number;
    estado: string;
    ubicacion: string | null;
}

interface Props {
    mesas: Mesa[];
}

const estadoColors: Record<string, string> = {
    disponible: 'bg-green-500',
    ocupada: 'bg-red-500',
    reservada: 'bg-yellow-500',
    inactiva: 'bg-gray-500',
};

export default function MesasIndex({ mesas }: Props) {
    return (
        <AppLayout>
            <Head title="Mesas" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Mesas</h1>
                    <Link href="/mesas/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Nueva Mesa
                        </Button>
                    </Link>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Número</TableHead>
                                <TableHead>Capacidad</TableHead>
                                <TableHead>Ubicación</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mesas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No hay mesas registradas
                                    </TableCell>
                                </TableRow>
                            ) : (
                                mesas.map((mesa) => (
                                    <TableRow key={mesa.id}>
                                        <TableCell className="font-medium">{mesa.numero}</TableCell>
                                        <TableCell>{mesa.capacidad} personas</TableCell>
                                        <TableCell>{mesa.ubicacion || '-'}</TableCell>
                                        <TableCell>
                                            <Badge className={estadoColors[mesa.estado]}>{mesa.estado}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
