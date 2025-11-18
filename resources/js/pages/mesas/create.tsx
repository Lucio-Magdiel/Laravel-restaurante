import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MesasCreate() {
    const { data, setData, post, processing, errors } = useForm({
        numero: '',
        capacidad: '',
        ubicacion: '',
        descripcion: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mesas');
    };

    return (
        <AppLayout>
            <Head title="Nueva Mesa" />
            <div className="p-6">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle>Nueva Mesa</CardTitle>
                        <CardDescription>Registra una nueva mesa en el restaurante</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="numero">Número de Mesa *</Label>
                                <Input
                                    id="numero"
                                    value={data.numero}
                                    onChange={(e) => setData('numero', e.target.value)}
                                    placeholder="M1, M2, TERRAZA1..."
                                    required
                                />
                                {errors.numero && <p className="mt-1 text-sm text-red-600">{errors.numero}</p>}
                            </div>

                            <div>
                                <Label htmlFor="capacidad">Capacidad *</Label>
                                <Input
                                    id="capacidad"
                                    type="number"
                                    min="1"
                                    value={data.capacidad}
                                    onChange={(e) => setData('capacidad', e.target.value)}
                                    required
                                />
                                {errors.capacidad && <p className="mt-1 text-sm text-red-600">{errors.capacidad}</p>}
                            </div>

                            <div>
                                <Label htmlFor="ubicacion">Ubicación</Label>
                                <Input
                                    id="ubicacion"
                                    value={data.ubicacion}
                                    onChange={(e) => setData('ubicacion', e.target.value)}
                                    placeholder="Sala principal, Terraza..."
                                />
                                {errors.ubicacion && <p className="mt-1 text-sm text-red-600">{errors.ubicacion}</p>}
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
