import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { PlusIcon, SearchIcon } from 'lucide-react';

interface Cliente {
    id: number;
    nombre: string;
    email: string | null;
    telefono: string | null;
    documento: string | null;
}

interface Props {
    clientes: {
        data: Cliente[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        q?: string;
    };
}

export default function ClientesIndex({ clientes, filters }: Props) {
    const [search, setSearch] = useState(filters.q || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/clientes', { q: search }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Clientes" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Clientes</h1>
                    <Link href="/clientes/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Nuevo Cliente
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <Input
                        type="text"
                        placeholder="Buscar por nombre, email, teléfono..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <Button type="submit" variant="secondary">
                        <SearchIcon className="h-4 w-4" />
                    </Button>
                </form>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Documento</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clientes.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No hay clientes registrados
                                    </TableCell>
                                </TableRow>
                            ) : (
                                clientes.data.map((cliente) => (
                                    <TableRow key={cliente.id}>
                                        <TableCell className="font-medium">{cliente.nombre}</TableCell>
                                        <TableCell>{cliente.email || '-'}</TableCell>
                                        <TableCell>{cliente.telefono || '-'}</TableCell>
                                        <TableCell>{cliente.documento || '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Link href={`/clientes/${cliente.id}/edit`}>
                                                    <Button size="sm" variant="secondary">
                                                        Editar
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        if (confirm('¿Estás seguro de eliminar este cliente?')) {
                                                            router.delete(`/clientes/${cliente.id}`);
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

                {clientes.last_page > 1 && (
                    <div className="mt-4 flex justify-center gap-2">
                        {clientes.links.map((link, idx) => (
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
