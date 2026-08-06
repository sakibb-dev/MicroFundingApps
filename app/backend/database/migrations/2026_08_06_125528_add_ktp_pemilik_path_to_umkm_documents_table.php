<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('umkm_documents', function (Blueprint $table) {
            // Previously stored on disk but the returned path was discarded
            // -- registration never persisted it anywhere, making the
            // owner's KTP unretrievable for admin review.
            $table->string('path_ktp_pemilik')->nullable()->after('path_nib');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('umkm_documents', function (Blueprint $table) {
            $table->dropColumn('path_ktp_pemilik');
        });
    }
};
