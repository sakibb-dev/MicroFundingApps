<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('umkms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('nama_usaha');
            $table->string('kategori');
            $table->string('kota');
            $table->unsignedSmallInteger('tahun_berdiri')->nullable();
            $table->unsignedInteger('jumlah_karyawan')->nullable();
            $table->text('deskripsi');
            $table->string('nib', 32)->nullable();
            $table->bigInteger('target_dana');
            $table->bigInteger('total_terkumpul')->default(0);
            $table->unsignedInteger('tenor_bulan');
            $table->decimal('persen_bagi_hasil', 5, 2);
            $table->bigInteger('omzet_bulanan')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('catatan_admin')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('kategori');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('umkms');
    }
};
