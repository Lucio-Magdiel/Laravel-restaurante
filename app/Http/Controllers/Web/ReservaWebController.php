<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Reserva;
use App\Models\Mesa;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReservaWebController extends Controller
{
    public function index(Request $request)
    {
        $query = Reserva::with(['mesa', 'cliente'])
            ->orderBy('fecha_hora_inicio', 'desc');

        // Filtro por fecha
        if ($request->filled('fecha')) {
            $fecha = Carbon::parse($request->fecha);
            $query->whereDate('fecha_hora_inicio', $fecha);
        }

        // Filtro por estado
        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        $reservas = $query->paginate(15);

        return Inertia::render('reservas/index', [
            'reservas' => $reservas,
            'filters' => $request->only(['fecha', 'estado']),
        ]);
    }

    public function create()
    {
        $mesas = Mesa::where('estado', 'disponible')
            ->orWhere('estado', 'reservada')
            ->get();
        
        $clientes = Cliente::orderBy('nombre')->get();

        return Inertia::render('reservas/create', [
            'mesas' => $mesas,
            'clientes' => $clientes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mesa_id' => 'required|exists:mesas,id',
            'cliente_id' => 'required|exists:clientes,id',
            'fecha_hora_inicio' => 'required|date|after:now',
            'fecha_hora_fin' => 'required|date|after:fecha_hora_inicio',
            'numero_personas' => 'required|integer|min:1|max:20',
            'notas' => 'nullable|string|max:500',
        ], [
            'fecha_hora_inicio.after' => 'La fecha de inicio debe ser posterior a la fecha actual.',
            'fecha_hora_fin.after' => 'La fecha de fin debe ser posterior a la fecha de inicio.',
        ]);

        // Validar solapamiento
        $solapamiento = Reserva::where('mesa_id', $validated['mesa_id'])
            ->where('estado', '!=', 'cancelada')
            ->where(function ($query) use ($validated) {
                $query->whereBetween('fecha_hora_inicio', [
                    $validated['fecha_hora_inicio'],
                    $validated['fecha_hora_fin']
                ])->orWhereBetween('fecha_hora_fin', [
                    $validated['fecha_hora_inicio'],
                    $validated['fecha_hora_fin']
                ])->orWhere(function ($q) use ($validated) {
                    $q->where('fecha_hora_inicio', '<=', $validated['fecha_hora_inicio'])
                      ->where('fecha_hora_fin', '>=', $validated['fecha_hora_fin']);
                });
            })
            ->exists();

        if ($solapamiento) {
            return back()->withErrors([
                'mesa_id' => 'La mesa ya está reservada en ese horario.'
            ]);
        }

        DB::transaction(function () use ($validated) {
            Reserva::create($validated);
            
            // Actualizar estado de la mesa
            Mesa::find($validated['mesa_id'])->update([
                'estado' => 'reservada'
            ]);
        });

        return redirect()->route('reservas.index')
            ->with('success', 'Reserva creada exitosamente.');
    }

    public function show(Reserva $reserva)
    {
        $reserva->load(['mesa', 'cliente']);

        return Inertia::render('reservas/show', [
            'reserva' => $reserva,
        ]);
    }

    public function destroy(Reserva $reserva)
    {
        DB::transaction(function () use ($reserva) {
            $reserva->update(['estado' => 'cancelada']);
            
            // Verificar si hay otras reservas activas para esta mesa
            $tieneOtrasReservas = Reserva::where('mesa_id', $reserva->mesa_id)
                ->where('id', '!=', $reserva->id)
                ->where('estado', 'confirmada')
                ->where('fecha_hora_inicio', '>=', now())
                ->exists();

            if (!$tieneOtrasReservas) {
                Mesa::find($reserva->mesa_id)->update([
                    'estado' => 'disponible'
                ]);
            }
        });

        return redirect()->route('reservas.index')
            ->with('success', 'Reserva cancelada exitosamente.');
    }

    public function calendario(Request $request)
    {
        $fecha = $request->filled('fecha') 
            ? Carbon::parse($request->fecha) 
            : Carbon::today();

        $reservas = Reserva::with(['mesa', 'cliente'])
            ->whereDate('fecha_hora_inicio', $fecha)
            ->where('estado', '!=', 'cancelada')
            ->orderBy('fecha_hora_inicio')
            ->get();

        $mesas = Mesa::all();

        return Inertia::render('reservas/calendario', [
            'reservas' => $reservas,
            'mesas' => $mesas,
            'fecha' => $fecha->format('Y-m-d'),
        ]);
    }

    public function confirmar(Reserva $reserva)
    {
        $reserva->update(['estado' => 'confirmada']);

        return back()->with('success', 'Reserva confirmada.');
    }

    public function completar(Reserva $reserva)
    {
        DB::transaction(function () use ($reserva) {
            $reserva->update(['estado' => 'completada']);
            
            Mesa::find($reserva->mesa_id)->update([
                'estado' => 'disponible'
            ]);
        });

        return back()->with('success', 'Reserva completada.');
    }
}
