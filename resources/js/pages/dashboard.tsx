import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ShoppingCartIcon,
    ClipboardListIcon,
    UtensilsIcon,
    UsersIcon,
    DollarSignIcon,
    ClockIcon,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Props {
    stats: {
        pedidos_hoy: number;
        pedidos_pendientes: number;
        mesas_ocupadas: number;
        total_ventas_hoy: number;
    };
    mesas_ocupadas_detalle: {
        id: number;
        numero: string;
        capacidad: number;
        ubicacion: string;
    }[];
    mesas_reservadas_detalle: {
        id: number;
        numero: string;
        capacidad: number;
        ubicacion: string;
        cliente: string;
        hora: string;
    }[];
}

export default function Dashboard({ stats, mesas_ocupadas_detalle, mesas_reservadas_detalle }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Resumen del sistema de restaurante</p>
                </div>

                {/* Estadísticas */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pedidos Hoy</CardTitle>
                            <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pedidos_hoy}</div>
                            <p className="text-xs text-muted-foreground">Pedidos registrados hoy</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                            <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pedidos_pendientes}</div>
                            <p className="text-xs text-muted-foreground">En preparación/espera</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Mesas Ocupadas</CardTitle>
                            <UtensilsIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.mesas_ocupadas}</div>
                            <p className="text-xs text-muted-foreground">Mesas en uso</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
                            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">S/ {stats.total_ventas_hoy.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Total facturado</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Mesas Ocupadas Detalle */}
                {mesas_ocupadas_detalle.length > 0 && (
                    <div className="grid gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mesas Ocupadas</CardTitle>
                                <CardDescription>Detalle de mesas actualmente en uso</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    {mesas_ocupadas_detalle.map((mesa) => (
                                        <div key={mesa.id} className="flex items-center justify-between rounded-lg border p-4">
                                            <div>
                                                <p className="font-medium">Mesa {mesa.numero}</p>
                                                <p className="text-sm text-muted-foreground">{mesa.ubicacion || 'Sin ubicación'}</p>
                                            </div>
                                            <div className="text-sm font-medium text-red-500">Ocupada</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Mesas Reservadas Detalle */}
                {mesas_reservadas_detalle.length > 0 && (
                    <div className="grid gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reservas de Hoy</CardTitle>
                                <CardDescription>Mesas reservadas para el día de hoy</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    {mesas_reservadas_detalle.map((mesa) => (
                                        <div key={mesa.id} className="flex items-center justify-between rounded-lg border p-4 bg-yellow-50/50 dark:bg-yellow-900/10">
                                            <div>
                                                <p className="font-medium">Mesa {mesa.numero}</p>
                                                <p className="text-sm text-muted-foreground">{mesa.cliente}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-yellow-600 dark:text-yellow-500">
                                                    {mesa.hora}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{mesa.ubicacion || 'Sin ubicación'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Accesos rápidos */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pedidos</CardTitle>
                            <CardDescription>Gestiona los pedidos del restaurante</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href="/pedidos/create">
                                <Button className="w-full">
                                    <ShoppingCartIcon className="mr-2 h-4 w-4" />
                                    Nuevo Pedido
                                </Button>
                            </Link>
                            <Link href="/pedidos">
                                <Button variant="outline" className="w-full">
                                    Ver Todos los Pedidos
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Clientes</CardTitle>
                            <CardDescription>Administra la base de clientes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href="/clientes/create">
                                <Button className="w-full">
                                    <UsersIcon className="mr-2 h-4 w-4" />
                                    Nuevo Cliente
                                </Button>
                            </Link>
                            <Link href="/clientes">
                                <Button variant="outline" className="w-full">
                                    Ver Clientes
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Productos</CardTitle>
                            <CardDescription>Gestiona el menú del restaurante</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href="/productos/create">
                                <Button className="w-full">
                                    <ClipboardListIcon className="mr-2 h-4 w-4" />
                                    Nuevo Producto
                                </Button>
                            </Link>
                            <Link href="/productos">
                                <Button variant="outline" className="w-full">
                                    Ver Productos
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Mesas</CardTitle>
                            <CardDescription>Administra las mesas disponibles</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href="/mesas/create">
                                <Button className="w-full">
                                    <UtensilsIcon className="mr-2 h-4 w-4" />
                                    Nueva Mesa
                                </Button>
                            </Link>
                            <Link href="/mesas">
                                <Button variant="outline" className="w-full">
                                    Ver Mesas
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
