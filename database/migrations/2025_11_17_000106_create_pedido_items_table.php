<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pedido_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')->constrained('pedidos')->cascadeOnDelete();
            $table->foreignId('producto_id')->nullable()->constrained('productos')->nullOnDelete();
            $table->unsignedInteger('cantidad');
            $table->decimal('precio_unitario', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->string('estado')->default('pendiente'); // pendiente, preparado, servido, cancelado
            $table->text('notas')->nullable();
            $table->timestamps();
            $table->index(['pedido_id', 'estado']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedido_items');
    }
};
