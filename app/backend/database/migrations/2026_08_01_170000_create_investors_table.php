<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('no_ktp', 32)->unique();
            $table->date('tanggal_lahir');
            $table->string('no_hp', 20);
            $table->string('kota_domisili');
            $table->text('alamat');
            $table->string('bank')->nullable();
            $table->string('no_rekening')->nullable();
            $table->enum('kyc_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
            $table->softDeletes();

            $table->index('kyc_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investors');
    }
};
