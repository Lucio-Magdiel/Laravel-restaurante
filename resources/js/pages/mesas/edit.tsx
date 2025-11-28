import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Mesa {
    id: number;
    numero: string;
    capacidad: number;
    ubicacion: string | null;
}

interface Props {
    mesa: Mesa;
}

export default function MesasEdit({ mesa }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        numero: mesa.numero || '',
        capacidad: mesa.capacidad ? String(mesa.capacidad) : '',
        ubicacion: mesa.ubicacion || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/mesas/${mesa.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Editar Mesa ${mesa.numero}`} />
            <div className="p-6">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle>Editar Mesa</CardTitle>
                        <CardDescription>Modifica los datos de la mesa</CardDescription>
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

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Actualizando...' : 'Actualizar'}
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
