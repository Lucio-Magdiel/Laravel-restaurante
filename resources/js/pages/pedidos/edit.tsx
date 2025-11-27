import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Mesa {
    id: number;
    numero: string;
}

interface Cliente {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    categoria?: { nombre: string };
}

interface ItemPedido {
    producto_id: number;
    cantidad: number;
    producto?: Producto;
    precio_unitario?: number;
    subtotal?: number;
}

interface Pedido {
    id: number;
    mesa_id: number | null;
    cliente_id: number | null;
    notas: string | null;
    items: ItemPedido[];
}

interface Props {
    pedido: Pedido;
    mesas: Mesa[];
    clientes: Cliente[];
    productos: Producto[];
}

export default function PedidosEdit({ pedido, mesas, clientes, productos }: Props) {
    const [items, setItems] = useState<ItemPedido[]>([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState<number | null>(null);
    const [cantidad, setCantidad] = useState(1);

    const { data, setData, put, processing, errors, transform } = useForm({
        mesa_id: pedido.mesa_id ? String(pedido.mesa_id) : '',
        cliente_id: pedido.cliente_id ? String(pedido.cliente_id) : '',
        notas: pedido.notas || '',
        items: [] as { producto_id: number; cantidad: number }[],
    });

    useEffect(() => {
        // Initialize items from pedido
        if (pedido.items) {
            setItems(pedido.items.map(item => ({
                producto_id: item.producto_id || (item as any).id, // Handle potential structure diff
                cantidad: item.cantidad,
                producto: item.producto, // Assuming loaded
            })));
        }
    }, [pedido]);

    const agregarItem = () => {
        if (!productoSeleccionado) return;

        const producto = productos.find((p) => p.id === productoSeleccionado);
        if (!producto) return;

        setItems([
            ...items,
            {
                producto_id: productoSeleccionado,
                cantidad,
                producto,
            },
        ]);

        setProductoSeleccionado(null);
        setCantidad(1);
    };

    const eliminarItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calcularTotal = () => {
        return items.reduce((sum, item) => {
            const precio = item.producto?.precio || 0;
            return sum + precio * item.cantidad;
        }, 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            items: items.map((item) => ({
                producto_id: item.producto_id,
                cantidad: item.cantidad,
            })),
        }));
        put(`/pedidos/${pedido.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Editar Pedido #${pedido.id}`} />
            <div className="p-6">
                <Card className="mx-auto max-w-4xl">
                    <CardHeader>
                        <CardTitle>Editar Pedido #{pedido.id}</CardTitle>
                        <CardDescription>Modifica los detalles del pedido</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="mesa_id">Mesa</Label>
                                    <Select value={data.mesa_id} onValueChange={(val) => setData('mesa_id', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar mesa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mesas.map((mesa) => (
                                                <SelectItem key={mesa.id} value={String(mesa.id)}>
                                                    {mesa.numero}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.mesa_id && <p className="mt-1 text-sm text-red-600">{errors.mesa_id}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="cliente_id">Cliente</Label>
                                    <Select value={data.cliente_id} onValueChange={(val) => setData('cliente_id', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar cliente (opcional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clientes.map((cliente) => (
                                                <SelectItem key={cliente.id} value={String(cliente.id)}>
                                                    {cliente.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.cliente_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.cliente_id}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="notas">Notas</Label>
                                <Input
                                    id="notas"
                                    value={data.notas}
                                    onChange={(e) => setData('notas', e.target.value)}
                                    placeholder="Instrucciones especiales..."
                                />
                            </div>

                            <div className="space-y-4">
                                <Label>Items del Pedido</Label>
                                <div className="flex gap-2">
                                    <Select
                                        value={productoSeleccionado?.toString() || ''}
                                        onValueChange={(val) => setProductoSeleccionado(Number(val))}
                                    >
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Seleccionar producto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {productos.map((producto) => (
                                                <SelectItem key={producto.id} value={String(producto.id)}>
                                                    {producto.nombre} - S/ {producto.precio.toFixed(2)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={cantidad}
                                        onChange={(e) => setCantidad(Number(e.target.value))}
                                        className="w-24"
                                    />
                                    <Button type="button" onClick={agregarItem} disabled={!productoSeleccionado}>
                                        <PlusIcon className="h-4 w-4" />
                                    </Button>
                                </div>

                                {items.length > 0 && (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Producto</TableHead>
                                                    <TableHead>Cantidad</TableHead>
                                                    <TableHead>Precio Unit.</TableHead>
                                                    <TableHead>Subtotal</TableHead>
                                                    <TableHead></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {items.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.producto?.nombre}</TableCell>
                                                        <TableCell>{item.cantidad}</TableCell>
                                                        <TableCell>S/ {item.producto?.precio.toFixed(2)}</TableCell>
                                                        <TableCell>
                                                            S/{' '}
                                                            {((item.producto?.precio || 0) * item.cantidad).toFixed(2)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => eliminarItem(index)}
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-right font-bold">
                                                        TOTAL:
                                                    </TableCell>
                                                    <TableCell className="font-bold">
                                                        S/ {calcularTotal().toFixed(2)}
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}

                                {errors.items && <p className="text-sm text-red-600">{errors.items}</p>}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing || items.length === 0}>
                                    {processing ? 'Actualizando...' : 'Actualizar Pedido'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
