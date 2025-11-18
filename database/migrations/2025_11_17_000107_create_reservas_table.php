<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mesa_id')->constrained('mesas')->cascadeOnDelete();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->foreignId('usuario_id')->nullable()->constrained('users')->nullOnDelete(); // usuario que registra
            $table->dateTime('fecha_hora_inicio');
            $table->dateTime('fecha_hora_fin');
            $table->string('estado')->default('pendiente'); // pendiente, confirmada, cancelada, cumplida, no_show
            $table->text('notas')->nullable();
            $table->timestamps();
            $table->index(['mesa_id', 'fecha_hora_inicio']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};
