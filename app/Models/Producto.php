<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'categoria_id', 'nombre', 'sku', 'descripcion', 'tipo', 'precio', 'costo', 'stock', 'activo'
    ];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function items()
    {
        return $this->hasMany(PedidoItem::class);
    }
}
