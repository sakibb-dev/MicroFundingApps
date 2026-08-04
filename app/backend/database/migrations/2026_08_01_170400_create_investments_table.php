<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('investor_id')->constrained()->restrictOnDelete();
            $table->foreignId('umkm_id')->constrained()->restrictOnDelete();
            $table->bigInteger('nominal');
            $table->decimal('persen_kepemilikan', 6, 3)->nullable();
            $table->enum('status', ['pending_confirmation', 'confirmed', 'active', 'completed', 'rejected'])
                ->default('pending_confirmation');
            $table->string('bukti_transfer_path')->nullable();
            $table->text('catatan_admin')->nullable();
            $table->foreignId('confirmed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investments');
    }
};
