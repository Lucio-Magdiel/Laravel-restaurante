<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Mesa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MesaWebController extends Controller
{
    public function index(): Response
    {
        $mesas = Mesa::orderBy('numero')->get();
        return Inertia::render('mesas/index', [
            'mesas' => $mesas,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('mesas/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'numero' => 'required|string|unique:mesas,numero',
            'capacidad' => 'required|integer|min:1',
            'ubicacion' => 'nullable|string',
            'descripcion' => 'nullable|string',
        ]);
        Mesa::create($data);
        return redirect()->route('mesas.index')->with('success', 'Mesa creada correctamente');
    }

    public function edit(Mesa $mesa): Response
    {
        return Inertia::render('mesas/edit', [
            'mesa' => $mesa,
        ]);
    }

    public function update(Request $request, Mesa $mesa)
    {
        $data = $request->validate([
            'numero' => 'required|string|unique:mesas,numero,' . $mesa->id,
            'capacidad' => 'required|integer|min:1',
            'ubicacion' => 'nullable|string',
            'descripcion' => 'nullable|string',
        ]);
        $mesa->update($data);
        return redirect()->route('mesas.index')->with('success', 'Mesa actualizada correctamente');
    }

    public function destroy(Mesa $mesa)
    {
        $mesa->delete();
        return redirect()->route('mesas.index')->with('success', 'Mesa eliminada correctamente');
    }
}
