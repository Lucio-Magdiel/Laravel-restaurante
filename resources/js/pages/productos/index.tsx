import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusIcon } from 'lucide-react';

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    tipo: string;
    activo: boolean;
    categoria?: { nombre: string };
}

interface Props {
    productos: {
        data: Producto[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function ProductosIndex({ productos }: Props) {
    return (
        <AppLayout>
            <Head title="Productos" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Productos</h1>
                    <Link href="/productos/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Nuevo Producto
                        </Button>
                    </Link>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {productos.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No hay productos registrados
                                    </TableCell>
                                </TableRow>
                            ) : (
                                productos.data.map((producto) => (
                                    <TableRow key={producto.id}>
                                        <TableCell className="font-medium">{producto.nombre}</TableCell>
                                        <TableCell>{producto.categoria?.nombre || '-'}</TableCell>
                                        <TableCell>{producto.tipo}</TableCell>
                                        <TableCell>S/ {producto.precio.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant={producto.activo ? 'default' : 'secondary'}>
                                                {producto.activo ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Link href={`/productos/${producto.id}/edit`}>
                                                    <Button size="sm" variant="secondary">
                                                        Editar
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        if (confirm('¿Estás seguro de eliminar este producto?')) {
                                                            router.delete(`/productos/${producto.id}`);
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

                {productos.last_page > 1 && (
                    <div className="mt-4 flex justify-center gap-2">
                        {productos.links.map((link, idx) => (
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
