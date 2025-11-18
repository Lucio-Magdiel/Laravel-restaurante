import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClientesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        email: '',
        telefono: '',
        documento: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/clientes');
    };

    return (
        <AppLayout>
            <Head title="Nuevo Cliente" />
            <div className="p-6">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle>Nuevo Cliente</CardTitle>
                        <CardDescription>Registra un nuevo cliente en el sistema</CardDescription>
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
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                />
                                {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
                            </div>

                            <div>
                                <Label htmlFor="documento">Documento (DNI/RUC)</Label>
                                <Input
                                    id="documento"
                                    value={data.documento}
                                    onChange={(e) => setData('documento', e.target.value)}
                                />
                                {errors.documento && <p className="mt-1 text-sm text-red-600">{errors.documento}</p>}
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
