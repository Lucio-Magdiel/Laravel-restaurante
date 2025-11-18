<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('categoria_id')->nullable()->constrained('categorias')->nullOnDelete();
            $table->string('nombre');
            $table->string('sku')->nullable()->unique();
            $table->text('descripcion')->nullable();
            $table->string('tipo')->default('plato'); // plato, bebida, postre, extra
            $table->decimal('precio', 10, 2);
            $table->decimal('costo', 10, 2)->nullable();
            $table->integer('stock')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
            $table->index(['categoria_id', 'activo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
