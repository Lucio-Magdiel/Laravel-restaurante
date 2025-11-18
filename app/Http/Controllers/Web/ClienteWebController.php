<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClienteWebController extends Controller
{
    public function index(Request $request): Response
    {
        $q = $request->query('q');
        $clientes = Cliente::when($q, function ($query) use ($q) {
                $like = "%$q%";
                $query->where(function ($sub) use ($like) {
                    $sub->where('nombre', 'like', $like)
                        ->orWhere('email', 'like', $like)
                        ->orWhere('telefono', 'like', $like);
                });
            })
            ->orderBy('nombre')
            ->paginate(15);

        return Inertia::render('clientes/index', [
            'clientes' => $clientes,
            'filters' => ['q' => $q],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('clientes/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:50',
            'documento' => 'nullable|string|max:50',
        ]);
        Cliente::create($data);
        return redirect()->route('clientes.index')->with('success', 'Cliente creado correctamente');
    }
}
