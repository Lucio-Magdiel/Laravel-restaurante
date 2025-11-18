<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')->constrained('pedidos')->cascadeOnDelete();
            $table->foreignId('usuario_id')->nullable()->constrained('users')->nullOnDelete(); // caja
            $table->string('metodo')->default('simulacion'); // simulacion, efectivo, tarjeta
            $table->decimal('monto', 10, 2);
            $table->string('estado')->default('pendiente'); // pendiente, confirmado, rechazado
            $table->string('referencia')->nullable();
            $table->string('recibo_numero')->unique();
            $table->timestamp('recibido_en')->nullable();
            $table->json('detalles')->nullable();
            $table->timestamps();
            $table->index(['pedido_id', 'estado']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
