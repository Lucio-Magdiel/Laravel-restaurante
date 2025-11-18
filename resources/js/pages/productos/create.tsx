import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Categoria {
    id: number;
    nombre: string;
}

interface Props {
    categorias: Categoria[];
}

export default function ProductosCreate({ categorias }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        categoria_id: '',
        nombre: '',
        precio: '',
        tipo: 'plato',
        descripcion: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/productos');
    };

    return (
        <AppLayout>
            <Head title="Nuevo Producto" />
            <div className="p-6">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle>Nuevo Producto</CardTitle>
                        <CardDescription>Registra un nuevo producto o plato en el menú</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="nombre">Nombre *</Label>
                                <Input
                                    id="nombre"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    required
                                />
                                {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                            </div>

                            <div>
                                <Label htmlFor="categoria_id">Categoría</Label>
                                <Select value={data.categoria_id} onValueChange={(val) => setData('categoria_id', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categorias.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoria_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.categoria_id}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="precio">Precio *</Label>
                                <Input
                                    id="precio"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.precio}
                                    onChange={(e) => setData('precio', e.target.value)}
                                    required
                                />
                                {errors.precio && <p className="mt-1 text-sm text-red-600">{errors.precio}</p>}
                            </div>

                            <div>
                                <Label htmlFor="tipo">Tipo</Label>
                                <Select value={data.tipo} onValueChange={(val) => setData('tipo', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="plato">Plato</SelectItem>
                                        <SelectItem value="bebida">Bebida</SelectItem>
                                        <SelectItem value="postre">Postre</SelectItem>
                                        <SelectItem value="extra">Extra</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.tipo && <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>}
                            </div>

                            <div>
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Input
                                    id="descripcion"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                />
                                {errors.descripcion && (
                                    <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Guardar'}
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
