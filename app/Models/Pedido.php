<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'mesa_id', 'cliente_id', 'usuario_id', 'estado', 'total', 'notas', 'hora_entregado', 'hora_pagado'
    ];

    protected $casts = [
        'hora_entregado' => 'datetime',
        'hora_pagado' => 'datetime',
    ];

    public function mesa()
    {
        return $this->belongsTo(Mesa::class);
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function items()
    {
        return $this->hasMany(PedidoItem::class);
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }
}
