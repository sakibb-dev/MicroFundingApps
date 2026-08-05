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
        Schema::table('investments', function (Blueprint $table) {
            // Tracks the platform -> UMKM capital handoff, which happens
            // manually outside the app after an investment is confirmed --
            // separate from confirmed_at (investor -> platform leg).
            $table->timestamp('forwarded_at')->nullable()->after('confirmed_at');
            $table->text('admin_notes')->nullable()->after('catatan_admin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('investments', function (Blueprint $table) {
            $table->dropColumn(['forwarded_at', 'admin_notes']);
        });
    }
};
