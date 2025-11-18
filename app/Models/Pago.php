<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    use HasFactory;

    protected $fillable = [
        'pedido_id', 'usuario_id', 'metodo', 'monto', 'estado', 'referencia', 'recibo_numero', 'recibido_en', 'detalles'
    ];

    protected $casts = [
        'recibido_en' => 'datetime',
        'detalles' => 'array',
    ];

    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
