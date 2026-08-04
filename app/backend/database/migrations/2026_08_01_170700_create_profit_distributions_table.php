<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profit_distributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profit_report_id')->constrained()->restrictOnDelete();
            $table->foreignId('investment_id')->constrained()->restrictOnDelete();
            $table->bigInteger('nominal_bagi_hasil');
            $table->decimal('persen_kepemilikan_snapshot', 6, 3);
            $table->enum('status', ['pending', 'processed', 'failed'])->default('pending');
            $table->timestamp('tanggal_cair')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profit_distributions');
    }
};
