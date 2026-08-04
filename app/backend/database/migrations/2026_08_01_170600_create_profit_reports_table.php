<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profit_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umkm_id')->constrained()->restrictOnDelete();
            $table->date('periode');
            $table->bigInteger('keuntungan_kotor')->nullable();
            $table->bigInteger('biaya_operasional')->nullable();
            $table->bigInteger('keuntungan_bersih')->nullable();
            $table->decimal('persen_bagi_hasil_snapshot', 5, 2)->nullable();
            $table->decimal('persen_fee_platform_snapshot', 5, 2)->default(5.00);
            $table->bigInteger('total_bagi_hasil_investor')->nullable();
            $table->bigInteger('fee_platform')->nullable();
            $table->bigInteger('total_dibayarkan')->nullable();
            $table->string('path_laporan_keuangan')->nullable();
            $table->text('catatan')->nullable();
            $table->enum('status', ['draft', 'submitted', 'approved', 'processed', 'overdue', 'rejected'])
                ->default('draft');
            $table->text('catatan_admin')->nullable();
            $table->date('deadline_at');
            $table->timestamp('submitted_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['umkm_id', 'periode']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profit_reports');
    }
};
