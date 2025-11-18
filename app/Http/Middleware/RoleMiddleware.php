<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        if (!$user) {
            abort(401, 'No autenticado');
        }
        if (!in_array($user->role, $roles, true)) {
            abort(403, 'Rol no autorizado');
        }
        return $next($request);
    }
}
